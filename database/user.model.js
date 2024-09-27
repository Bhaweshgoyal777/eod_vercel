const { Schema, model } = require("mongoose");
const DOCUMENT_NAME = "User",
  COLLECTION_NAME = "user";
const schema = new Schema({
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
