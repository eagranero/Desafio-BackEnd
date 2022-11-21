
export const initController = async (req, res) => {
    if (req.isAuthenticated()) {  
      res.redirect('/api/productos')
    } else {
    res.render('login');}
}

export const loginController = async (req, res) => {
  const {body} = req;
  const { username, password } = body;
  req.session.user = username;
  req.session.admin = true;
  res.redirect('/api/productos')
}

export const signupController = async (req, res) => {
  const {body} = req;
  const { username, password } = body;
  req.session.user = username;
  req.session.admin = true;
  res.redirect('/api/productos')
}

export const logoutController = (req, res) => {
  let login=req.session.user;
  req.session.destroy((err) => {
    if (err) {
      return res.json({ status: "Logout ERROR", body: err });
    } 
    res.render('logout',{login})
  })
}
