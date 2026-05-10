import { MongoClient } from "mongodb";
let mongoUrl = "mongodb://localhost:27017";
let db;

const dbConnect = async () => {
    let client = new MongoClient(mongoUrl);
    await client.connect()
    db = client.db("Restaurents");
    console.log("Database Connected Successfully")
}

const getData = async(colName, query) => {
    return await db.collection(colName).find(query).toArray();
}

export { dbConnect, getData }