const users = require("../controllers/users.controller");
const auth = require("./../controllers/auth.controller");
const Token = require("../middleware/auth");
const { AREA } = require("../constants");
module.exports = (app) => {
  const token = new Token(AREA.USER);
  app.use(token.verify);
  app.get("/", auth.isLoggedIn);
  app.post("/users", users.createUser);
  app.get("/users/:page", users.getUsers);
  app.delete("/user/:id", users.deleteUser);
};
