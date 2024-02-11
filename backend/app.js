require('dotenv').config();
//console.log(process.env) ;
var express = require("express");
var mongoClient = require("mongodb").MongoClient;
var cors = require("cors");
console.log(process.env.DB_NAME)
var port = process.env.PORT;
var dbname = process.env.DB_NAME;

var conStr = process.env.DATABASE_URL;

var app = express();
app.use(cors());
app.use(express.urlencoded({
    extended:true
}));
app.use(express.json());


app.get("/users",(req,res)=>{
    mongoClient.connect(conStr).then((clientObj)=>{
        var database = clientObj.db(dbname);
        database.collection("users").find({}).toArray().then((docs)=>{
            res.send(docs);
            res.end();
        })
    })
});


app.get("/products", (req, res)=>{
    mongoClient.connect(conStr).then((clientObj)=>{
        var database = clientObj.db(dbname);
        database.collection("products").find({}).sort({id:1}).toArray().then((docs)=>{
            res.send(docs);
            res.end();
        });
    });
});

app.get("/products/categories", (req, res)=>{
    mongoClient.connect(conStr).then((clientObj)=>{
        var database = clientObj.db(dbname);
        database.collection("categories").find({}).sort({id:1}).toArray().then((docs)=>{
            res.send(docs);
            res.end();
        });
    });
});



app.get("/product/:id", (req, res)=>{
    var id = parseInt(req.params.id);

    mongoClient.connect(conStr).then((clientObj)=>{
        var database = clientObj.db(dbname);
        database.collection("products").find({id:id}).toArray().then((docs)=>{
            res.send(docs);
            res.end();
        });
    });
});


app.get("/products/:category/:name", (req, res)=>{
     var category = req.params.category;
     var name = req.params.name;

    mongoClient.connect(conStr).then((clientObj)=>{
        var database = clientObj.db(dbname);
        database.collection("products").find({$and:[{category:category},{name:name}]}).sort({id:1}).toArray().then((docs)=>{
            res.send(docs);
            res.end();
        });
    });
});

app.get("/products/:category", (req, res)=>{
     var category = req.params.category;

    mongoClient.connect(conStr).then((clientObj)=>{
        var database = clientObj.db(dbname);
        database.collection("products").find({category:category}).sort({id:1}).toArray().then((docs)=>{
            res.send(docs);
            res.end();
        });
    });
});

app.post("/registeruser",(req,res)=>{
    var user = {
        UserName: req.body.UserName,
        Email: req.body.Email,
        Mobile: req.body.Mobile,
        Password: req.body.Password
    };

    mongoClient.connect(conStr).then((clientObj)=>{
        var database = clientObj.db(dbname);
        database.collection("users").insertOne(user).then(()=>{
            console.log(user)
            console.log("User Inserted");
            res.redirect("/users");
            res.end();
        })
    })
})

app.post("/addproducts", (req, res)=>{

    var product = {
        id: parseInt(req.body.id),
        category: req.body.category,
        name: req.body.name,
        title: req.body.title,
        rating: {
            rate: parseInt(req.body.rate),
            count: parseInt(req.body.count)
        },
        image1 : req.body.image1,
        image2: req.body.image2,
        image3: req.body.image3,
        image4: req.body.image4,
        price: parseInt(req.body.price)
    }
   
    mongoClient.connect(conStr).then((clientObj)=>{
        var database = clientObj.db(dbname);
        database.collection("products").insertOne(product).then(()=>{
            console.log(product)
            console.log('Product Added');
            res.redirect("/products");
            res.end();
        })
    });
});


app.post("/addsample", (req, res)=>{

    var prod = {
        id: parseInt(req.body.id),
        category: req.body.category,
        image : req.body.image
    }
   
    mongoClient.connect(conStr).then((clientObj)=>{
        var database = clientObj.db(dbname);
        database.collection("productsSample").insertOne(prod).then(()=>{
            console.log(prod)
            console.log('Product Added');
            res.redirect("/productsSample");
            res.end();
        })
    });
});

app.get("/productsSample", (req, res)=>{
    mongoClient.connect(conStr).then((clientObj)=>{
        var database = clientObj.db(dbname);
        database.collection("productsSample").find({}).sort({id:1}).toArray().then((docs)=>{
            res.send(docs);
            res.end();
        });
    });
});


app.listen(port);
console.log(`Server Started : http://127.0.0.1:4400`);

