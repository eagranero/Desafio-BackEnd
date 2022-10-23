"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randoms = void 0;
var _express = _interopRequireDefault(require("express"));
var _child_process = require("child_process");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const randoms = _express.default.Router();
exports.randoms = randoms;
randoms.get("/", (req, res) => {

  const pid= process.pid;
  const args=process.argv[3];
  res.render("random",{pid,args});
});
randoms.post("/", (req, res) => {
  const {
    body
  } = req;
  const {
    cantidad
  } = body;
  let computo = (0, _child_process.fork)("./computo.js");
  computo.send({
    comando: "start",
    cantidad
  });
  computo.on("message", msg => {
    const {
      data,
      type
    } = msg;
    switch (type) {
      case "datos":
        console.log();
        res.end(`Los datos son ${JSON.stringify(data)}`);
        break;
    }
  });
});