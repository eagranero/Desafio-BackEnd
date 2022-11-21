import express from "express";
import { loginController, initController, logoutController, signupController } from "../controllers/login_controller.js";
import passport from "passport";
import { passportInitialize } from "../utils/auth.js";

export const routerLogin = express.Router()
passportInitialize();

routerLogin.get('/', initController);

routerLogin.post('/',
  passport.authenticate("login", { failureRedirect: "login/faillogin" }),
  loginController
);

routerLogin.get("/faillogin", async (req, res) => {res.render("login_error")})

routerLogin.get('/signup', async (req, res) => {res.render('registro')})

routerLogin.post('/signup',
  passport.authenticate("signup", { failureRedirect: "/login/failsignup" }),
  signupController 
);

routerLogin.get("/failsignup", async (req, res) => {res.render("signup_error")})

routerLogin.get("/logout",logoutController)

