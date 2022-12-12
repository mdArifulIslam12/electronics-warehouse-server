const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
const uri = "mongodb+srv://inventorybd:Z12BoMKnmAZraVNV@cluster0.dq6qt.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
  try {
    await client.connect();
    const inventoryCollection = client
      .db("electronics")
      .collection("inventory");
    const fromBlogCollection = client.db("fromBlog").collection("blog");
    const categoriesCollection = client
      .db("categories")
      .collection("categorie");
    // items
    app.get("/inventorys", async (req, res) => {
      const query = {};
      const cursor = inventoryCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // single item
    app.post("/inventorys", async (req, res) => {
      const query = req.body;
      const service = await inventoryCollection.insertOne(query);
      res.send(service);
    });
    // get
    app.get("/inventorys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await inventoryCollection.findOne(query);
      res.send(result);
    });
    // query
    app.get("/inventory", async (req, res) => {
      const email = req.query.email;
      console.log(email);
      const query = { email: email };
      const cursor = inventoryCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // put
    app.put("/inventorys/:id", async (req, res) => {
      const id = req.params.id;
      const updateUser = req.body;
      const quantity = updateUser.quantitys;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          quantity: quantity,
        },
      };
      const result = await inventoryCollection.updateOne(
        filter,
        updateDoc,
        options
      );

      res.send(result);
    });
    // delete
    app.delete("/inventorys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await inventoryCollection.deleteOne(query);
      res.send(result);
    });
    // blog
    app.get("/fromBlog", async (req, res) => {
      const query = {};
      const cursor = fromBlogCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // categories
    app.get("/topCategories", async (req, res) => {
      const query = {};
      const cursor = categoriesCollection.find(query);
      const result = await cursor.toArray();
      console.log(result);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello world");
});
app.listen(port, (req, res) => {
  console.log("Listen to port", port);
});
