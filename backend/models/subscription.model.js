const db = require('../utils/db');

module.exports = {
  add(accID, subs){
    return db('subscription').insert({account_id: accID, subscription: subs});
  },
  delete(accID, subs){
    return db('subscription').where({
      account_id: accID, 
      subscription: subs
    }).del();
  },
  findByID(accID){
    return db('subscription').where('account_id', accID).select('subscription');
  }
}