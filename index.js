const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const uri =
  "mongodb+srv://socialBuddy:nasir1234567@socialbuddy.vddzz.mongodb.net/socialBuddy?retryWrites=true&w=majority";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const client = new MongoClient(
  uri,
  { useUnifiedTopology: true },
  { useNewUrlParser: true },
  { connectTimeoutMS: 30000 },
  { keepAlive: 1 }
);

client.connect((err) => {
  const collection = client.db("socialBuddy").collection("toDoList");

  app.get("/posts", (req, res) => {
    collection.find({}).toArray((err, documents) => {
      res.send(documents);
      console.log("get documents", documents);
    });
  });

  // product update database function
  app.get("/post/:id", (req, res) => {
    collection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });

  app.patch("/update/:id", (req, res) => {
    collection
      .updateOne(
        { _id: ObjectId(req.params.id) },
        {
          $set: { fullName: req.body.fullName, post: req.body.post },
        }
      )
      .then((result) => {
        res.send(result.modifiedCount > 0);
      });
  });

  // add post function
  app.post("/addPost", (req, res) => {
    const product = req.body;
    collection.insertOne(product).then((result) => {
      console.log("data successfully submitted");
      res.redirect("/");
    });
  });

  app.delete("/delete/:id", (req, res) => {
    collection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((err, result) => {
        res.send(result.deletedCount > 0);
      });
  });
  //   close todo list

  console.log(err);
});

app.listen(4000);
