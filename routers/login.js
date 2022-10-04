import express from "express";


export const routerLogin = express.Router()


routerLogin.get('/', async (req, res) => {
    res.render('login');
});

routerLogin.get('/ingresar', async (req, res) => {
    const { nombre, password } = req.query;
    req.session.user = nombre;
    req.session.admin = true;
    res.redirect("/api/productos");
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

