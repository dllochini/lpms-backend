export const getUsers = async (req, res) => {
  try {
    const results = await User.find();
    console.log(results.length,'results')
    res.json(results);
  } catch (error) {
    console.log(error)
  }
}

// export const getUserByID = async (req,res) => {

// }

export default{
    getUsers,
}