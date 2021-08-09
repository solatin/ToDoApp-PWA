require('dotenv').config();
const express = require('express')
const morgan = require('morgan');
var bodyParser = require('body-parser');
const port = 3030
const cors = require('cors');
const app = express();
const auth = require('./middlewares/auth');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use('/notifs/', auth, require('./controllers/notifs'));
app.use('/todos/', auth, require('./controllers/todos'));
app.use('/account/', require('./controllers/account'));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})