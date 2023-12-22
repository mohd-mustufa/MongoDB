const express = require("express");
const { connectToDb, useDb } = require("./db");
const { ObjectId } = require("mongodb");

// App init
const app = express();
app.use(express.json());

// DB Connection
let db;
connectToDb((err) => {
	if (!err) {
		const port = 3000;
		app.listen(port, () => {
			console.log("App is listening at port", port);
		});
		db = useDb();
	}
});

const validateId = (id) => {
	let gradeId;
	if (ObjectId.isValid(id)) {
		gradeId = new ObjectId(id);
	} else if (/^\d+$/.test(id)) {
		try {
			gradeId = parseInt(id);
			if (isNaN(gradeId)) {
				throw new Error("Invalid id provided");
			}
		} catch (error) {
			res.status(400).json({ Error: "Invalid id provided" });
			return;
		}
	} else {
		res.status(400).json({ Error: "Invalid id provided" });
		return;
	}
	return gradeId;
};

// Routes
app.get("/grades", (req, res) => {
	const pg = req.query.page || 0;
	const limitPerPage = 10;

	db.collection("grades")
		.find()
		.skip(pg * limitPerPage)
		.limit(limitPerPage)
		.toArray()
		.then((data) => res.status(200).json(data))
		.catch(() => res.status(500).json("Could not fetch any data"));
});

app.get("/grades/:id", (req, res) => {
	let gradeId;
	if (ObjectId.isValid(req.params.id)) {
		gradeId = new ObjectId(req.params.id);
	} else if (/^\d+$/.test(req.params.id)) {
		try {
			gradeId = parseInt(req.params.id);
			if (isNaN(gradeId)) {
				throw new Error("Invalid id provided"); // Throw an error for invalid numbers
			}
		} catch (error) {
			res.status(400).json({ Error: "Invalid id provided" }); // 400 Bad Request for invalid id
			return; // Stop further execution
		}
	} else {
		res.status(400).json({ Error: "Invalid id provided" });
		return;
	}

	db.collection("grades")
		.findOne({ _id: gradeId })
		.then((data) => {
			if (data) res.status(200).json(data);
			else res.status(200).json({ Error: "No data found with the given id" });
		})
		.catch(() => res.status(500).json("Could not fetch the data!"));
});

app.post("/grades", (req, res) => {
	db.collection("grades")
		.insertOne(req.body)
		.then((data) => {
			res.status(200).json(data);
		})
		.catch(() => {
			res.status(500).json({ Error: "Could not insert the data" });
		});
});

app.delete("/grades/:id", (req, res) => {
	let gradeId;
	if (ObjectId.isValid(req.params.id)) {
		gradeId = new ObjectId(req.params.id);
	} else if (/^\d+$/.test(req.params.id)) {
		try {
			gradeId = parseInt(req.params.id);
			if (isNaN(gradeId)) {
				throw new Error("Invalid id provided");
			}
		} catch (error) {
			res.status(400).json({ Error: "Invalid id provided" });
			return;
		}
	} else {
		res.status(400).json({ Error: "Invalid id provided" });
		return;
	}

	db.collection("grades")
		.deleteOne({ _id: gradeId })
		.then((data) => {
			if (data) res.status(200).json(data);
			else res.status(200).json({ Error: "Could not delete the data" });
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

app.patch("/grades/:id", (req, res) => {
	let gradeId;
	if (ObjectId.isValid(req.params.id)) {
		gradeId = new ObjectId(req.params.id);
	} else if (/^\d+$/.test(req.params.id)) {
		try {
			gradeId = parseInt(req.params.id);
			if (isNaN(gradeId)) {
				throw new Error("Invalid id provided");
			}
		} catch (error) {
			res.status(400).json({ Error: "Invalid id provided" });
			return;
		}
	} else {
		res.status(400).json({ Error: "Invalid id provided" });
		return;
	}

	db.collection("grades")
		.updateOne({ _id: gradeId }, { $set: req.body })
		.then((data) => {
			if (data) res.status(200).json(data);
			else res.status(200).json({ Error: "Could not update the data" });
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});
