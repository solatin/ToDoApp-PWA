const db = require('../utils/db');

module.exports = {
  all() {
    return db('todos');
  },

  add(todo) {
    return db('todos').insert(todo);
  },

  patch(todo) {
    const id = todo.id;
    delete todo.id;

    return db('todos')
      .where('id', id)
      .update(todo);
  },

  del(id) {
    return db('todos')
      .where('id', id)
      .del();
  },

  clearCompleted(){
    return db('todos')
      .where('completed', 1)
      .del();
  }
};
