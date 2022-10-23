Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.routerProductos = exports.listadoProductos = exports.listadoChat = void 0;
var _express = _interopRequireWildcard(require("express"));
var _DB = _interopRequireDefault(require("../daos/sql/DB.js"));
var _Contenedor_FS = _interopRequireDefault(require("../daos/fs/Contenedor_FS.js"));
var _optionsMDB = require("../options/optionsMDB.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const listadoProductos = new _DB.default("Productos", _optionsMDB.options);
exports.listadoProductos = listadoProductos;
const listadoChat = new _Contenedor_FS.default("chat");
exports.listadoChat = listadoChat;
const routerProductos = _express.default.Router();
exports.routerProductos = routerProductos;
function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
}

//Direccion para cargar la pagina principal
routerProductos.get('/', checkAuthentication, async (req, res) => {
  let login = null;
  if (req.session.user) {
    login = req.session.user;
  }
  res.render('body', {
    login
  });
});

//Direccion para borrar todos los productos de la base de datos
routerProductos.get('/borrarproductos', checkAuthentication, async (req, res) => {
  await listadoProductos.deleteAll();
  res.redirect("/api/productos");
});

//Direccion para borrar todos los productos de la base de datos
routerProductos.get('/borrarChat', checkAuthentication, async (req, res) => {
  await listadoChat.deleteAll();
  res.redirect("/api/productos");
});