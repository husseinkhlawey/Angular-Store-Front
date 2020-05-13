var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID; //what is used by db schema

//process.env.MONGODB_URI
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/storedb', function (err, client) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  else {
    useNewUrlParser: true;
    console.log("CONNECTED TO:", mongoose.connection.host, mongoose.connection.port);
  }
  //db = client.db();
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection ERROR:'));

module.exports = function(app) {

  //only start when connected
  db.once("open", function() {
    console.log("DB OPEN");

    // Generic error handler used by all endpoints.
    function handleError(res, reason, message, code) {
      console.log("ERROR: " + reason);
      res.status(code || 500).json({"error": message});
    }

    //use by
    /*if (err) {
      handleError(res, err.message, "Failed to get contacts.");
    } else {
      res.status(200).json(docs);
    }*/

    //the db schema
    var productSchema = new mongoose.Schema({
      item: String,
      name: String,
      price: String,
      rating: String,
      link: String,
      sale: String,
      sale_price: String,
      featured: String,
      comp: String,
      deliver: String,
      available: String,
      logo: String
    });

    //the collection
    var Products = mongoose.model('Products', productSchema);

    //adding items to collection
    var feat_data = [
      { "item": "shelf", "name": "Floating Shelf", "price": "$99.99", "rating": "5", "link": "assets/images/reclaimed-wood-floating-shelf.jpg", "sale": "false", "featured": "true", "comp": "Ikea", "deliver": "7", "available": "In stock", "logo": "assets/images/ikea_logo.jpg"},
      { "item": "chair", "name": "Swivel Chair","price": "$69.99", "rating": "5", "link": "assets/images/ikea_swivle_chair.webp",   "sale": "false", "featured": "true", "comp": "Ikea", "deliver": "2", "available": "In stock", "logo": "assets/images/ikea_logo.jpg"},
      { "item": "table", "name": "Dining Table",  "price": "$74.99", "rating": "5",   "link": "assets/images/dining_table.webp", "sale": "false", "featured": "true", "comp": "Ikea", "deliver": "3", "available": "in stock", "logo": "assets/images/ikea_logo.jpg"}
    ];

    var data = [
      { "item": "shelf", "name": "Floating Shelf", "price": "$99.99", "rating": "5", "link": "assets/images/reclaimed-wood-floating-shelf.jpg", "sale": "false", "featured": "true", "comp": "Ikea", "deliver": "7", "available": "In stock", "logo": "assets/images/ikea_logo.jpg"},
      { "item": "chair", "name": "Swivel Chair","price": "$69.99", "rating": "5", "link": "assets/images/ikea_swivle_chair.webp",   "sale": "false", "featured": "true", "comp": "Ikea", "deliver": "2", "available": "In stock", "logo": "assets/images/ikea_logo.jpg"},
      { "item": "table", "name": "Dining Table",  "price": "$74.99", "rating": "5",   "link": "assets/images/dining_table.webp", "sale": "false", "featured": "true", "comp": "Ikea", "deliver": "3", "available": "in stock", "logo": "assets/images/ikea_logo.jpg"},

      { "item": "table", "name": "Black Table","price": "$49.99", "rating": "3", "link": "assets/images/ikea_table.webp",   "sale": "true", "sale_price": "$24.99", "featured": "true", "comp": "Ikea", "deliver": "2", "available": "4 remaining", "logo": "assets/images/ikea_logo.jpg"},
      { "item": "chair", "name": "Black Stool & Cover","price": "$19.99", "rating": "4", "link": "assets/images/ikea_stool.webp",   "sale": "false", "featured": "false", "comp": "Ikea", "deliver": "2", "available": "In stock", "logo": "assets/images/ikea_logo.jpg"},
      { "item": "shelf", "name": "White Shelf Unit","price": "$99.00", "rating": "4", "link": "assets/images/ikea_white_shelf.webp",   "sale": "true", "sale_price": "$79.99", "featured": "false", "comp": "Ikea", "deliver": "12", "available": "In stock", "logo": "assets/images/ikea_logo.jpg"}

    ];

    db.db.collection("products").drop();

    for (var i = 0; i < data.length; i++) {
      var initItem = new Products(data[i]);
        initItem.save(function(err) {
          if (err) {
            throw err;
          }
          else {
            //console.log("Init item saved.");
          }
        });
    }

    //middle ware
    var urlencodedParser = bodyParser.urlencoded({extended: false});

    app.use(function(req, res, next) {
      console.log("USER CONNECT");
      //console.log('Time:', Date.now())
      next()
    });

    app.get("/featured", function(req, res) {
        console.log("SEND FEATURED");
        res.json(feat_data);
    });

    //searches item with what was passed through search bar.
    /*function searchDB(queryItms) {
      var foundProd = [];
      for (var i = 0; i < queryItms.length; i++) {
        console.log(queryItms[i]);

        Products.find({item: queryItms[i]}, function(err, data) {
          if (err) {
            handleError(res, err.message, "DB SEARCH ERROR.");
          } else {
            foundProd.push(data);
          }
        });
      }
      return foundProd;
    }*/

    //search/*
    //req.params.tag
    app.get("/search/:tag", (req, res) => {

      //console.log("params are: ", req.params);
      //{ '0': 'abc' }
      //console.log(req.params[0]);
      //var srch = req.params[0];
      //console.log("THIS IS SRCH ", srch);
      //var sp = srch.split(" ");
      //console.log("THIS IS SP ", sp);
      //console.log(sp[0]);
      //console.log(sp[1]);

      Products.find({ item: req.params.tag }, function(err, data) {
        if (err) {
          handleError(res, err.message, "DB SEARCH ERROR.");
        } else {
          res.status(200).json(data);
          //console.log("FOUND", data);
        }
      });
    });
  });
};
