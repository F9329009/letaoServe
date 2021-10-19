const crypto = require("crypto");

const { passwordSecret } = require("../config");

module.exports.crypto = (payload) => {
  return crypto
    .createHash("sha256")
    .update(payload + passwordSecret)
    .digest("hex");
};
