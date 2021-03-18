const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const GC_ID = process.env.GOOGLE_CLIENT_ID;
const jwtSecret = process.env.JWT_SECRET;

const google_client = new OAuth2Client(GC_ID);

exports.googleLogin = (req, res) => {
  const { gtoken } = req.body;
  google_client
    .verifyIdToken({ idToken: gtoken, audience: GC_ID })
    .then((response) => {
      const { email_verified, email, name } = response.payload;
      if (email_verified) {
        User.findOne({ email: email }).then((user) => {
          if (user) {
            const { _id, name, email } = user;
            res.status(200).json({
              token: generateToken(user),
              user: { _id, name, email },
            });
          } else {
            let newUser = new User({ email, name });
            newUser
              .save()
              .then((user) => {
                res.status(200).json({
                  token: generateToken(user),
                  user: user,
                });
              })
              .catch((err) =>
                res.status(500).json({
                  message: 'Something Went Wrong creating user in DB...',
                })
              );
          }
        });
      } else res.status(403).end('Unauthorized');
    })
    .catch((err) =>
      res.status(500).send('Something Went Wrong finding details in DB...')
    );
};

function generateToken(user) {
  var token = jwt.sign({ _id: user._id }, jwtSecret, { expiresIn: '1h' });
  return token;
}

function getBearerTokenFromHeaders(headers) {
  if (headers && headers?.authorization) {
    var header = headers?.authorization.split(' ');
    if (header[0] === 'Bearer') return header[1];
  }
  return new Error('No Bearer Token in authorization header');
}

function verifyToken(headers) {
  try {
    var token = getBearerTokenFromHeaders(headers);
    var user_id = jwt.verify(token, jwtSecret);
    return user_id;
  } catch (err) {
    throw err;
  }
}

exports.getUserIdFromToken = (req) => {
  try {
    var user = verifyToken(req.headers);
    return user._id;
  } catch (err) {
    return null;
  }
};

exports.verifyUser = (userType) => (req, res, next) => {
  try {
    var user_id = verifyToken(req.headers);
    User.findById(user_id)
      .then((user) => {
        if (user.type == userType) next();
        else throw new Error('User Type not matched');
      })
      .catch((err) => {
        throw new Error(err);
      });
  } catch (err) {
    res.status(403).end(`Unauthorized ${err}`);
  }
};

exports.getTestUser = (req, res) => {
  let userType = req.body.userType;
  User.find({ email: `${userType}@test.com` })
    .then((user) =>
      res.status(200).json({ user, auth_token: generateToken(user) })
    )
    .catch((err) => res.status(406).end('User not found'));
};