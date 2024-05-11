const jwt = require("jsonwebtoken");

function generateToken(user) {
  return jwt.sign(
    { userId: user._id, username: user.username },
    process.env.BCRYPT_PASSWORD_STRING,
    { expiresIn: "1h" } // Token expires in 1 hour
  );
}


module.exports = generateToken;