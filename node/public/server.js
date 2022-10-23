var _express = _interopRequireDefault(require("express"));
var _http = require("http");
var _socket = require("socket.io");
var _expressHandlebars = require("express-handlebars");
var _productos = require("./routers/productos.js");
var _productosTest = require("./routers/productos-test.js");
var _socket2 = require("./socket.js");
var _expressSession = _interopRequireDefault(require("express-session"));
var _connectMongo = _interopRequireDefault(require("connect-mongo"));
var _login = require("./routers/login.js");
var _passport = _interopRequireDefault(require("passport"));
var _dotenv = _interopRequireDefault(require("dotenv"));
var _yargs = _interopRequireDefault(require("yargs"));
var _randoms = require("./routers/randoms.js");
var _cluster = _interopRequireDefault(require("cluster"));
var _os = _interopRequireDefault(require("os"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_dotenv.default.config();
 
//Cargo 3 productos de prueba
/*const asincronica=(async()=>{
    listadoProductos.crearDBProductos();
    await listadoProductos.deleteAll()
    //await listadoChat.deleteAll()
    await listadoProductos.save_Knex({nombre:"Escuadra", precio:123.45, thumbnail:"../img/escuadra.jpg"})
    await listadoProductos.save_Knex({nombre:"Calculadora", precio:123.45, thumbnail:"../img/calculadora.jpg"});
    await listadoProductos.save_Knex({nombre:"Cuaderno", precio:123.45, thumbnail:"../img/cuaderno.jpg"});
})()*/

//Inicio Servidor Express
const app = (0, _express.default)();
app.use((0, _expressSession.default)({
  store: _connectMongo.default.create({
    mongoUrl: process.env.DATABASE_CONNECTION_STRING,
    mongoOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  }),
  secret: process.env.SECRET_MONGO,
  cookie: {
    maxAge: 10000
  },
  resave: false,
  saveUninitialized: false
}));
app.use(_express.default.static('public'));
app.set('view engine', 'hbs');
app.set('views', './views');
app.engine('hbs', (0, _expressHandlebars.engine)({
  extname: '.hbs',
  defaultLayout: 'index.hbs',
  layoutsDir: './views/layouts',
  partialsDir: './views/partials'
}));
app.use(_passport.default.initialize());
app.use(_passport.default.session());
app.use(_express.default.json());
app.use(_express.default.urlencoded({
  extended: true
}));      
const httpServer = (0, _http.createServer)(app);
const io = new _socket.Server(httpServer);
console.log(process.argv)
const args = (0, _yargs.default)(process.argv.slice(2)).default({
  port: 8000,
  modo: "fork"
}).argv;
const PORT = args.port;
 
if (_cluster.default.isPrimary && args.modo == "cluster") {
  console.log(`Master ${process.pid} is running`);
  for (let i = 0; i < _os.default.cpus().length; i++) {
    _cluster.default.fork();
  }
  _cluster.default.on('exit', (worker, code, signal) => {
    _cluster.default.fork();
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  httpServer.listen(PORT, () => {
    console.log("Servidor Encendido en puerto " + PORT);
  });
  httpServer.on("error", error => {
    console.log("Error en servidor");
  });
  console.log(`Worker ${process.pid} started`);
}
app.use(function (req, res, next) {
  req.session._garbage = Date();
  req.session.touch();
  next();
});
app.use('/api/productos', _productos.routerProductos);
app.use('/api/productos-test', _productosTest.routerProductostest);
app.use('/api/randoms', _randoms.randoms);
app.use('/login', _login.routerLogin);
app.get('/', async (req, res) => {
  if (req.session.user) res.redirect("/login");else res.redirect("/login");
});
app.get("/info", (req, res) => {
  res.json({
    Argumentos: args,
    Plataforma: process.platform,
    ID: process.pid,
    Version: process.version,
    Memoria:process.memoryUsage(),
    Path:process.execPath,
    Procesadores: _os.default.cpus().length, 
    Carpeta: process.cwd()
  });
});
(0, _socket2.socket)(io);

