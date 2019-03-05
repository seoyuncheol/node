const mongoose = require("mongoose");

const { Schema } = mongoose;

const Post = new Schema({
  title: String,
  body: String,
  tags: [String],
  publishedData: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Post", Post);
