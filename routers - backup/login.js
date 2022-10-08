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
  new LocalStrategy(async (username, password, done) => {
      try{
          let user = await usuarios.buscar({username:username})
          if (!user) {
              console.log("User Not Found with username " + username);
              return done(null, false);
            }
          if (!isValidPassword(user, password)) {
              console.log("Invalid Password");
              return done(null, false);
          }
          
      }catch(err){
          return done(err);
      }
  })
);

passport.use(
  "signup",
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    async (req, username, password, done) => {

      try{
        let user=await usuarios.buscar({username:username})
        if (user) {
          console.log("User already exists");
          return done(null, false);
        }

        await usuarios.save({nombre:nombre,password:createHash(password)})
        return done(null, userWithId);

      }
      catch{
        console.log("Error in SignUp: " + err);
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});


passport.deserializeUser((id, done) => {
  usuarios.getByIdFunc(id, done);
})






routerLogin.get('/', async (req, res) => {
    res.render('login');
});

routerLogin.post('/', async (req, res) => {
  const {body} = req;
  const { username, password } = body;
  req.session.user = username;
  req.session.admin = true;
  res.redirect("/api/productos");
});


routerLogin.get('/signup', async (req, res) => {
  res.render('registro');
});

routerLogin.post('/signup', async (req, res) => {
  const {body} = req;
  const { username, password } = body;
  let encontrado = await usuarios.buscar({username})
  if(encontrado==null){

    await usuarios.save({username:username,password:createHash(password)})
    res.redirect("/");
  } 
  else res.json({error:"El usuario ya se encuentra registrado"})
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

