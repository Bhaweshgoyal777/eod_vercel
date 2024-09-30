const { EodModel } = require("../database/eod.user");

const create = async (data) => {
  try {
    const eod = await EodModel.create(data);
    return eod;
  } catch (error) {
    console.log(error.message);
  }
};

const fetch = async (userId) => {
  try {
    const eod = await EodModel.find({ user: userId });
    return eod;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { create, fetch };
