const router = require('express').Router();

const { createMovie, delMovie, getMovie } = require('../controllers/movies');

const validation = require('../middlewares/validation');

router.get('/', getMovie);
router.post('/', validation.createMovie, createMovie);
router.delete('/:movieId', validation.chekIdMovie, delMovie);

module.exports = router;
