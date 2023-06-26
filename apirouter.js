const express = require("express");
const router = express.Router();
const app = express();
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const session = require("express-session");
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 1 * 60 * 1000,
    httpOnly: true
  }
}));

app.use(cookieParser())
router.get("/api/login", async (req, res) => {
  let serverUrl = encodeURIComponent("http://localhost:5000/")
  res.redirect('http://localhost:3001/login?service=' + serverUrl+"&AppId=2");
});


const checkToken = async (req,res,next) => {
  console.log("checkToken");
  console.log('query -> token',req.query.token, req.cookies.token)
  if(req.cookies.token || req.query.token){
      let token = req.query.token || req.cookies.token;
      console.log(`token -- ${token}`)
     let decodedToken =  jwt.decode(token, "secret-key");
     console.log(`payload ${JSON.stringify(decodedToken)}`);
     let {username, AppId, role} = decodedToken;
     if(!req.session){
      req.session = {}
     }
     req.session.user = username;
     req.session.role = role;
     req.session.token = token;
     if(AppId.includes("2")){
        res.cookie('token', token,{maxAge: 1*30*1000,domain:"localhost",path:"/",sameSite:"Strict"});
        next();
     }else{
      return res.redirect("/api/login");
     }
  }else{
      return res.redirect("/api/login");
  }
}
const verify = (req, res, next) => {
  console.log('req',req.session)
  if(!req.session || req.session.token == undefined){
    return res.redirect("/api/login");
  }else if(req.session || req.session.token){
    next()
  }
}

// router.use(verify);


const checkRole = (req,res, next) => {
  console.log('checkRole', JSON.stringify(req.session))
  let {user, role} = req.session;
  // let role = req.session.role;
  if(role == 'admin'){
    // res.render("dashboard",Object.assign({"userName":username,"role":role}));
    next();
  }else if(role == "operator"){
    return res.render("settings",Object.assign({"userName":user,"role":role}));
    // return res.redirect("/settings")
  } else if(role == "user"){
    return res.render("reports",Object.assign({"userName":user,"role":role}))
  }
}


// const checkToken = async (req, res, next) => {
//   console.log("checkToken");
//   console.log('query -> token', req.query.token, req.cookies.token, req.session)
//   if (req.cookies.token != undefined || req.query.token != undefined) {
//     let token = req.query.token || req.cookies.token;
//     console.log(`token -- ${token}`)
//     try {
//       // Verify the JWT token
//       console.log('Dec')
//       const JWTUser = jwt.decode(token, "secret-key");
//       console.log(`JWTUser ${JWTUser}`);
//       let JWTToken = { username: JWTUser, token: req.query.token };
//       // Check if the session exists, if not create a new one
//       if (!req.session) {
//         req.session = {};
//       }

//       // // Store data in the session
//       req.session.user = JSON.stringify(JWTToken);
     
//       console.log(req.session, req.cookies);
//       res.cookie('token', token,{maxAge: 1*10*1000,domain:"localhost",path:"/",sameSite:"Strict"});
//       next();
//     } catch(err) {
//       console.error(err.message);
//       return res.redirect("/api/login");
//     }
//   } else {
//     return res.redirect("/api/login");
//   }
// }


// Use the middleware for the dashboard route
router.get('/', checkToken, checkRole, (req, res) => {
  // let username = req.session.user;
  // let role = req.session.role;
  // console.log(`username ${username}`)
  let {user, role} = req.session;
  return res.render("dashboard",Object.assign({"userName":user,"role":role}));
});


router.get('/settings', (req,res)=> {
  console.log('settings', JSON.stringify(req.session))
  let {user, role} = req.session;
  return res.render("settings",Object.assign({"userName":user,"role":role}))
})

router.get('/reports', (req,res)=> {
  console.log('reports', JSON.stringify(req.session))
  let {user, role} = req.session;
  return res.render("reports",Object.assign({"userName":user,"role":role}))
})

module.exports = router;  