const axios=require('axios');
const SubscriptionPlan = require('../models/SubscriptionPlanModel');
const catchAsync=require('../utils/catchAsync');
const AppError=require('../utils/appError');

exports.createSubscriptionPlan = catchAsync(async (req, res, next) => {
  const subscriptionPlan= await SubscriptionPlan.findById( req.user._id);
  //console.log(subscriptionPlan);
  if(subscriptionPlan){
    throw new AppError('this seller or agent is already set subscription plan',404);
  }

  const {interval, amount ,frequency } = req.body;
  if(!frequency){
    req.body.frequency=1;
  }

  if (!interval || !amount) {
    return next(new AppError('Please provide interval and amount', 400));
  }

  const validIntervals = ['weekly', 'monthly', 'quarterly', 'annually'];
  if (!validIntervals.includes(interval)) {
    return next(new AppError('Invalid interval. Use weekly, monthly, quarterly, or annually', 400));
  }

  const name=req.user.name.split(' ');
  req.body.email=req.user.email;
  req.body.first_name=name[0];
  req.body.last_name=name[1];
  req.body.phone_number=req.user.phone; 
  req.body.tx_ref=`${req.user._id}-${Date.now()}`; 
  req.body.callback_url= `${req.protocol}://${req.hostname}/api/v1/properties`;
  req.body.return_url=`${req.protocol}://${req.hostname}/api/v1/subscription/verify-payment/${req.body.tx_ref}`;

  const response = await axios.post('https://api.chapa.co/v1/transaction/initialize',req.body,
    {
      headers: {
      Authorization: `Bearer ${process.env.CHAPA_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
  if (response.data.status !== 'success') {
    return next(new AppError('Failed to create subscription plan', 500));
  }

  res.status(201).json({
    status: 'success',
    data: response.data,
  });
});

exports.verifyPayment = catchAsync (async (req, res, next) => {
  // Verify the payment
  const response = await axios.get(`https://api.chapa.co/v1/transaction/verify/${req.params.tx_ref}`, {
    headers: {
      Authorization: `Bearer ${process.env.CHAPA_API_KEY}`,
    },
  });

 if (response.status == 200 && response.data.data.status == "success") {
    
      let subscriptionPlan = await SubscriptionPlan.findOneAndUpdate(
        { seller: req.user._id, active: true },
        {
          $push: {
            tx_ref: req.params.tx_ref,
            paymentDate: Date.now(),
          },
        },
        { new: true }
      );

      // If no active subscription exists, create a new one
      if (!subscriptionPlan) {
        subscriptionPlan = await SubscriptionPlan.create({
          seller: req.user._id,
          interval: response.data.data.interval || 'monthly',
          amount: response.data.data.amount,
          currency: response.data.data.currency || 'ETB',
          tx_ref: [req.params.tx_ref],
          frequency: response.data.data.frequency || 1,
          paymentDate: [Date.now()],
          active: true,
        });
      }
    //console.log(subscriptionPlan);
    res.status(200).json({
      status: 'success',
      data: subscriptionPlan,
    });
  } else {
    return next(new AppError('Payment verification failed', 500));
  }
});

exports.verifySubscriptionWebhook = catchAsync(async (req, res, next) => {
    // Get the secret key from environment variables
    const secret = process.env.CHAPA_WEBHOOK_SECRET;
    
    // Verify webhook signature
    const hash = crypto
        .createHmac('sha256', secret)
        .update(JSON.stringify(req.body))
        .digest('hex');
    
    if (hash !== req.headers['chapa-signature']) {
        return next(new AppError('Invalid webhook signature', 401));
    }

    const event = req.body;

    try {
        switch (event.status) {
            case 'success':
                // Create new subscriptionPlan record
                const subscriptionPlan = await subscriptionPlan.create({
                    property: event.meta?.propertyId, // Assuming propertyId is passed in meta
                    buyer: event.meta?.userId, // Assuming userId is passed in meta
                    amount: parseFloat(event.amount),
                    currency: event.currency,
                    chapa_charge: parseFloat(event.charge),
                    tx_ref: event.tx_ref,
                    payment_method: event.payment_method,
                    paid: true
                });
                break;

            case 'failed':
                // Handle failed payment
                // You might want to log this or notify someone
                console.log('Payment failed:', event);
                break;

            case 'pending':
                // Handle pending payment
                // You might want to update an existing record or create with paid: false
                console.log('Payment pending:', event);
                break;

            case 'refunding':
                // Handle refunding case
                await subscriptionPlan.findOneAndUpdate(
                    { tx_ref: event.tx_ref },
                    { paid: false },
                    { new: true }
                );
                break;

            default:
                console.log('Unknown event status:', event.status);
                break;
        }

        // Send success response to Chapa
        res.status(200).json({
            status: 'success'
        });
    } catch (err) {
        console.error('Webhook processing error:', err);
        return next(new AppError('Error processing webhook', 500));
    }
});

exports.getSubscriptionPlans = catchAsync(async (req, res, next) => {
  let plans;
  if(req.user.role == 'seller' || req.user.role == 'agent' ) {
     plans = await SubscriptionPlan.find({ seller: req.user._id, active: true });
  }else{
    plans = await SubscriptionPlan.find();
  } 
  
  res.status(200).json({
    status: 'success',
    results: plans.length,
    data: plans
  });
});

exports.updateSubscriptionPlan = catchAsync(async (req, res, next) => {
  const { planId } = req.params;                              
  const { interval, amount, frequency } = req.body;
  if (!interval || !amount) {
    return next(new AppError('Please provide interval and amount', 400));
  }     
  const validIntervals = ['weekly', 'monthly', 'quarterly', 'annually'];
  if (!validIntervals.includes(interval)) {
    return next(new AppError('Invalid interval. Use weekly, monthly, quarterly, or annually', 400));
  }
  const plan = await SubscriptionPlan.findByIdAndUpdate(
    planId,
    { interval, amount, frequency },
    { new: true, runValidators: true }
  );
  if (!plan) {
    return next(new AppError('No subscription plan found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: plan
  })
});

  exports.updateSubscriptionstatus= catchAsync(async (req, res, next) => {
  const { planId } = req.params;                
  const { active } = req.body;  
  if (active === undefined) {
    return next(new AppError('Please provide active status', 400));   
  }
  if (typeof active !== 'boolean') {
    return next(new AppError('Active status must be a boolean', 400));
  }
  const plan = await SubscriptionPlan.findByIdAndUpdate(
    planId,
    { active },
    { new: true, runValidators: true }
  );
  if (!plan) {
    return next(new AppError('No subscription plan found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: plan
  });
});

  exports.deleteSubscriptionPlan= catchAsync(async (req, res, next) => {
  const { planId } = req.params;

  const plan = await SubscriptionPlan.findByIdAndDelete(planId);
  if (!plan) {
    return next(new AppError('No subscription plan found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
});


