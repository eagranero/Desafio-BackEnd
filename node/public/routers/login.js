"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.usuarios = exports.routerLogin = void 0;
var _express = _interopRequireDefault(require("express"));
var _daosUsuarios = require("../daos/daosUsuarios.js");
var _Schemas = require("../daos/mongo/models/Schemas.js");
var _encriptacion = require("../utils/encriptacion.js");
var _passport = _interopRequireDefault(require("passport"));
var _passportLocal = require("passport-local");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const routerLogin = _express.default.Router();
exports.routerLogin = routerLogin;
const usuarios = new _daosUsuarios.DaosUsuariosMongo("usuarios", _Schemas.SchemaUsuario);
exports.usuarios = usuarios;
_passport.default.use("login", new _passportLocal.Strategy((username, password, done) => {
  usuarios.collectionElement.findOne({
    username: username
  }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (!user) {
      console.log("User Not Found with username " + username);
      return done(null, false);
    }
    if (!(0, _encriptacion.isValidPassword)(user, password)) {
      console.log("Invalid Password");
      return done(null, false);
    }
    return done(null, user);
  });
}));
_passport.default.use("signup", new _passportLocal.Strategy({
  passReqToCallback: true
}, (req, username, password, done) => {
  usuarios.collectionElement.findOne({
    username: username
  }, function (err, user) {
    if (err) {
      console.log("Error in SignUp: " + err);
      return done(err);
    }
    if (user) {
      console.log("User already exists");
      return done(null, false);
    }
    const newUser = {
      username: username,
      password: (0, _encriptacion.createHash)(password),
      timeStamp: new Date().toLocaleString()
    };
    usuarios.collectionElement.create(newUser, (err, userWithId) => {
      if (err) {
        console.log("Error in Saving user: " + err);
        return done(err);
      }
      console.log(user);
      console.log("User Registration succesful");
      return done(null, userWithId);
    });
  });
}));
_passport.default.serializeUser((user, done) => {
  done(null, user._id);
});
_passport.default.deserializeUser((id, done) => {
  usuarios.collectionElement.findById(id, done);
});
routerLogin.get('/', async (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/api/productos');
  } else {
    res.render('login');
  }
});
routerLogin.post('/', _passport.default.authenticate("login", {
  failureRedirect: "login/faillogin"
}), async (req, res) => {
  const {
    body
  } = req;
  const {
    username,
    password
  } = body;
  req.session.user = username;
  req.session.admin = true;
  res.redirect('/api/productos');
});
routerLogin.get("/faillogin", async (req, res) => {
  res.render("login_error");
});
routerLogin.get('/signup', async (req, res) => {
  res.render('registro');
});
routerLogin.post('/signup', _passport.default.authenticate("signup", {
  failureRedirect: "/login/failsignup"
}), async (req, res) => {
  const {
    body
  } = req;
  const {
    username,
    password
  } = body;
  req.session.user = username;
  req.session.admin = true;
  res.redirect('/api/productos');
});
routerLogin.get("/failsignup", async (req, res) => {
  res.render("signup_error");
});
routerLogin.get("/logout", (req, res) => {
  let login = req.session.user;
  req.session.destroy(err => {
    if (err) {
      return res.json({
        status: "Logout ERROR",
        body: err
      });
    }
    res.render('logout', {
      login
    });
  });
});