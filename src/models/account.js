const mongoose = require("mongoose");
const { Schema } = mongoose;
const crypto = require("crypto");
const { generateToken } = require("lib/token");

function hash(password) {
  return crypto
    .createHmac("sha256", process.env.SECRET_KEY)
    .update(password)
    .digest("hex");
}

const Account = new Schema({
  profile: {
    username: String,
    thumbnail: { type: String, defualt: "/static/images/default_thumbnail.png" }
  },
  email: String,
  social: {
    facebook: {
      id: String,
      accessToken: String
    },
    google: {
      id: String,
      accessToken: String
    }
  },
  password: String,
  thoughtCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

Account.statics.findByUsername = function(username) {
  // 객체에 내장되어있는 값을 사용할 때는 객체명.키 이런식으로 쿼리하면 된다.
  return this.findOne({ "profile.username": username }).exec();
};

Account.statics.findByEmail = function(email) {
  return this.findOne({ email }).exec();
};

Account.statics.findByEmailOrUsername = function({ username, email }) {
  return this.findOne({ $or: [{ "profile.username": username }, { email }] });
};

Account.statics.localRegister = function({ username, email, password }) {
  const account = new this({
    profile: {
      username
      // 썸네일 값을 설정하지 않으면 기본값으로 설정됌.
    },
    email,
    password: hash(password)
  });

  return account.save();
};

Account.methods.validatePassword = function(password) {
  // 함수로 전달받은 password의 해시값과 데이터에 담겨있는 해시값을 비교한다.
  const hashed = hash(password);
  return this.password === hashed;
};

Account.methods.generateToken = function() {
  // JWT에 담을 내용
  const payload = {
    _id: this._id,
    profile: this.profile
  };

  return generateToken(payload, "account");
};

module.exports = mongoose.model("Account", Account);
