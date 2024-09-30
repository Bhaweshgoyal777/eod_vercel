const { Schema, model } = require("mongoose");
const DOCUMENT_NAME = "EOD",
  COLLECTION_NAME = "eoduser";
const schema = new Schema(
  {
    message: {
      type: Schema.Types.String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const EodModel = model(DOCUMENT_NAME, schema, COLLECTION_NAME);

module.exports = { EodModel };
