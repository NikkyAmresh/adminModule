const { API_LIMIT, Messages } = require("../constants");
const User = require("../models/users.model");
const Joi = require("joi");
const { ObjectId } = require("mongodb");

function validateUser(user) {
  const JoiSchema = Joi.object({
    username: Joi.string()
      .regex(/^[a-zA-Z0-9]*$/)
      .required(),
    email: Joi.string().email().min(5).max(50).required(),
    mobile: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    address: Joi.string().required(),
  }).options({ abortEarly: true });
  return JoiSchema.validate(user);
}

const userControllers = {
  createUser: async (req, res) => {
    const validation = validateUser(req.body);
    if (validation.error && validation.error.details) {
      res.status(400).send({ message: validation.error.details });
      return;
    }

    const { username, mobile, email, address } = req.body;

    const duplicateUser = await User.findOne({
      $or: [{ email }, { username }, { mobile }],
    });

    if (duplicateUser) {
      if (duplicateUser.email === email) {
        res.status(400).send({ message: "email already exists" });
        return;
      }
      if (duplicateUser.mobile === mobile) {
        res.status(400).send({ message: "mobile already exists" });
        return;
      }
      if (duplicateUser.username === username) {
        res.status(400).send({ message: "username already exists" });
        return;
      }
    }

    const user = new User({ username, mobile, email, address });
    let userCreated = null;
    try {
      userCreated = await user.save();
    } catch {
      res.status(500).send({ message: "Error while Creating user" });
      return;
    }
    if (!userCreated) {
      res.status(500).send({ message: "Error while Creating user" });
      return;
    }
    res.status(201).send({
      message: Messages.USER_CREATION.DONE,
    });
    return;
  },
  getUsers: async (req, res) => {
    const page = req.params.page;
    const users = await User.find({})
      .sort({ createdAt: -1 })
      .limit(API_LIMIT)
      .skip(API_LIMIT * (page - 1));

    res.status(200).send({ users });
    return;
  },
  deleteUser: async (req, res) => {
    let id = req.params.id;
    try {
      id = new ObjectId(id);
    } catch {
      res.status(400).send({ message: "Invalid ID" });
      return;
    }
    const deleted = await User.deleteOne({ _id: id });

    if (deleted) res.status(204).send({ message: "Deleted sucessFully" });
    return;
  },
};
module.exports = userControllers;
