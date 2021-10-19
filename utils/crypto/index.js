const SHA256 = require("crypto-js/sha256");

const { passwordSecret } = require("../../config");

module.exports.crypto = (payload) => {
  return SHA256(payload + passwordSecret).toString();
};
