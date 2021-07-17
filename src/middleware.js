const jwt = require('jsonwebtoken')

function authentication(req, res, next) {
  try {
    const [, token] = req.headers.authorization.split(' ');

    console.log(token)
    const { restauraunt_id } = jwt.verify(token, process.env.SECRET);
    req.headers.restauraunt_id = restauraunt_id;

    console.log(restauraunt_id)
    next();
  } catch (err){
    return res.status(103).json({
      error: true,
      message: "Token inválido",
      err
    })
  }
}

module.exports = {
  authentication
}