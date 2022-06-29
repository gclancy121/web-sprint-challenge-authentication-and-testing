const Users = require('../users/users-model');

async function checkUsernameTaken(req, res, next) {
  const username = req.body.username;
 await Users.findByUsername(username).then(result => {
  if (result != null) {
    res.status(400).json({message: 'username taken'});
    return;
  }
  next();
 })
}

function checkPayload(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  if (username == null || username.trim() === '') {
    res.status(400).json({message: "username and password required"});
    return;
  }
  if (password == null || password.trim() === '') {
    res.status(400).json({message: "username and password required"});
    return;
  }
  next();
}


module.exports = {
  checkUsernameTaken,
  checkPayload,
}