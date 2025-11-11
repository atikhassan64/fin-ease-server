const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
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

        app.post('/add-transaction', async (req, res) => {
            const addTransaction = req.body;
            const result = await finEaseCollection.insertOne(addTransaction);
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