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
					'singles' : item.singles.N,
					'packages' : parseInt(item.packages.N),
					'quantityPerPackage' : paseInt(item.quantityPerPackage.N),
					'total' : parseInt(item.total.N)
				}
			);
		});
		
	});

		res.json(resData);
		resData = [];
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
			let cat = data.Item.category.S;
			resData = {
				"category" : cat,
				"name" : data.Item.name.S,
				"id" : data.Item.id.S,
				"singles" : data.Item.singles.N,
				"packages" : data.Item.packages.N,
				"quantityPerPackage" : data.Item.quantityPerPackage.N,
				"total" : data.Item.total.N
			}
			// res.json(resData);
			res.set('Content-Type', 'application/json');
			res.send(JSON.stringify(resData)); 
			resData = [];
		}
	});
});

// insert an item w/ attributes

app.post('/api/item', (req, res) => {
	let id = uuid.v4();
	let name = (!req.query.name) ? '' : req.query.name.toLowerCase();
	let category = (!req.query.category) ? 'uncategorized' : req.query.category.toLowerCase();
	let singles = (!req.query.singles) ? 0 : req.query.singles;
	let packages = (!req.query.packages) ? 0 : req.query.packages;
	let quantityPerPackage = (!req.query.quantityPerPackage) ? 0 : req.query.quantityPerPackage;
	let total = parseInt(singles) + (quantityPerPackage * packages);

	const params = {
		TableName : tableName,
		Item : {
			'id' : {'S' : id},
			'category' : {'S' : category},
			'name' : {'S' : name},
			'singles' : {'N' : singles.toString()},
			'packages' : {'N' : packages.toString()},
			'quantityPerPackage' : {'N' : quantityPerPackage.toString()},
			'total' : {'N' : total.toString()}

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
app.put('/api/item/:category/:name', (req, res) => {
	let category = req.params.category;
	let name = req.params.name;
	let total = 0;
	let updateExpression = 'SET ';
	let expressionAttributeValues = {};
	const params = {
		TableName : tableName,
		Key : {
			'category' : {'S': category},
			'name' : {'S': name}
		},
		ExpressionAttributeNames : {},
		ExpressionAttributeValues : expressionAttributeValues,
		UpdateExpression: updateExpression,
		ReturnValues: 'ALL_NEW',
		ConditionExpression : 'attribute_exists(id)'
	};
	const correctParams = ['singles', 'packages', 'quantityPerPackage'];
	const queryArray = Object.entries(req.query);
	let queryNonNumber = false;
	let incorrectParam = false;
	let needPackages = false;
	let needQuantity = false;
	let nonNumberList = [];
	let incorrectParams = [];

	// loop through param values. check for non number entries
	for([key, value] of Object.entries(req.query)){
		if(isNaN(parseInt(value))){ 
			queryNonNumber = true;
			nonNumberList.push(`${key} : ${value}`);
		}

		if(!correctParams.includes(key)){
			incorrectParam = true;
			incorrectParams.push(key);
		}
	}


	// make sure category or name is not being updated
	if(req.query.name || req.query.category) res.status(400).send('Cannot update category or name. Create a new item.');

	// check for valid parameters
	else if(incorrectParam) res.status(400).send(`One or more incorrect parameters. Incorrect parameters: ${incorrectParams}. Correct paramters are singles, packages, quantityPerPackage`);

	// check for correct param types(only numbers)
	else if(queryNonNumber){
		res.status(400).send(`One or more of the entered parameters is not a number. Please fix these parameters: ${nonNumberList}`)
	}

	else{	// populate expressionAttributeValues and updateExpression

		for(const index in queryArray){
			let key = queryArray[index][0];
			let value = queryArray[index][1];

			expressionAttributeValues[`:${key[0]}`] = {N : value};

			// populate updateExpression
			// use different formatting if value is the last element in the array
			if(parseInt(index) === (queryArray.length - 1)){
				updateExpression += `${key} = :${key[0]}`;
			} 
			else {
				updateExpression += `${key} = :${key[0]}, `;
			}
			
		}

		// calculate total items value

		let singles, packages, quantityPerPackage;

		// determine whether or not to query db for extra info
		if(!req.query.packages || !req.query.quantityPerPackage || !req.query.singles){
			console.log('param not there')

			let getParams = {
				TableName : tableName,
				Key : params.Key
			};

			dynamo.getItem(getParams, (err, data) => {
				if(err){
					console.log(err);
					res.status(500).send('Server Error');
				}
				// check for an empty data object(item not found)
				// else if(!data.Item) res.status(400).send('Error in path. Item not found.');
				else{
					console.log('calculating total...')
					singles = (req.query.singles) ? req.query.singles : data.Item.singles.N;
					packages = (req.query.packages) ? req.query.packages : data.Item.packages.N;
					quantityPerPackage = (req.query.quantityPerPackage) ? req.query.quantityPerPackage : data.Item.quantityPerPackage.N;

					if(packages == 0 && quantityPerPackage != 0){
						console.log('need packages');
						needPackages = true;;
					} 
					else if(quantityPerPackage == 0 && packages != 0){
						console.log('need quantity');
						needQuantity = true;
					}
					else{
						console.log('everything is good :)')
						total = parseInt(singles) + parseInt(packages) * parseInt(quantityPerPackage);
						console.log(total);
					} 
				}
			});
		}
		else{	// all the required params are there. calculate total
			total = parseInt(req.query.singles) + parseInt(req.query.packages) * parseInt(req.query.quantityPerPackage);
			console.log('total:', total); 
		}
		// temporary fix. get item taking a long time to return... causing issues
		setTimeout(() => {

			// verify that the correct values are present
			if(needPackages === true){
				res.status(400).send('Error. Quantity per package found but amount of packages not found. Enter amount of packages');
			} 
			else if(needQuantity === true){
				console.log('quantity needed');
				res.status(400).send('Error. Packages found but quantity per package not found. Enter quantityPerPackage.');
			} 

			else{

				console.log('block beofore update item');
				if(total !== 0){
					expressionAttributeValues[':t'] = {N : total.toString()};
					params.ExpressionAttributeNames['#t'] = 'total';
					updateExpression += `, #t = :t`;
				}
				
				console.log(updateExpression)

				params.UpdateExpression = updateExpression;
				params.ExpressionAttributeValues = expressionAttributeValues;
				dynamo.updateItem(params, (err, data) => {

					if(err){
						if(err.code === 'ConditionalCheckFailedException') res.status(400).send("Error. You can only update existing items.");
						else{
							console.log(err);
							res.status(500).send('Server Error')
						}
					}
					else
					{
						res.json(data);
					}

				});
			}	
		}, 500);
	}
});

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));









