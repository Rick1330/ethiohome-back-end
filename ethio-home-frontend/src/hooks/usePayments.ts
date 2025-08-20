import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '@/services/payment';
import { toast } from 'sonner';

export const usePayments = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  paymentType?: string;
}) => {
  return useQuery({
    queryKey: ['payments', params],
    queryFn: () => paymentService.getMyPayments(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePaymentStats = () => {
  return useQuery({
    queryKey: ['payment-stats'],
    queryFn: () => paymentService.getPaymentStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useInitializePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: paymentService.initializePayment,
    onSuccess: (data) => {
      toast.success('Payment initialized successfully');
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to initialize payment');
    },
  });
};

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: paymentService.verifyPayment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      
      if (data.status === 'success') {
        toast.success('Payment verified successfully');
      } else if (data.status === 'failed') {
        toast.error('Payment verification failed');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to verify payment');
    },
  });
};

export const useRefundPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ paymentId, reason }: { paymentId: string; reason: string }) =>
      paymentService.refundPayment(paymentId, reason),
    onSuccess: () => {
      toast.success('Payment refunded successfully');
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['payment-stats'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to refund payment');
    },
  });
};

