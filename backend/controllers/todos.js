const express = require('express');
const router = express.Router();
const webPush = require('web-push');
const subscriptionModel = require('../models/subscription.model');
const todoModel = require('../models/todo.model');
const { createTodoInstance } = require('../utils/todo');

const sendNotif = async (accID, payload, ttl = 2, delay = 1) => {
  const list = await subscriptionModel.findByID(accID);
  const listSubscription = list.map(item => JSON.parse(item.subscription).subscription);
  const options = {
    TTL: ttl
  };

  setTimeout(function () {
    listSubscription.forEach(sub => webPush.sendNotification(sub, payload, options))
  }, delay * 1000);
}

router.get('/', async (req, res) => {
  const list = await todoModel.all(res.locals.account.id);
  res.json(list);
});

router.post('/', async (req, res) => {
  const todo = createTodoInstance(req.body.content);
  todo.account_id = res.locals.account.id;
  const [id] = await todoModel.add(todo);
  const payload = 'New todo: ' + todo.content;
  await sendNotif(res.locals.account.id, payload);
  res.json({ id });
});

router.put('/update', async (req, res) => {
  const todo = {
    ...req.body,
    updatedAt: new Date().getTime()
  }
  await todoModel.patch(todo);
  res.json(todo);
});

router.put('/complete', async (req, res) => {
  const todo = {
    ...req.body,
    updatedAt: new Date().getTime()
  }
  const [old_todo] = await todoModel.findByID(todo.id);
  await todoModel.patch(todo);
  const payload = `${todo.completed==1? 'Complete' : 'UnComplete'} todo: ` + old_todo.content;
  await sendNotif(res.locals.account.id, payload);
  res.json(todo);
});

router.delete('/:id', async (req, res) => {
  const [todo] = await todoModel.findByID(req.params.id);
  await todoModel.del(req.params.id);
  const payload = 'Delete todo: ' + todo.content;
  await sendNotif(res.locals.account.id, payload);
  res.send(req.params.id);
});

router.put('/clear-completed', async (req, res) => {
  await todoModel.clearCompleted();
  res.end();
})

module.exports = router;