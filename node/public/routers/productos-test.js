Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.routerProductostest = exports.listadoProductosTest = void 0;
  var _express = _interopRequireDefault(require("express"));
  var _generadorProductos = require("../utils/generadorProductos.js");
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  const routerProductostest = _express.default.Router();
  exports.routerProductostest = routerProductostest;
  const listadoProductosTest = [];
  exports.listadoProductosTest = listadoProductosTest;
  routerProductostest.get('/', async (req, res) => {
    exports.listadoProductosTest = listadoProductosTest = [];
    for (let i = 0; i < 5; ++i) listadoProductosTest.push((0, _generadorProductos.generarProducto)());
    res.render('productos-test');
  });