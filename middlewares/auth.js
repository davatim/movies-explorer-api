const jwt = require('jsonwebtoken');
const config = require('../config');
const ANAUTHORUZED_REQUEST_401 = require('../errors/ANAUTHORUZED_REQUEST_401');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new ANAUTHORUZED_REQUEST_401('Сначала авторизуйтесь'));
    return;
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, config.jwtSecret);
  } catch (err) {
    throw new ANAUTHORUZED_REQUEST_401('Сначала авторизуйтесь');
  }
  req.user = payload;
  next();
};
