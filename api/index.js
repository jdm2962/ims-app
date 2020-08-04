const express = require('express');
const cors = require('cors');
const uuid = require('uuid')

const aws = require('aws-sdk');
const dynamo = new aws.DynamoDB({'region' : 'us-east-1'});

const app = express();

app.use(cors());

const port = 3000;

const tableName = 'ims-table';

let resData;


// home route
app.get('/api', (req, res) => {
	res.send("<h1>React HomePage filler!</h1>");
});

// get all items
app.get('/api/items', (req, res) => {
	const params = {
	TableName : tableName,
	};
	resData = [];

	dynamo.scan(params, (err, data) => {
		if(err) throw err;
		data['Items'].map((item) => {
			resData.push(
				{
					'category' : item.category.S,
					'id' : item.id.S,
					'name' : item.name.S,
					'quantity' : item.quantity.N,
					'packages' : item.packages.N,
					'quantityPerPackage' : item.quantityPerPackage.N
				}
			);
		});
		res.json(resData);
		resData = [];
		
	});
});


// get item by id
app.get('/api/item/:id', (req, res) => {

});


// get a single item by category and item name
app.get('/api/item/:category/:name', (req, res) => {
	const category = req.params.category;
	const name = req.params.name;
	const params = {
		TableName : tableName,
		Key : {
			'category' : {'S' : category},
			'name' : {'S' : name}
		}
	};

	dynamo.getItem(params, (err, data) => {
		if(err){
			console.log(err);
			res.status(500).send('Server Error');
		}

		else if(data.Item === undefined || data.Item === null) {
			res.status(404).send('Sorry, it looks like that item doesn\'t exist');
		}
		else {
			resData = {
				'category' : data.Item.category.S,
				'name' : data.Item.name.S,
				'id' : data.Item.id.S,
				'quantity' : data.Item.quantity.N,
				'packages' : data.Item.packages.N,
				'quantityPerPackage' : data.Item.quantityPerPackage.N
			}
			res.json(resData);
			resData = [];
		}
	});
});

// insert an item w/ attributes

app.post('/api/item', (req, res) => {
	let id = uuid.v4();
	let name = (!req.query.name) ? '' : req.query.name.toLowerCase();
	let category = (!req.query.category) ? 'uncategorized' : req.query.category.toLowerCase();
	let quantity = (!req.query.quantity) ? 0 : req.query.quantity;
	let packages = (!req.query.packages) ? 0 : req.query.packages;
	let quantityPerPackage = (!req.query.quantityPerPackage) ? 0 : req.query.quantityPerPackage;

	const params = {
		TableName : tableName,
		Item : {
			'id' : {'S' : id},
			'category' : {'S' : category},
			'name' : {'S' : name},
			'quantity' : {'N' : quantity.toString()},
			'packages' : {'N' : packages.toString()},
			'quantityPerPackage' : {'N' : quantityPerPackage.toString()}

		},
		ConditionExpression : 'attribute_not_exists(id)', 
	};
	// check to see if item attributes have been given
	if(Object.keys(req.query).length === 0) res.status(400).send("Error, need to enter item attributes.");
	else if(!name) res.status(400).send("Error, must enter an item name.");
	else
	{
		dynamo.putItem(params, (err, data) => {
			if(err){
				if(err.code === 'ConditionalCheckFailedException') res.status(400).send("Item already exists.");
				else{
					console.log(err);
					res.status(500).send('Server Error');
				}
			}
			else res.status(200).send("Success. Item entered");
		});
	}
});

// delete an item by id

// delete an item by category + name
app.delete('/api/item/:category/:name', (req, res) => {

	let category = req.params.category;
	let name = req.params.name;
	const params = {
		TableName : tableName,
		Key : {
			'category' : {'S' : category},
			'name' : {'S' : name}
		},
		ConditionExpression : 'attribute_exists(id)'
	};

	dynamo.deleteItem(params, (err, data) => {
		if(err){
			if(err.code === 'ConditionalCheckFailedException') res.status(404).send('It looks like that item doesn\'t exist. Try another item.');
			else{
				console.log(err);
				res.status(500).send("Server Error")
			}
			
		}
		else res.status(200).send('Success. Item deleted.');
	});

});

// update an item by id

// update an item by category + name

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));









