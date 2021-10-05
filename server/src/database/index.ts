import { MongoClient } from require("mongodb");

const user = "user_001";
const userPassword = "mhh8eQ9zZuKTdFGS";
const cluster = "cluster0.c12nt";

const url = `mongodb+srv://${user}:${userPassword}@${cluster}.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

export const connectDatabase = async () => {
  const client = MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const db = client.db("main");

  return {
    listings: db.collection("test_listings")
  };
};
