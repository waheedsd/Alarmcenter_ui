const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const path = require("path");

app.use('/',function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    next()
})
app.use(express.static("public"));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.set('views', path.join(__dirname, 'views'))
// Set EJS as the template engine for the app
app.set("view engine", "ejs");
const apiRoutes = require("./apirouter");
app.use("/",apiRoutes);

// Start the server on a specific port
const port = 5000;
app.listen(port, () => {
  console.log(`UI server running on http://localhost:${port}`);
});
