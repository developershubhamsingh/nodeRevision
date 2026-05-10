import { MongoClient } from "mongodb";
let mongoUrl = "mongodb://localhost:27017";
let db;

const dbConnect = async () => {
    try {
        let client = new MongoClient(mongoUrl);
        await client.connect();
        db = client.db("node")
        console.log("Database Connected Successfully")
    } catch (Error) {
        console.error(" Error Connecting to Database", Error)
    }

}
const getData = async (colName, query) => {
    return await db.collection(colName).find(query).toArray();
}

export { dbConnect, getData }