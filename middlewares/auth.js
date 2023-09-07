const jwt = require('jsonwebtoken');
const ANAUTHORUZED_REQUEST_401 = require('../errors/ANAUTHORUZED_REQUEST_401');

module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, 'super-secret-kei');
  } catch (err) {
    return next(
      new ANAUTHORUZED_REQUEST_401('Пользователь не зарегистрирован'),
    );
  }

  req.user = payload;
  return next();
};
