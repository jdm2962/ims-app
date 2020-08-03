const express = require('express');
const cors = require('cors');

const aws = require('aws-sdk');
const dynamo = new aws.DynamoDB({'region' : 'us-east-1'});

const app = express();

app.use(cors());

const port = 3000;

const tableName = 'ims-table';

let resData = [];


// home route
app.get('/api', (req, res) => {
	res.send("<h1>React HomePage filler!</h1>");
});

// get all items
app.get('/api/items', (req, res) => {
	const params = {
	TableName : tableName,
	// ProjectionExpression : 'category'
	};

	dynamo.scan(params, (err, data) => {
		if(err) throw err;
		data['Items'].map((item) => {
			resData.push(
				{
					category : item.category.S,
					id : item.itemId.N,
					name : item.name.S
				}
			);
		});
		res.json(resData);
		resData = [];
		
	});
});


// get a single item category and item name
app.get('/api/item/:category/:name', (req, res) => {
	const id = req.params.id;
	const category = req.params.category;
	const name = req.params.name;
	const params = {
		TableName : tableName,
		IndexName : "category-name-index",
		ExpressionAttributeNames : {
			'#n' : 'name'
		},
		ExpressionAttributeValues : {
			':name' : {"S" : name},
			':category' : {"S" : category}
		},
		KeyConditionExpression : `category = :category AND #n = :name`
	};


	dynamo.query(params, (err, data) => {
		if(err){
			console.log(err);
			res.status(500).send('Server Error');
		}
		if(data.Count === 0) res.status(404).send('Sorry, it looks like that item doesn\'t exist');
		else {
			resData = {
				'category' : data.Items[0].category.S,
				'name' : data.Items[0].name.S,
				'id' : data.Items[0].itemId.N
			}
			res.json(resData);	
		}
	});

});

// insert an item w/ attributes

// delete an item by id

// update an item by id

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));









