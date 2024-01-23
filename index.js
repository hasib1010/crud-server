const express = require('express')
const app = express()
const port = 5000;
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello World!')
})
// 7tMqkKUVFX38GikG
// mdhasibulhasan360

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://mdhasibulhasan360:RJWiLCvrOXEMxRLh@cluster0.bugptt7.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        await client.connect();
        const database = client.db("usersDB");
        const userCollection = database.collection("userCollection");

        app.get("/users", async (req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get("/users/:id", async (req, res) => {
            const id = req.params.id;
            if (!ObjectId.isValid(id)) {
                return res.status(400).send('Invalid user ID');
            }
            const query = { _id: new ObjectId(id) }
            const user = await userCollection.findOne(query);
            res.send(user);
        });


        app.post("/users", async (req, res) => {
            const user = req.body;
            console.log("new user :", user);
            const result = await userCollection.insertOne(user);
            res.send(result);
        });

        app.delete("/users/:id", async (req, res) => {
            const id = req.params.id;
            console.log("please delete id from database", id);
            const query = { _id: new ObjectId(id) }
            const result = await userCollection.deleteOne(query);
            res.send(result)
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

run().catch(console.dir);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})