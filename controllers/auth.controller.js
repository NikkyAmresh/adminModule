const { Messages } = require("../constants");
const { sign } = require("../helper/jwt");
const authControllers = {
  login: async (req, res) => {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send({
        message: Messages.USER_INPUT_ERROR.NOT_ALL_FIELDS_AVAILABLE,
      });
      return;
    }
    // as mentioned in Task credentials should be HARD-CODED
    const hanrdCodedCredentials = {
      id: 1,
      email: "admin@namasys.co",
      password: "admin123",
    };

    const user = email === hanrdCodedCredentials.email;

    if (!user) {
      res.status(404).send({
        message: Messages.USER.ACCOUNT_NOT_FOUND,
      });
      return;
    }

    const doesPasswordMatch = password === hanrdCodedCredentials.password;
    if (!doesPasswordMatch) {
      res.status(401).send({
        message: Messages.USER.INVALID_CREDS,
      });
      return;
    }
    const token = sign(hanrdCodedCredentials);
    res.status(201).send({ id: hanrdCodedCredentials.id, email, token });
  },

  isLoggedIn: (req, res) => {
    if (req.user.id) {
      return res
        .status(200)
        .send({ message: Messages.LOGIN.LOGGED_IN(req.user.email) });
    } else {
      return res.status(401).send({ message: Messages.LOGIN.NOT_LOGGED_IN });
    }
  },
};
module.exports = authControllers;
