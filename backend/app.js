require('dotenv').config();
const express = require('express')
const morgan = require('morgan');
var bodyParser = require('body-parser');
const webPush = require('web-push');
var fs = require('fs');
const port = 3030
const cors = require('cors');
const app = express();
const todoModel = require('./models/todo.model');
const { createTodoInstance } = require('./utils/todo');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const sendNotif = (payload, ttl=2, delay=1) => {
  const {subscription} = JSON.parse(fs.readFileSync('./subscription.json', 'utf8'));
  const options = {
    TTL: ttl
  };

  setTimeout(function() {
    webPush.sendNotification(subscription, payload, options)
  }, delay * 1000);
}

app.get('/todos', async (req, res) => {
  const list = await todoModel.all();
  res.json(list);
});

app.post('/todos', async (req, res) => {
  const todo = createTodoInstance(req.body.content);
  const [id] = await todoModel.add(todo);
  const payload = 'New todo: '+ todo.content;
  sendNotif(payload);
  res.json({...todo, id});
});

app.put('/todos', async (req, res) => {
  const todo = {
    ...req.body,
    updatedAt: new Date().getTime()
  }
  await todoModel.patch(todo);
  res.json(todo);
});

app.delete('/todos/:id', async (req, res) => {
  await todoModel.del(req.params.id);
  res.send(req.params.id);
});

app.put('/todos/clear-completed', async(req, res) => {
  await todoModel.clearCompleted();
  res.end();
})

app.use('/notifs/',require('./notifs'));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})