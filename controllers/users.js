const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const config = require("../config");
const CODE_CONFLICT = require("../errors/CODE_CONFLICT");
const ERROR_404_NOTFOUND = require("../errors/ERROR_404_NOTFOUND");
const ERROR_IN_REQUATION = require("../errors/ERROR_IN_REQUATION");
const ANAUTHORUZED_REQUEST_401 = require("../errors/ANAUTHORUZED_REQUEST_401");

// const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => new ERROR_404_NOTFOUND("Пользователь не найден"))
    .then((user) => res.status(200).send(user))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        email,
        password: hash,
      })
    )
    .then((user) =>
      res.status(201).send({
        _id: user._id,
        name: user.name,
        email: user.email,
      })
    )
    .catch((err) => {
      if (err.code === 11000) {
        next(new CODE_CONFLICT("Этот E-mail зарегистрирован"));
      } else if (err instanceof mongoose.Error.ValidationError) {
        next(new ERROR_IN_REQUATION("Переданные данные не корректны"));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        throw new ANAUTHORUZED_REQUEST_401("Не правильная почта или пароль");
      }
      return bcrypt.compare(password, user.password).then((isEqual) => {
        if (!isEqual) {
          throw new ANAUTHORUZED_REQUEST_401("Не правильная почта или пароль");
        }
        const token = jwt.sign({ _id: user._id }, config.jwtSecret, {
          expiresIn: "7d",
        });
        return res.status(200).send({ token });
      });
    })
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true }
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.code === 11000) {
        next(new CODE_CONFLICT("Этот E-mail зарегистрирован"));
      } else if (err instanceof mongoose.Error.ValidationError) {
        next(new ERROR_IN_REQUATION("Переданные данные не корректны"));
      } else {
        next(err);
      }
    });
};
