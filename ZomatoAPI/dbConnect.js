import { MongoClient } from "mongodb";
let mongoUrl = "mongodb://localhost:27017";
let db;

let DbConnect = async () => {
    try {
        let client = new MongoClient(mongoUrl);
        await client.connect();
        db = client.db("Restaurents");
        console.log("database connected successfully");
    } catch (error) {
        console.error("error connecting database", error)
    }
}
const getData = async (colName, query) => {
    return await db.collection(colName).find(query).toArray()
}
const getDataSort = async (colName, query, sort) => {
    return await db.collection(colName).find(query).sort(sort).toArray()
}
const getDataSortLimit = async (colName, query, sort, skip, limit) => {
    return await db.collection(colName).find(query).sort(sort).skip(skip).limit(limit).toArray()
}

export { DbConnect, getData, getDataSort, getDataSortLimit }