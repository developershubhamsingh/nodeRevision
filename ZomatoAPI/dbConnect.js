import { MongoClient } from "mongodb";
let mongoUrl = "mongodb://localhost:27017";
let db;

let DbConnect = async () => {
    try {
        let client = new MongoClient(mongoUrl);
        await client.connect();
        db = client.db("Restaurents");
        console.log(" database connected successfully");
    } catch (error) {
        console.error(" error connecting database", error)
    }
}
const getData = async (colName, query) => {
    return await db.collection(colName).find(query).toArray()
}

export { DbConnect, getData }