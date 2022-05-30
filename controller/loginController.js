const User = require('../models/People');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');

// get login page
function getLogin(req, res, next) {
  res.render('index');
}

async function login(req, res, next) {
  try {
    const user = await User.findOne({
      $or: [{ email: req.body.username }, { mobile: req.body.username }],
    });

    if (user && user._id) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (isValidPassword) {
        const userObject = {
          username: user.name,
          mobile: user.mobile,
          email: user.email,
          role: 'user',
        };

        const token = jwt.sign(userObject, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRY,
        });

        res.cookie(process.env.COOKIE_NAME, token, {
          maxAge: process.env.JWT_EXPIRY,
          httpOnly: true,
          signed: true,
        });

        res.locals.loggedInUser = userObject;

        res.render('inbox');
      } else {
        throw createError('Login failed! Please try again.');
      }
    } else {
      throw createError('Login failed! Please try again.');
    }
  } catch (error) {
    res.render('index', {
      data: {
        username: req.body.username,
      },
      errors: {
        common: {
          msg: error.message,
        },
      },
    });
  }
}

module.exports = {
  getLogin,
  login,
};
