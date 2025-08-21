const request = require('supertest');
const app = require('../app');
const User = require('../models/userModel');
const Email = require('../utils/email');
const authController = require('../controllers/authController');

// Mock dependencies
jest.mock('../models/userModel');
jest.mock('../utils/email');

// Mock middleware. We need to mock 'protect' to simulate an authenticated user.
jest.mock('../controllers/authController', () => ({
    ...jest.requireActual('../controllers/authController'), // import and retain original functionalities
    protect: jest.fn((req, res, next) => {
      req.user = { _id: 'mockUserId', id: 'mockUserId' }; // Mock user object
      next();
    }),
}));


describe('Auth API Endpoints', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- Signup Tests ---
  describe('POST /api/v1/users/signup', () => {
    // Basic success and failure cases
    it('should create a new user and send a verification email', async () => {
        const userData = { name: 'Test User', email: 'test@example.com', password: 'password123', passwordConfirm: 'password123', phone: '1234567890' };
        User.find.mockResolvedValue([]);
        User.create.mockResolvedValue({ _id: 'some_user_id', name: 'Test User', email: 'test@example.com' });
        Email.prototype.sendWelcome = jest.fn().mockResolvedValue();
        const res = await request(app).post('/api/v1/users/signup').send(userData);
        expect(res.statusCode).toEqual(201);
    });
  });

  // --- Login Tests ---
  describe('POST /api/v1/users/login', () => {
    it('should login a verified user and return a token', async () => {
        const mockUser = { _id: 'userId123', email: 'test@example.com', password: 'hashedPassword', isVerified: true, checkPassword: jest.fn().mockResolvedValue(true) };
        User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });
        const res = await request(app).post('/api/v1/users/login').send({ email: 'test@example.com', password: 'password123' });
        expect(res.statusCode).toEqual(200);
        expect(res.body.token).toBeDefined();
    });
  });

  // --- Logout Test ---
  describe('GET /api/v1/users/logout', () => {
    it('should clear the JWT cookie and return success', async () => {
      const res = await request(app).get('/api/v1/users/logout');
      expect(res.statusCode).toEqual(200);
      expect(res.headers['set-cookie'][0]).toContain('jwt=loggedout');
    });
  });

  // --- Forgot & Reset Password Tests ---
  describe('Password Recovery', () => {
    it('should send a password reset email on forgotPassword', async () => {
        const mockUser = { email: 'test@example.com', createPasswordResetToken: jest.fn().mockReturnValue('resetToken123'), save: jest.fn().mockResolvedValue() };
        User.findOne.mockResolvedValue(mockUser);
        Email.prototype.sendPasswordReset = jest.fn().mockResolvedValue();
        const res = await request(app).post('/api/v1/users/forgotPassword').send({ email: 'test@example.com' });
        expect(res.statusCode).toEqual(200);
    });
  });

  // --- Update Password Test ---
  describe('PATCH /api/v1/users/updateMyPassword', () => {
    it('should update the user password successfully', async () => {
      const mockUser = {
        _id: 'mockUserId',
        password: 'hashedOldPassword',
        checkPassword: jest.fn().mockResolvedValue(true),
        save: jest.fn().mockResolvedValue(),
        isVerified: true, // User must be verified to get a token
      };
      User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });

      const res = await request(app)
        .patch('/api/v1/users/updateMyPassword')
        .send({ passwordCurrent: 'oldPassword123', password: 'newPassword456', passwordConfirm: 'newPassword456' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.token).toBeDefined();
      expect(mockUser.checkPassword).toHaveBeenCalledWith('oldPassword123', 'hashedOldPassword');
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should return an error for incorrect current password', async () => {
        const mockUser = { _id: 'mockUserId', password: 'hashedOldPassword', checkPassword: jest.fn().mockResolvedValue(false) };
        User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });

        const res = await request(app)
          .patch('/api/v1/users/updateMyPassword')
          .send({ passwordCurrent: 'wrongOldPassword', password: 'newPassword456', passwordConfirm: 'newPassword456' });

        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toBe('Your current password is wrong.');
    });
  });
});
