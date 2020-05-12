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
    console.log("***************CONNECTED TO: ",mongoose.connection.host,mongoose.connection.port);
  }
  //db = client.db();
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection error:'));

module.exports = function(app) {

  //only start when connected
  db.once("open", function() {
    console.log("db connected");

    // Generic error handler used by all endpoints.
    function handleError(res, reason, message, code) {
      console.log("ERROR: " + reason);
      res.status(code || 500).json({"error": message});
    }

    //the db schema
    var productSchema = new mongoose.Schema({
      item: String,
      name: String,
      price: String,
      rating: String,
      link: String,
      sale: String,
      featured: String,
      comp: String,
      deliver: String,
      available: String
    });

    //the collection
    var Products = mongoose.model('Products', productSchema);

    //adding items to collection
    var data = [
      { "item": "shelf", "name": "Floating Shelf", "price": "$100", "rating": "5", "link": "assets/images/reclaimed-wood-floating-shelf.jpg", "sale": "true", "featured": "true", "comp": "Ikea", "deliver": "7", "available": "in stock"},
      { "item": "table", "name": "Black Table","price": "$50", "rating": "3", "link": "assets/images/ikea_table.webp",   "sale": "true", "featured": "true", "comp": "Ikea", "deliver": "2", "available": "in stock"},
      { "item": "table", "name": "Dining Table",  "price": "$75", "rating": "4",   "link": "assets/images/dining_table.webp", "sale": "true", "featured": "true", "comp": "Ikea", "deliver": "3", "available": "in stock"}
    ]

    db.db.collection("products").drop();

    for (var i = 0; i < data.length; i++) {
      var initItem = new Products(data[i]);
        initItem.save(function(err) {
          if (err) {
            throw err;
          }
          else {
            console.log("Init item saved.");
          }
        });
    }

    //middle ware
    var urlencodedParser = bodyParser.urlencoded({extended: false});

    app.use(function(req, res, next) {
      console.log("user connected");
      console.log('Time:', Date.now())
      next()
    });

    app.get("/featured", function(req, res) {
        console.log("get request recieved");
        res.json(data);
    });

    app.get("/search/:tag", (req, res) => {
      console.log("searched for ", req.params.tag);
      Products.find({item: req.params.tag}, function(err, data) {
        if (err) throw err;
        else {
          //console.log("found " + req.params.tag);
          console.log(data);
          res.json(data);
        }
      });
    });
  });
};
