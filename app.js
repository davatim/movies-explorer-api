const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const cookies = require('cookie-parser');
const { errors } = require('celebrate');
const router = require('./routes/index');
const error500 = require('./middlewares/error500');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const config = require('./config');

const { PORT = 4000 } = process.env;
const app = express();

// app.use(cors());
app.use(
  cors({
    origin: ['http://localhost:3000',
      'https://davatimdiplom.nomoredomainsicu.ru'],
    credentials: true,
    maxAge: 3000000000,
  }),
);
mongoose
  .connect(config.connectDb)
  .then(() => console.log('Подключено к Mongo успешно'))
  .catch((err) => {
    console.error('Ошибка при подключении к Mongo:', err);
  });

app.use(express.json());

app.use(cookies());

app.use(helmet());

app.use(requestLogger);

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(error500);

app.listen(PORT, () => {
  console.log('Сервер запущен на порту 4000');
});
