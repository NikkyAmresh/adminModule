const jwt = require("jsonwebtoken");
const { JWT_CONFIG } = require("../constants");

const signOptions = {
  issuer: JWT_CONFIG.ISSUER,
  subject: JWT_CONFIG.SUBJECT,
  audience: JWT_CONFIG.AUDIENCE,
  expiresIn: JWT_CONFIG.TOKEN.VALIDITY,
  algorithm: JWT_CONFIG.ALOGO,
};
const helper = {
  sign: (user) => {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_PRIVATE_KEY,
      signOptions
    );
  },

  verify: (token) => {
    return jwt.verify(token, process.env.JWT_PUBLIC_KEY, signOptions);
  },
};
module.exports = helper;
