
import { createHash, isValidPassword } from "../utils/encriptacion.js";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { usuarios } from "../persistencia/usuarios_persistencia.js";



export const passportInitialize =  ()=>{
    passport.use(
        "login",
        new LocalStrategy(async (username, password, done) => {
            let usuarioAuth = await usuarios.buscar({ username:username })
            if (!usuarioAuth) {
                console.log("Usuario no encontrado");
                done(null, false);
            }else{
                if (!isValidPassword(usuarioAuth, password)) {
                    console.log("Contraseña invalida");
                    done(null, false);
                }else{
                    console.log("Usuario Autenticado");
                    done(null, usuarioAuth);
                }
            }
        })
    );
    
    passport.use("signup",new LocalStrategy({passReqToCallback: true},
        async (req, username, password, done) => {
            let usuarioAuth = await usuarios.buscar({ username:username })
            if (usuarioAuth) {
                console.log("El usuario ya existe");
                done(null, false);
            }else{
                const newUser = {
                    username: username,
                    password: createHash(password),
                    timeStamp:new Date().toLocaleString()
                };
                await usuarios.save(newUser)
                done(null, await usuarios.buscar({ username:username }))            
            }
        }
    ));
    
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    
    passport.deserializeUser(async (_id, done) => {
        done(null,await usuarios.getById(_id))
    });
}

export const checkAuthentication = (req, res, next) =>{
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect("/login");
    }
  }
