import User from '../models/user.js'

export const getUsers = async (req, res) => {
  try {
    const results = await User.find();
    console.log(results.length,'results')
    res.json(results);
  } catch (error) {
    console.log(error)
  }
}

export const addUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser); // ✅ This is crucial
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export default{
    getUsers,
    addUser,
}