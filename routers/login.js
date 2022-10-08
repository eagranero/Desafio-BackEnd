import express from "express";
import { DaosUsuariosMongo } from "../daos/daosUsuarios.js";
import { SchemaUsuario } from "../daos/mongo/models/Schemas.js";
import { createHash, isValidPassword } from "../utils/encriptacion.js";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

export const routerLogin = express.Router()
export const usuarios = new DaosUsuariosMongo("usuarios",SchemaUsuario)

passport.use(
  "login",
  new LocalStrategy((username, password, done) => {
    usuarios.collectionElement.findOne({ username:username }, (err, user) => {
      if (err) {
        return done(err);
      }

      if (!user) {
        console.log("User Not Found with username " + username);
        return done(null, false);
      }

      if (!isValidPassword(user, password)) {
        console.log("Invalid Password");
        return done(null, false);
      }
      return done(null, user);
    });
  })
);

passport.use(
  "signup",
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    (req, username, password, done) => {
      usuarios.collectionElement.findOne({ username: username }, function (err, user) {
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
          password: createHash(password),
          timeStamp:new Date().toLocaleString()
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
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  usuarios.collectionElement.findById(id, done);
});



routerLogin.get('/', async (req, res) => {
  if (req.isAuthenticated()) {  
    res.redirect('/api/productos')
  } else {
    res.render('login');}
});

routerLogin.post('/',
  passport.authenticate("login", { failureRedirect: "login/faillogin" }),
  async (req, res) => {
    const {body} = req;
    const { username, password } = body;
    req.session.user = username;
    req.session.admin = true;
    res.redirect('/api/productos')
  }
);

routerLogin.get("/faillogin", async (req, res) => {  
  res.render("login_error")
});


routerLogin.get('/signup', async (req, res) => {
  res.render('registro');
});

routerLogin.post('/signup',
passport.authenticate("signup", { failureRedirect: "/login/failsignup" }), 
async (req, res) => {
  const {body} = req;
  const { username, password } = body;
  req.session.user = username;
  req.session.admin = true;
  res.redirect('/api/productos')
});

routerLogin.get("/failsignup", async (req, res) => {  
  res.render("signup_error")
});


routerLogin.get("/logout", (req, res) => {
    let login=req.session.user;
    req.session.destroy((err) => {
      if (err) {
        return res.json({ status: "Logout ERROR", body: err });
      } 
      res.render('logout',{login})
    });
});

