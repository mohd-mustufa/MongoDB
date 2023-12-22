# MongoDB

## Terminology

- **Database:** A container for collections. This is the same as a database in SQL and usually each project will have its own database full of different collections.
- **Collection:** A grouping of documents inside of a database. This is the same as a table in SQL and usually each type of data (users, posts, products) will have its own collection.
- **Document:** A record inside of a collection. This is the same as a row in SQL and usually
  there will be one document per object in the collection. A document is also essentially just a JSON object.

- **Field:** A key value pair within a document. This is the same as a column in SQL. Each document will have some number of fields that contain information such as name, address, hobbies, etc. An important difference between SQL and MongoDB is that a field can contain values such as JSON objects, and arrays instead of just strings, number, booleans, etc.

**Note:** In MongoDB, a field refers to a key-value pair within a document. Each document can have different fields, and these fields do not need to be the same across all documents in a collection. This flexibility is one of the characteristics of NoSQL databases, and it distinguishes MongoDB from the more structured, tabular nature of SQL databases. The data in these documents is stored in the form of BSON.

**MongoDB : SQL  
Database : Database  
Collection : Table  
Document : Row  
Field : Column/Attr**

## Basic Commands

- **sudo systemctl status mongod**: To check if the mongodb server is active.
- **sudo systemctl start mongod**: To start the mongodb server.
- **sudo systemctl stop mongod**: To stop the mongodb server.
- **mongosh**: Opens a connection to your local MongoDB instance. All other commands
  will be run within this mongosh connection.
- **show dbs**: Show all databases in the current MongoDB instance.
- **use \<dbname\>**: Switch to the database provided by dbname.
- **db**: Show current database name.
- **show collections**: Show all collections in the current database.
- **db.dropDatabase()**: Delete the current database.
- **cls**: Clear the terminal screen.
- **exit**: Exit the mongosh session.

**Note:** A db does not have to exist for us to use it. If a db does not exist and we do use dbNameThatDoesNotExist, it will still switch to that db, but we will not be able to see it when we try the `show dbs` command. This db will be created only after we insert a document inside that db. Same goes for a collection, it will not throw an error if we try to access a collection that does not exist, it will just create a new collection with that name if it does not exist after we insert any data in that collection.

## Create

#### Each of these commands is run on a specific collection

`Syntax: db.<collectionName>.<command>`

- **insertOne**: Create a new document inside the specified collection.  
  Ex: **db.users.insertOne({ name: “Mustufa” })** - Adds a new document with the name of Mustufa into the users collection.
  <br>
- **insertMany**: Create multiple new documents at once inside a specific collection.  
  Ex: **db.users.insertMany([{ age: 26 }, { age: 20 }])** - Add two new documents with the age of 26 and 20 into the users collection.

## Find

#### Each of these commands is run on a specific collection

`Syntax: db.<collectionName>.<command>`

- **find**: Gets all documents.  
  Ex: **db.users.find()** - Get all the documents inside users collection.  
   <br>
- **find(\<filterObject>)**: Find all documents that match the filter object.  
  Ex1: **db.users.find({ name: “Mustufa” })** - Get all users with the name Mustufa.  
  Ex2: **db.users.find({ “address.street”: “123 Main St” })** - Get all users whose adress field has a street field with the value 123 Main St.  
   <br>
- **find(\<filterObject> , \<selectObject>)** - Find all documents that match the filter object but only return the field specified in the select object.  
  Ex1: **db.users.find({ name: “Mustufa” }, { name: 1, age: 1 })** - Get all users with the name Mustufa but only return their name, age, and \_id.  
  Ex2: **db.users.find({}, { age: 0 })** - Get all users and return all fields except for age.  
   <br>
- **findOne**: The same as find, but only return the first document that matches the filter object.  
  Ex1: **db.users.findOne({ name: “Mustufa” })** - Gets the first user with the name Mustufa.
  <br>
- **countDocuments**: Return the count of the documents that match the filter object passed to it.  
  Ex1: **db.users.countDocuments({ name: “Mustufa” })** - Get the number of users with the name Mustufa.  
  Ex2: **db.users.find({name:"Mustufa"}).count()** - Another way of getting the count.  
   <br>
- **Using Regex**: We can use regex to find the documents as well.  
  Ex1: **db.users.find({name:/mus/})** - Gets all the users who have mus in their name.  
  Ex2: **db.users.find({name:/mus/}).count()** - Gets the count of all the users who have mus in their name.  
   <br>

**Note:** The find() method can take two parameters, which are `1. Filter` and `2. Projection`. There are two types of projection:

1. **Inclusion projection:** Inclusion projection means specifying all fields to be included in the result of querying a document. This is done by assigning 1 to all values of keys desired for inclusion in an object that is passed as the second parameter of the find method. Note that **only the "\_id" key can be added for exclusion when performing inclusion projection (else it will throw error).**
2. **Exclusion projection:** Exclusion projection means specifying all fields to be excluded in result of querying a document. This is done by assigning 0 to all values of keys desired for excluded in an object that is passed as the second parameter of the find method.

## Read Modifiers

#### Any combination of the below can be added to the end of any read operation

- **sort**: Sort the results of a find by the given fields.  
  Ex: **db.users.find().sort({ name: 1, age: -1 })** - Get all users sorted by name in alphabetical order and then if any names are the same sort by age in reverse order.

- **limit**: Only return a set number of documents.  
  Ex: **db.users.find().limit(2)** - Only return the first 2 users.

- **skip**: Skip a set number of documents from the beginning.  
  Ex: **db.users.find().skip(4)** - Skip the first 4 users when returning results. This is great for pagination when combined with limit.

- Chained Example: **db.authors.find({"address.street": /street/}).sort({"address.street": -1}).limit(1).skip(1)**

## Arrays

Lets say we have documents with this data:

```json
{
	"_id": 7,
	"rank": 2,
	"name": "Salena Olmos",
	"scores": [
		{ "score": 90.37826509157176, "type": "exam" },
		{ "score": 42.48780666956811, "type": "quiz" },
		{ "score": 96.52986171633331, "type": "homework" }
	],
	"hobbies": ["cooking", "programming"]
}
```

- **Contains A Value**: When we use filters to query docs based on array values, it just checks whether that particular values exists in the array. If it does, then that obj is returned.  
  Ex: **db.users.find({hobbies: "swimming"})** - Returns the object if it has a value called swimming in the hobbies array. Some examples of hobbies array that can be returned: ["swimming"], ["cycling", "swimming"].

- **Exact Match**: To find the exact match in an array:  
  Ex: **db.users.find({hobbies: ["swimming"]})**

- **Specify Multiple Values**: If you have a list of values and want to get the objects which have either of those values mentioned in the list.  
  Ex: **db.users.find({hobbies: \{\$in: ["swimming", "cycling"]}})** - Returns objs where the hobbies have either swimming or cycling or both. Ex: ["swimming"], ["cycling", "swimming"], ["reading", "cycling"].
- If you have a list of values and want to get the objects which have all of those values mentioned in the list.  
  Ex: **db.users.find({hobbies: {$in: ["swimming", "cycling"]}})** - Returns objs where the hobbies have both swimming and cycling. Ex: ["cycling", "swimming"], ["swimming", "reading", "cycling"].

- **Size**: To find documents where the size of an array meets a specific condition, you can use the $size operator.  
  Ex: **db.users.find({hobbies: \{\$size: 1}})** - Returns objs where the size of the hobbies array is 1.

- **elemMatch**: It is used to query array elements that match multiple criteria within the same array field.  
  Ex: **db.users.find({"scores": \{\$elemMatch: {score: {$gt: 75}, type: "exam"}}})** - Returns users who scored greater than 75 in type exam.

## Delete

#### Each of these commands is run on a specific collection

`Syntax: db.<collectionName>.<command>`

- **deleteOne**: Delete the first document that matches the filter object.  
  Ex: **db.users.deleteOne({ age: 20 })**: Delete the first user with an age of 20.

- **deleteMany**: Delete all documents that matches the filter object.  
  Ex: **db.users.deleteMany({ age: 12 })** - Delete all users with an age of 12.

## Update

#### Each of these commands is run on a specific collection

`Syntax: db.<collectionName>.<command>`

- **updateOne**: Update the first document that matches the filter object with the data passed into the second parameter which is the update object.  
  Ex: **db.users.updateOne({ age: 20 }, { \$set: { age: 21 } })** - Update the first user with an age of 20 to the age of 21.

- **updateMany**: Update all documents that matches the filter object with the data passed into the second parameter which is the update object.  
  Ex: **db.users.updateMany({ age: 12 }, { $inc: { age: 3 } })** - Update all users with an age of 12 by adding 3 to their age.

- **replaceOne**: Replace the first document that matches the filter object with the exact object passed as the second parameter. This will completely overwrite the entire object and not just update individual fields.  
  Ex: **db.users.replaceOne({ age: 12 }, { age: 13 })** - Replace the first user with an age of 12 with an object that has the age of 13 as its only field.

## Complex Filter Object

#### Any combination of the below can be use inside a filter object to make complex queries

- **\$eq**: Check for equality.  
  Ex: **db.users.find({ name: { \$eq: “Mustufa” } })** - Get all users with the name Mustufa.

- **\$ne**: Check for not equal.  
  Ex: **db.users.find({ name: { \$ne: “Mustufa” } })** - Get all users with a name other than Mustufa.

- **$gt / $gte**: Check for greater than and greater than or equal to.  
  Ex1: **db.users.find({ age: { \$gt: 12 } })** - Get all users with an age greater than 12.  
  Ex2: **db.users.find({ age: { \$gte: 1 5 } })** - Get all users with an age greater than or equal to 15.

- **$lt / $lte**: Check for less than and less than or equal to.  
  Ex1: **db.users.find({ age: { \$lt: 12 } })** - Get all users with an age less than 12.  
  Ex2: **db.users.find({ age: { \$lte: 1 5 } })** - Get all users with an age less than or equal to 15.

- **\$in**: Check if a value is one of many values.  
  Ex: **db.users.find({ name: { \$in: [“Md” , “Mustufa” ] } })** - Get all users with a name of Md or Mustufa.

- **\$nin**: Check if a value is none of many values.  
  Ex: **db.users.find({ name: { \$nin: [“Md” , “Mustufa” ] } })** - Get all users that do not have the name Md or Mustufa.

- **\$and**: Check that multiple conditions are all true.  
  Ex1: **db.users.find({ \$and: [{ age: 20 } , { name: “Mustufa” } ] })** - Get all users that have an age of 20 and the name Mustufa.  
  Ex2: **db.users.find({ age: 20 , name: “Mustufa” })** - This is an alternative way to do the same thing. Generally you do not need \$and.

- **\$or**: Check that one of multiple conditions is true.  
  Ex: **db.users.find({ \$or: [{ age: 20 } , { name: “Mustufa” } ] })** - Get all users with a name of Mustufa or an age of 20.

- **\$not**: Negate the filter inside of \$not.  
  Ex: **db.users.find({ name: { $not: { $eq: “Mustufa” } } })** - Get all users with a name other than Mustufa.

- **\$exists**: Check if a field exists.  
  Ex: **db.users.find({ name: { \$exists: true } })** - Get all users that have a name field.

- **\$expr**: Do comparisons between different fields.  
  Ex: **db.users.find({ $expr: { $gt:  [“$balance” , “$debt” ] } })** - Get all users that have a balance that is greater than their debt.

## Complex Update Object

#### Any combination of the below can be use inside an update object to make complex updates

- **\$set**: Update only the fields passed to $set. This will not affect
  any fields not passed to \$set. It will add a new field if the specified field does not exist.  
  Ex: **db.users.updateOne({ age: 12 }, { \$set: { name: “Hi” } })** - Update the name of the first user with the age of 12 to the value Hi.

- **\$unset**: Remove a field.  
  Ex: **db.users.updateOne({ age: 12 }, { \$unset: { age: “” } })** - Remove the age field from the first user with an age of 12.

- **\$inc**: Increment the value of the field by the amount given.  
  Ex: **db.users.updateOne({ age: 12 }, { \$inc: { age: 2 } })** - Add 2 to the age of the first user with the age of 12.

- **\$rename**: Rename a field.  
  Ex: **db.users.updateMany({}, { \$rename: { age: “years” } })** - Rename the field age to years for all users.

- **\$push**: Add a value to an array field.  
  Ex: **db.users.updateMany({}, { \$push: { friends: “ John” } })** - Add John to the friends array for all users.

- **\$pull**: Remove a value from an array field.  
  Ex: **db.users.updateMany({}, { \$pull: { friends: “Mike” } })** - Remove Mike from the friends array for all users.

- **$each**: The $each modifier is available for use with the $addToSet operator and the $push operator. We can use it to add multiple elements at once to an array.  
  Ex: **db.users.updateOne({_id: 9}, {$push: {exField: {$each: [12, 14]}}})\*\* - Pushes the two values 12 and 14 to the array exField.

- **\$\<identifier>**: The filtered positional operator $[\<identifier>] identifies the array elements that match the arrayFilters conditions for an update operation. If we have an array with with many values and want to update only a particular value then we can use this.  
  Syntax:

```
db.collection.updateMany(
   { <query conditions> },
   { <update operator>: { "<array>.$[<identifier>]" : value } },
   { arrayFilters: [ { <identifier>: <condition> } ] }
)
```

Ex: **db.users.updateOne( {\_id: 8}, {\$inc: {"exField.$[value]": 2}}, {arrayFilters: [{value: 12}]})** - Increments the value 12 in the array with the name exField by 2. If there are multiple values of 12, it updates them all.

## Using MongoDB in node.js

#### Differences in execution on shell and node.js

- To invoke any method on a collection:  
  shell: db.collectionName  
  node: db.collection('collectionName')

- The find method doesn't return all the documents to us, it returns whats knows as a cursor which is an object that essentially points to a set of documents outlined by our query. So without an arguments inside this find method, its going to point to the whole collection of documents. But if we add a filter as an argument its going to then point to a subset of documents based on that filter and then this cursor object that we get returned from the find method exposes methods that we can use to then fetch the data wch the cursor points to. Two of these methods that we can use are **toArray** and **forEach**.
  - **toArray**: fetches all the documents that the cursor points to and it puts them in an array for us.
  - **forEach**: iterates the documents one at a time and allows us to process each one individually.
- Now when we fetch the documents from mongoDB using either of those two methods, it actually gets documents from the db in batches. Thats because our collection could contain huge amounts of documents like 50000 or even more, and if we fetched all of those documents in one go then it would increase the network bandwidth usage. So instead mongoDB fetches the documents in smaller batches the default batch size being 101 documents. So ex: if we use the find method to get the cursor and on that cursor we use the forEach method it will fetch the first batch of documents, and the foreach method then iterates the batch of doc so we can process each one and after that batch is exhausted it will then fetch the next batch and so forth.  
  We didn't have to use these methods in the shell when we previously used the find method and thats because the shell automatically iterates the first 20 documents for us when we use the find method and it shows us those in the terminal and then to see more documents in the shell we can just use the command **it** and it would iterate some more. So the shell behaviour is unique in this regard and when we are actually coding an application we work manually with the cursor object instead.
