var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 8080;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoScrapper";


// Initialize Express
var app = express();

// Configure middleware

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));
app.set("view engine", "jade");
app.set("views", __dirname + "/views");

app.use(express.static("nodules/bootstrap/dist"));
 
var articles = require("./routes/article_routes.js");
app.use(articles);


// By default mongoose uses callbacks for async queries, we're setting it to use promises (.then syntax) instead
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/mongoScrapper", {
  // useMongoClient: true
});

mongoose.connect(MONGODB_URL)

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});















