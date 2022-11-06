const { User } = require('../../../modules/users');
const auth = require('../../../middleware/auth'); 
const mongoose = require('mongoose');

describe('Auth Middleware', () => {
  it('should return req.user with the payload of a valid JWT', () => {
    const user = { _id: mongoose.Types.ObjectId().toHexString(), isAdmin: false };
    token = new User(user).generateAuthToken();
    let req = {
      header: jest.fn().mockReturnValue(token)
    }

    let res = {};
    let next = jest.fn();
    
    auth(req, res, next);
    expect(req.user).toMatchObject(user);
  })
});
