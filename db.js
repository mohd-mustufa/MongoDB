const { MongoClient } = require("mongodb");

let dbConnection;
const connectToDb = (cb) => {
	MongoClient.connect("mongodb://localhost:27017/bookStoreDB")
		.then((client) => {
			dbConnection = client.db();
			return cb();
		})
		.catch((err) => {
			console.log(err);
			return cb(err);
		});
};

const useDb = () => {
	return dbConnection;
};

module.exports = { connectToDb, useDb };
