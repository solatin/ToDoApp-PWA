const db = require('../utils/db');

module.exports = {
  all(accID) {
    return db('todos').where('account_id', accID);
  },

  findByID(id){
    return db('todos').where('id', id);
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
