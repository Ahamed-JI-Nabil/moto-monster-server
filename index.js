const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.expmf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {

    try {
        await client.connect()

        const productsCollection = client.db('Moto-Monster').collection('all-products')
        const ordersCollection = client.db('Moto-Monster').collection('orders')

        app.get('/products', async (req, res) => {
            const products = await productsCollection.find().toArray()
            res.send(products)
        })


        app.get('/product/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await productsCollection.findOne(query)
            res.send(result)
        })

        app.post('/orders', async (req, res) => {
            const order = req.body
            const result = ordersCollection.insertOne(order)
            res.send(result)
        })


        app.get('/orders/:email', async (req, res) => {
            const email = req.params.email
            const result = await ordersCollection.find({ userEmail: email }).toArray()
            res.send(result)
        })



        app.put('/product/:id', async (req, res) => {
            const id = req.params.id
            const updateItemQuantity = req.body
            const query = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updatedDoc = {
                $set: {
                    availableQuantity: updateItemQuantity.availableQuantity
                }
            }
            const result = await productsCollection.updateOne(query, updatedDoc, options)
            res.send(result)
        })




    }
    finally {


    }
}

run().catch(console.dir)








app.get('/', (req, res) => {
    res.send('Welcome To MotoMonster!')
})

app.listen(port, () => {
    console.log('App running on port:', port);
})