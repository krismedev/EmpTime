const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("express-flash");
const ejs = require("ejs");

const { logoutView } = require("./controllers/loginController");
const { checkPermission } = require("./controllers/permissionController");

const app = express();
const port = 3000;

// Database Configuration
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "empdatabase1",
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to database!");

  const LoginModel = require("./models/loginModels");
  LoginModel.initialize(connection);
});

// Setup
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ตั้งค่า session
app.use(
  session({
    secret: "password",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// ตั้งค่า express-flash
app.use(flash());

app.set("view engine", "ejs");

const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
};


app.get("/", (req, res) => {
  res.redirect("/login");
});

// ------------------------- Login ------------------------- //
const loginRoutes = require("./routes/loginRoutes");
app.use("/", loginRoutes); // Use app.use to mount the router

app.get("/logout", isLoggedIn, logoutView);
app.get("/error_page", isLoggedIn, (req, res) => {
  res.render("error_page");
});

// ------------------- Routes ------------------- //
const employeeRoutes = require("./routes/employeeRoutes");
app.use("/", employeeRoutes);

const inoutRoutes = require("./routes/inoutRoute");
app.use("/", inoutRoutes);
app.use('/uploads', express.static('uploads'));

const receiptRoutes = require("./routes/receiptRoutes");
app.use("/", receiptRoutes);

const requestRoutes = require("./routes/requestRoutes");
app.use("/", requestRoutes);

const userReceiptRoutes = require('./routes/userreceiptRoutes');
app.use('/', userReceiptRoutes);

const settingRoutes = require("./routes/settingRoutes");
app.use("/", settingRoutes);

const shiftscheduleRoutes = require("./routes/shiftscheduleRoutes");
app.use("/", shiftscheduleRoutes);

const userCheckinRoutes = require("./routes/userCheckinRoute");
app.use("/", userCheckinRoutes);

const userCheckoutRoutes = require("./routes/userCheckoutRoute");
app.use("/", userCheckoutRoutes);

const useredprofileRoutes = require("./routes/useredprofileRoutes");
app.use("/", useredprofileRoutes);

const userLeaveRoutes = require("./routes/userLeaveRoutes");
app.use("/", userLeaveRoutes);



const userpasswordRoutes = require("./routes/userpasswordRoutes");
app.use("/", userpasswordRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/", userRoutes);

const userscheduleRoutes = require("./routes/userscheduleRoutes");
app.use("/", userscheduleRoutes);

const userUserRoutes = require("./routes/user_userRoutes");
app.use("/", userUserRoutes);

const userworkhistoryRoutes = require("./routes/userworkhistoryRoutes");
app.use("/", userworkhistoryRoutes);

const userworkRoutes = require("./routes/userworkRoutes");
app.use("/", userworkRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log(`http://localhost:${port}/login`);
});
