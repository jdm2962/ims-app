const express = require('express');
const cors = require('cors');

const aws = require('aws-sdk');
const dynamo = new aws.DynamoDB({'region' : 'us-east-1'});

const app = express();

app.use(cors());

const port = 3000;

const tableName = 'ims-table';
const params = {
	TableName : tableName,
	// ProjectionExpression : 'category'
};

let resData = [];


// home route
app.get('/api', (req, res) => {
	res.send("<h1>React HomePage filler!</h1>");
});

// get all items
app.get('/api/items', (req, res) => {
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




// get a single item by id

// insert an item w/ attributes

// delete an item by id

// update an item by id

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));









