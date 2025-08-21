// Mock generalControler before it's used by other modules
jest.mock('../controllers/generalControler', () => ({
    getAll: jest.fn().mockReturnValue((req, res, next) => next()),
    getOne: jest.fn().mockReturnValue((req, res, next) => next()),
    deleteOne: jest.fn().mockReturnValue((req, res, next) => next()),
    createOne: jest.fn().mockReturnValue((req, res, next) => next()),
    updateOne: jest.fn().mockReturnValue((req, res, next) => next()),
}));

const request = require('supertest');
const app = require('../app');
const Interest = require('../models/InterestFormModel');
const Property = require('../models/propertyModel');
const authController = require('../controllers/authController');

// Mock other dependencies
jest.mock('../models/InterestFormModel');
jest.mock('../models/propertyModel');

// Mock middleware
let mockUser = { _id: 'buyerId', role: 'buyer', name: 'Test Buyer', phone: '555-5555', email: 'buyer@test.com' };
jest.mock('../controllers/authController', () => ({
    ...jest.requireActual('../controllers/authController'),
    protect: jest.fn((req, res, next) => {
        req.user = mockUser;
        next();
    }),
}));


describe('Interest Form API Endpoints', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/v1/properties/:propertyId/interest/buyer', () => {
        const interestData = {
            message: 'I am very interested in this property.',
        };

        it('should allow an authenticated user to submit an interest form', async () => {
            // Setup mocks for the checks inside the controller
            Property.findById.mockResolvedValue({ _id: 'propertyId123' }); // Property exists
            Interest.find.mockResolvedValue([]); // No existing interest form

            // Mock the save method on the Interest model instance
            Interest.prototype.save = jest.fn().mockResolvedValue({
                ...interestData,
                _id: 'interestId',
                property: 'propertyId123',
                user: 'buyerId'
            });

            const res = await request(app)
                .post('/api/v1/properties/propertyId123/interest/buyer')
                .send(interestData);

            expect(res.statusCode).toEqual(201);
            expect(res.body.status).toBe('success');
            expect(Property.findById).toHaveBeenCalledWith('propertyId123');
            expect(Interest.find).toHaveBeenCalled();
            expect(Interest.prototype.save).toHaveBeenCalled();
        });
    });
});
