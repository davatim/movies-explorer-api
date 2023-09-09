const mongoose = require('mongoose');
const Movie = require('../models/movie');
const ERROR_404_NOTFOUND = require('../errors/ERROR_404_NOTFOUND');
const ERROR_IN_REQUATION = require('../errors/ERROR_IN_REQUATION');
const ERROR_403_PERMISSION = require('../errors/ERROR_403_PERMISSION');

module.exports.getMovie = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.send(movies))
    .catch((err) => next(err));
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(
          new ERROR_IN_REQUATION(
            `Переданные данные не корректны. ${err.message}`,
          ),
        );
      } else {
        next(err);
      }
    });
};

module.exports.delMovie = (req, res, next) => {
  const { movieId } = req.params;
  console.log(movieId);
  console.log(req.user);
  Movie.find({ movieId })
    .orFail()
    .then((movie) => {
      console.log(movie);
      const owner = movie[0].owner.toString();
      console.log(owner);
      console.log(req.user);
      const user = req.user._id.toString();
      console.log(req.user);
      if (owner === user) {
        return Movie.deleteOne(movie[0]).then(() => {
          res.status(200).send({ message: 'Фильм успешно удален' });
        });
      }
      return next(
        new ERROR_403_PERMISSION('У вас нет прав на данное действие'),
      );
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new ERROR_IN_REQUATION(
            `Переданные данные не корректны. ${err.message}`,
          ),
        );
      } else if (err.name === 'DocumentNotFoundError') {
        next(new ERROR_404_NOTFOUND('Данные не найдены'));
      } else {
        next(err);
      }
    });
};
