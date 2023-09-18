const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const auth = require("../middlewares/auth");
const User = require("../models/User");

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // check all the missing fields.
  if (!name || !email || !password)
    return res
      .status(400)
      .json({ error: `Please enter all the required field.` });

  try {
    const checkUserExist = await User.findOne({ email });

    if (checkUserExist)
      return res.status(400).json({
        error: ` [${email}] already registered , please try another one.`,
      });

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ name, email, password: hashedPassword });

    // save the user.
    const result = await newUser.save();

    result._doc.password = undefined;

    return res.status(201).json({ ...result._doc });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ error: "please enter all the mandatory fields!" });

  try {
    const IsRegisterUser = await User.findOne({ email });

    if (!IsRegisterUser)
      return res.status(400).json({ error: "Invalid email or password!" });

    // if there were any user present.
    const doesPasswordMatch = await bcrypt.compare(
      password,
      IsRegisterUser.password
    );

    if (!doesPasswordMatch)
      return res.status(400).json({ error: "Invalid email or password!" });

    const payload = { _id: IsRegisterUser._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const user = { ...IsRegisterUser._doc, password: undefined };
    return res.status(200).json({ token, user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
});

router.get("/me", auth, async (req, res) => {
  return res.status(200).json({ ...req.user._doc });
});

module.exports = router;