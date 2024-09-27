const { Schema, model } = require("mongoose");
const DOCUMENT_NAME = "User",
  COLLECTION_NAME = "user";
const schema = new Schema({
  name: {
    type: Schema.Types.String,
    required: true,
  },
  userName: {
    type: Schema.Types.String,
    required: true,
    unique: true,
  },
  nodemailer: {
    type: Object,
  },
});
const UserModel = model(DOCUMENT_NAME, schema, COLLECTION_NAME);

module.exports = { UserModel };
