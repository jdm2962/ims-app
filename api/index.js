const express = require('express');
const cors = require('cors');
const uuid = require('uuid')

const db = require("./db-helpers.js");
const app = express();

app.use(cors());

const port = 3000;


// home route
app.get('/api', (req, res) => {
	res.send("<h1>React HomePage filler!</h1>");
});

// get all items
app.get('/api/items', (req, res) => {
	db.getItems()
		.then(data => res.json(data))
		.catch(err => res.status(500).send("Error collecting items. . . try again."))
});


// get item by id
app.get('/api/item/:id', (req, res) => {
	let id = req.params.id;
	
	db.getItemById(id)
		.then(data => res.json(data))
		.catch(err => 
		{
			console.log(err);
			if(err === "404")
			{
				res.status(404).send("Item doesn't exist or incorrect parameter. . . try again.");
			}
			else
			{
				res.status(500).send("Looks like something went wrong... Try again or contact support.");
			}
		})
});


// get a single item by category and item name
app.get('/api/item/:category/:name', (req, res) => {
	const category = req.params.category;
	const name = req.params.name;

	db.getItem(category, name)
		.then(data => res.json(data))
		.catch(err => 
		{
			console.log(err);
			if(err === "404")
			{
				res.status(404).send("That item doesn't exist.");
			}
			else
			{
				res.status(500).send("Looks like something went wrong... Try again or contact support.");
			}

		})
});

// insert an item w/ attributes
app.post('/api/item/:category/:name', (req, res) => {
	let id = uuid.v4();
	// let name = (!req.query.name) ? '' : req.query.name.toLowerCase();
	// let category = (!req.query.category) ? 'uncategorized' : req.query.category.toLowerCase();
	let category = req.params.category;
	let name = req.params.name;
	let singles = (!req.query.singles) ? 0 : req.query.singles;
	let packages = (!req.query.packages) ? 0 : req.query.packages;
	let quantityPerPackage = (!req.query.quantityPerPackage) ? 0 : req.query.quantityPerPackage;
	let total = parseInt(singles) + (quantityPerPackage * packages);

	db.insertItem(id, category, name, singles, packages, quantityPerPackage, total)
		.then(data => res.json(data))
		.catch(err =>
		{
			if(err === "400")
			{
				res.json("Item already exists");
			}
			else
			{
				res.status(500).send("Something went wrong. Try again or contact support.");
			}
		})
	
});


// delete an item by category + name
app.delete('/api/item/:category/:name', (req, res) => {

	let category = req.params.category;
	let name = req.params.name;
	
	db.deleteItem(category, name)
		.then(data => res.json(data))
		.catch(err =>
		{
			if(err === "404")
			{
				res.status(404).send("It looks like that item doesn't exist. Try another item.");
			}
			else
			{
				console.log(err);
				res.status(500).send("Server error contact support.");
			}
		})
});


// update an item by category + name
app.put("/api/item/:category/:name", (req, res) =>
{
	// variables : conditionally assign based on values
	let category = req.params.category;
	let name = req.params.name;
	let updates = req.query;
	let total = 0;
	let updateCategory = updates.category;
	let updateName = updates.name;
	let updateSingles = updates.singles;
	let updatePackages = updates.packages;
	let updateQuantityPerPackage = updates.quantityPerPackage;
	let updateTotal;

	// check for no query string params
	if(Object.keys(updates).length < 1)
	{
		res.status(400).send("Please enter parameter(s) to update.");
	}
	else
	{
		// determine if the category or name is being updated
		if(updates.name || updates.category)
		{	// if so item needs to be deleted then inserted
			// need to query for more info?
			if(!updates.name || !updates.category || !updates.singles || !updates.packages || !updates.quantityPerPackage)
			{
				db.getItem(category, name)
					.then(data =>
					{
						let oldData = data[0];
						let id = oldData.id;
						updateCategory = updates.category ? updates.category : oldData.category;
						updateName = updates.name ? updates.name : oldData.name;
						updateSingles = !(updates.singles === undefined) ? updates.singles : oldData.singles;
						updatePackages = !(updates.packages === undefined) ? updates.packages : oldData.packages;
						updateQuantityPerPackage = !(updates.quantityPerPackage === undefined) ? updates.quantityPerPackage : oldData.quantityPerPackage;
						updateTotal = parseInt(updateSingles) + updatePackages * updateQuantityPerPackage;

						// delete old item
						db.deleteItem(category, name)
							.then(data => 
							{
								// insert new item
								console.log(updates.quantityPerPackage);
								db.insertItem(id, updateCategory, updateName, updateSingles, updatePackages, updateQuantityPerPackage, updateTotal)
									.then(data => res.send("Success. Item updated."))
									.catch(err => console.log(err))
							})
							.catch(err => 
								{
									console.log(err);
									res.status(500).send("Failed to update item... try again.");
								})
						
					})
					.catch(err =>
					{
						if(err === "404")
						{
							res.status(404).send("Item doesn't exist. . . Try again.")
						}
						else
						{
							res.status(500).send("Server Error. Contact support.")
						}
					})
			}
			else
			{	// all values were given for update
				updateTotal = parseInt(updateSingles) + updatePackages * updateQuantityPerPackage;
				db.deleteItem(category, name)
					.then(data =>
					{
						db.insertItem(uuid.v4(), updateCategory, updateName, updateSingles, updatePackages, updateQuantityPerPackage, updateTotal)
							.then(data => res.send("Success. Item updated."))
							.catch(err => console.log(err))

					})
					.catch(err => 
					{
						if(err === "404")
						{
							res.status(404).send("Item doesn't exist. . . Try again.")
						}
						else
						{
							res.status(500).send("Server Error. Contact support.")
						}
					})
			}
		}
		else
		{
			// else update with new values
			// retrieve any missing values from db(id is going to be missing at least)
			db.getItem(category, name)
				.then(data =>
				{
					let oldData = data[0];
					updateSingles = updateSingles ? updateSingles : oldData.singles;
					updatePackages = updatePackages ? updatePackages : oldData.packages;
					updateQuantityPerPackage = updateQuantityPerPackage ? updateQuantityPerPackage : oldData.quantityPerPackage;
					updateTotal = parseInt(updateSingles) + updatePackages * updateQuantityPerPackage;
					console.log(updateSingles, updatePackages, updateQuantityPerPackage);

					// then update item
					db.updateItem(category, name, updateSingles, updatePackages, updateQuantityPerPackage, updateTotal)
						.then(data => res.send("Success item updated."))
						.catch(err =>
						{
							if(err === "404")
							{
								res.status(404).send("Item does not exist.");
							}
							else
							{
								console.log(err);
								res.status(500).send("Server error. Contact support.")
							}
						})
				})
				.catch(err =>
				{
					console.log(err);
					if(err === "404")
					{
						res.status(404).send("Could not find item to update... try again");
					}
					else
					{
						res.status(500).send("Server error... try again or contact support.");
					}
				})
		}
	}

});


app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));