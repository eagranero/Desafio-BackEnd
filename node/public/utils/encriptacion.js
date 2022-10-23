"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createHash = createHash;
exports.isValidPassword = isValidPassword;
var _bcrypt = _interopRequireDefault(require("bcrypt"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function isValidPassword(user, password) {
  return _bcrypt.default.compareSync(password, user.password);
}
function createHash(password) {
  return _bcrypt.default.hashSync(password, _bcrypt.default.genSaltSync(10), null);
}