const express = require("express");
const router = express.Router();
const zod = require("zod");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Account } = require("../db");
const { JWT_SECRET } = require("../config");
const authMiddleware = require("../middleware");

// Schemas
const signupBody = zod.object({
  email: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string(),
});

const signinBody = zod.object({
  email: zod.string().email(),
  password: zod.string(),
});


const accountSchema = zod.object({
  userId: zod.string(),
  balance: zod.number(),
});

// Route for user signup
router.post("/signup", async (req, res) => {
  try {
    const { email, firstName, lastName, password } = signupBody.parse(req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      firstName,
      lastName,
      password: hashedPassword,
    });

    const newAccount = {
      userId: user._id.toString(),
      balance: 1 + Math.random() * 10000,
    };

    accountSchema.parse(newAccount);

    await Account.create(newAccount);

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    res.json({
      message: "User created successfully",
      token,
    });
  } catch (error) {
    console.error("Error signing up:", error);
    if (error instanceof zod.ZodError) {
      return res.status(400).json({ message: "Invalid account data", details: error.errors });
    }
    res.status(500).json({ message: "Error while signing up" });
  }
});

// Route for user signin
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = signinBody.parse(req.body);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    res.json({ token });
  } catch (error) {
    console.error("Error signing in:", error);
    res.status(500).json({ message: "Error while signing in" });
  }
});

// Route for updating user information
router.put("/update", authMiddleware, async (req, res) => {
  try {
    const { password, firstName, lastName } = req.body;

    const update = {};
    if (password) {
      update.password = await bcrypt.hash(password, 10);
    }
    if (firstName) {
      update.firstName = firstName;
    }
    if (lastName) {
      update.lastName = lastName;
    }

    await User.updateOne({ _id: req.userId }, update);

    res.json({ message: "Updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error while updating user" });
  }
});

// Route for searching users by firstName or lastName
router.get("/bulk", async (req, res) => {
  try {
    const filter = req.query.filter || "";
    const users = await User.find({
      $or: [
        { firstName: { $regex: filter, $options: "i" } },
        { lastName: { $regex: filter, $options: "i" } },
      ],
    }, { email: 1, firstName: 1, lastName: 1, _id: 1 });

    res.json({
      users: users.map(user => ({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
      })),
    });
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Error while searching users" });
  }
});

module.exports = router;
