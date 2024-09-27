const { UserModel } = require("../database/user.model");

const createUser = async ({ email, pass, userName }) => {
  try {
    const body = {
      nodemailer: {
        email,
        pass,
      },
      userName,
    };
    const user = await UserModel.create({ ...body });
    return user;
  } catch (error) {
    console.error(error.message);
  }
};

const fetchUser = async (userName) => {
  try {
    const user = await UserModel.findOne({ userName });
    return user;
  } catch (error) {
    console.error(error.message);
  }
};

const updateUser = async (userName, updateData) => {
  try {
    const checkuser = await fetchUser(userName);
    if (!checkuser) {
      return null;
    }
    const user = await UserModel.findOneAndUpdate(
      { userName },
      { $set: { ...updateData } },
      { new: true, runValidators: true }
    );

    return user;
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = { createUser, fetchUser, updateUser };
