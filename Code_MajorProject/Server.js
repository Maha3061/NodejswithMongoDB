//importing dependencies
const express = require("express")
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { Types } = require('mongoose');
const urlencodedParser = bodyParser.urlencoded({ extended: true });
const { check, validationResult } = require('express-validator');

// Calling form.js from models
const Form = require("./models/Form");

// Connecting to database
var dbConn=mongoose.connect('mongodb+srv://Maha:Maha@cluster0.ko5i41t.mongodb.net/Projectdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once('open', function () {
  console.log("connection succeeded");
});

//middlewares
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(urlencodedParser);
//rendering form.ejs
app.get("/", function (req, res) {
  res.render("form");
});


app.get('/result', (req, res) => {
  res.render('result');
});

app.post('/', urlencodedParser, [
  check('Studentname', 'Studentname must me 3+ characters long').exists().isLength({ min: 3 }),
  check('Course').custom((value, { req }) => {
      if (value === '') {
          throw new Error('Please select a category.');
      }
      return true;
  }),
  check('Age', "Age must be between 15-25").isInt({ min: 15, max: 25 }),
  check('email', 'Email is not valid').isEmail().normalizeEmail()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      const alert = errors.array();
      res.render('form', {
          alert
      });
  } else {
      const Studentname = req.body.Studentname;
      const Course = req.body.Course;
      const Age = req.body.Age;
      const email = req.body.email;
      const feedbacks = { Studentname, Course, Age, email };
      feedbacks._id = new Types.ObjectId();
      delete req.body._id;
      db.collection('forms').insertOne(feedbacks, { wtimeout: 900000 }, function (err, collection) {
          if (err) throw err;
      });
      res.send('Form submitted successfully');
  }
});

  app.get('/feedbacks', function(req, res) {
    dbConn.then(function(db) {
        db.collection('forms').find({}).toArray().then(function(feedbacks) {
            res.status(200).json(feedbacks);
        });
    });
});
app.listen(3000, function () {
  console.log('Server running on port 3000');
});
