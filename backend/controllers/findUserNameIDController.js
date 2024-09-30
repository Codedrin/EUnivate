import User from "../models/Client/userModels.js";


export const findUserByUsername = async (req, res) => {
    try {
      const { username } = req.params;
      const user = await User.findOne({ username: username });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  };
  
