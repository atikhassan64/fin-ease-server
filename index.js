const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yc6y96u.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

app.get('/', (req, res) => {
    res.send("This is my server site ")
})

async function run() {
    try {
        await client.connect();

        const database = client.db("finEaseDB");
        const finEaseCollection = database.collection("transactions");

        app.post('/transactions', async (req, res) => {
            const addTransaction = req.body;
            const result = await finEaseCollection.insertOne(addTransaction);
            res.send(result);
        })

        app.get('/transactions', async (req, res) => {
            const email = req.query.email;
            const sortBy = req.query.sortBy;
            const order = req.query.order === 'asc' ? 1 : -1;

            const query = {};
            if (email) {
                query.email = email;
            }
            
            const cursor = finEaseCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/transactions/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await finEaseCollection.findOne(query);
            res.send(result);
        })

        app.patch('/transactions/:id', async (req, res) => {
            const id = req.params.id;
            const updateTransaction = req.body;
            const query = { _id: new ObjectId(id) };
            const update = {
                $set: {
                    type: updateTransaction.type,
                    category: updateTransaction.category,
                    amount: updateTransaction.amount,
                    description: updateTransaction.description,
                    date: updateTransaction.date
                }
            }
            const options = {};
            const result = await finEaseCollection.updateOne(query, update, options);
            res.send(result);
        })

        app.delete('/transactions/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await finEaseCollection.deleteOne(query);
            res.send(result);
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }

    finally {

    }
}
run().catch(console.dir)

app.listen(port, () => {
    console.log(`This server is running in port: ${port}`);
})