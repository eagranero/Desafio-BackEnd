"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SchemaUsuario = void 0;
var _mongoose = require("mongoose");
const SchemaUsuario = new _mongoose.Schema({
  timeStamp: {
    type: String,
    required: true,
    max: 100
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});
exports.SchemaUsuario = SchemaUsuario;