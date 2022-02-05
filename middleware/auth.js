const { Messages, AREA: _AREA } = require("../constants");
const { verify } = require("../helper/jwt");
class Token {
  constructor(AREA) {
    this.area = AREA;
  }
  verify = (req, res, next) => {
    let token = req.headers["authorization"];

    if (!token) {
      return res.status(403).send({
        message: Messages.AUTH.TOKEN_UNAVAILABLE,
      });
    }
    token = token.split(" ")[1];
    try {
      const decoded = verify(token);
      req.user = decoded;
    } catch (err) {
      return res.status(401).send({
        message: Messages.AUTH.INVALID_TOKEN,
      });
    }
    return next();
  };
}

module.exports = Token;
