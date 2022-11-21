
import { createHash, isValidPassword } from "../utils/encriptacion.js";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { usuarios } from "../persistencia/usuarios_persistencia.js";

export const passportInitialize = ()=>{
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
}

export const checkAuthentication = (req, res, next) =>{
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect("/login");
    }
  }