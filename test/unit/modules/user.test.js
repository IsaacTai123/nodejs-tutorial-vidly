const { User } = require('../../../modules/users');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

describe('generateAuthToken', () => {
  it('should return a valid JWT token', () => {
    let payload = { 
      _id: mongoose.Types.ObjectId().toHexString(), 
      isAdmin: true 
    };
    const user = new User(payload);
    const token = user.generateAuthToken();
    console.log(`user id: ${user._id}`);

    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    expect(decoded).toMatchObject(payload);
  })
});
