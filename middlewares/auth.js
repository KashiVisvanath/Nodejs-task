const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {  
  const authHeader = req.headers['authorization'] 
  const token = authHeader && authHeader.split(' ')[1] 

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    //console.log(err);
    if (err) return res.sendStatus(401);
    req.user = user;
    next();
  });
}

function generateAccessToken(userDetails) {
  return jwt.sign({ data: userDetails }, process.env.TOKEN_SECRET, {
    expiresIn: "1h",
  });
}

module.exports = {
  authenticateToken,
  generateAccessToken,
};
