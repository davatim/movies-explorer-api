const router = require('express').Router();

const { createMovie, delMovie, getMowie } = require('../controllers/movies');

const validation = require('../middlewares/validation');

router.get('/', getMowie);
router.post('/', validation.createMovie, createMovie);
router.delete('/:movieId', validation.chekIdMovie, delMovie);

module.exports = router;
