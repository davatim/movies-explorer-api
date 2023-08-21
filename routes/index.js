const router = require("express").Router();

const userRouter = require("./users");
const movieRouter = require("./movies");

const { auth } = require("../middlewares/auth");
const { login, createUser } = require("../controllers/users");
const ANAUTHORUZED_REQUEST_401 = require("../errors/ANAUTHORUZED_REQUEST_401");

const validation = require("../middlewares/validation");

router.post("/signin", validation.login, login);
router.post("/signup", validation.createUser, createUser);
router.use(auth);
router.use("/users", userRouter);
router.use("/movies", movieRouter);

router.use((_req, _res, next) => {
  next(new ANAUTHORUZED_REQUEST_401("Сначала авторизуйтесь"));
});

module.exports = router;
