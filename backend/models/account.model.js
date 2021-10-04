const db = require('../utils/db');

module.exports = {
  add(account) {
    return db('account').insert(account);
  },
  async findByEmail(email){
    const rs = await db('account').where('email', email);
    return rs[0] || null;
  },
  async findByID(id){
    const rs = await db('account').where('id', id);
    return rs[0] || null;
  },
  patch(account){
    return db('account').where('id', account.id).update(account);
  }
};
