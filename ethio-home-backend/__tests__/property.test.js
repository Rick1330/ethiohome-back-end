const request = require('supertest');
const app = require('../app');
const Property = require('../models/propertyModel');
const authController = require('../controllers/authController');

// Mock dependencies
jest.mock('../models/propertyModel');

// Mock middleware
let mockUser = { _id: 'userId', role: 'seller' }; // Default mock user
jest.mock('../controllers/authController', () => ({
    ...jest.requireActual('../controllers/authController'),
    protect: jest.fn((req, res, next) => {
        req.user = mockUser; // Attach the dynamic mock user
        next();
    }),
    restrictTo: jest.fn((...roles) => (req, res, next) => {
        if (roles.includes(mockUser.role)) {
            next();
        } else {
            res.status(403).json({ status: 'fail', message: 'You do not have permission to perform this action' });
        }
    }),
}));

// Mock the permit middleware from propertyController
jest.mock('../controllers/propertyController', () => {
    const originalModule = jest.requireActual('../controllers/propertyController');
    return {
        ...originalModule,
        permit: jest.fn((req, res, next) => next()), // For now, always permit
    };
});


describe('Property API Endpoints', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/v1/properties', () => {
        const propertyData = {
            title: 'Beautiful House',
            price: 500000,
            location: { city: 'Addis Ababa', subCity: 'Bole' },
            area: 250,
            bedrooms: 4,
            bathrooms: 3,
            propertyType: 'House',
            owner: 'userId'
        };

        it('should allow an authorized user (seller) to create a property', async () => {
            mockUser = { _id: 'sellerId', role: 'seller' };
            Property.create.mockResolvedValue({ ...propertyData, _id: 'propertyId' });

            const res = await request(app)
                .post('/api/v1/properties')
                .send(propertyData);

            expect(res.statusCode).toEqual(201);
            expect(res.body.status).toBe('success');
            // The createOne factory sets owner from req.user.id
            expect(Property.create).toHaveBeenCalledWith({ ...propertyData, owner: 'sellerId' });
        });
        // ... other POST tests
    });

    describe('PUT /api/v1/properties/:id (Verify)', () => {
        it('should allow an admin to verify a property', async () => {
            mockUser = { _id: 'adminId', role: 'admin' };
            const mockProperty = {
                _id: 'propertyToVerify',
                isVerified: false,
                save: jest.fn().mockImplementation(function() {
                    this.isVerified = true; // Simulate the save operation
                    return Promise.resolve(this);
                })
            };
            Property.findById.mockResolvedValue(mockProperty);

            const res = await request(app)
                .put('/api/v1/properties/propertyToVerify');

            expect(res.statusCode).toEqual(200);
            expect(Property.findById).toHaveBeenCalledWith('propertyToVerify');
            expect(mockProperty.save).toHaveBeenCalled();
            // Corrected the response path and property name
            expect(res.body.data.data.isVerified).toBe(true);
        });

        it('should NOT allow a seller to verify a property', async () => {
            mockUser = { _id: 'sellerId', role: 'seller' };

            const res = await request(app)
                .put('/api/v1/properties/propertyToVerify');

            expect(res.statusCode).toEqual(403);
        });
    });
});
