const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const MongoClient = require('mongodb').MongoClient;

require('dotenv').config()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lkdxj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const port = 5000
const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/' , (req, res) =>{
    res.send("Hello from Db. It works")
})

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


client.connect(err => {
    const productsCollection = client.db("emaJohnStore").collection("products");
    const ordersCollection = client.db("emaJohnStore").collection("orders");

    console.log("database connection");
    //   client.close();
    //    POST create
    app.post('/addProduct', (req, res) => {
        const products = req.body;
        //   console.log(product)
        // productsCollection.insertMany(products)
        productsCollection.insertOne(products)

            .then(result => {
                // console.log(result);
                console.log(res.insertedCount)
                res.send(result.insertedCount)
            })
    })
    //    ALL read
    app.get('/products', (req, res) => {
        productsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    // ONE
    app.get('/product/:key', (req, res) => {
        productsCollection.find({ key: req.params.key })
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    })
    //    MORE THAN ONE
    app.post('/productByKeys', (req, res) => {
        const productKeys = req.body
        productsCollection.find({ key: { $in: productKeys } })
            .toArray((err, documents) => {
                res.send(documents)

            })
    })
    
    app.post('/addOrder', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })



    // console.log(process.env.DB_USER);

    // app.get('/' , (req, res) =>{
    //     res.send('This is ema-john server.Emma watson')
    // })

})

app.listen(process.env.PORT || port)