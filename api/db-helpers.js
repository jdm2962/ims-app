const aws = require('aws-sdk');
const dynamo = new aws.DynamoDB({'region' : 'us-east-1'});
const converter = aws.DynamoDB.Converter;

const tableName = 'ims-table';
const idIndex = "id-index";

const convertOutput = (items) =>
{
	// format items from dynamodb for return
	let returnList = items.map(item => 
	{
		let itemObj = {};
		Object.entries(item).forEach(val => {
			let [key, value] = val;
			itemObj[key] = converter.output(value);
		});
		return itemObj
	});

	return returnList;
};

const getItems = () =>
{
	const params = 
	{
		TableName : tableName,
	};

	let returnList = [];

	return new Promise((resolve, reject) => 
	{
		dynamo.scan(params, (err, data) => 
		{
			if(err)
			{
				reject(err);
			}
			else
			{
				resolve(convertOutput(data.Items))
			}
		});		
	});
};


const getItem = (category, name) =>
{
	// get item by category and name
	const params = {
		TableName : tableName,
		Key : {
			'category' : converter.input(category),	// convert data to dynamodb expected values
			'name' : converter.input(name)
		}
	};

	let convertList = [];

	return new Promise((resolve, reject) => 
	{
		dynamo.getItem(params, (err, data) => 
		{
			if(err)
			{
				reject(err);
			}
			else
			{
				if(!data.Item)
				{
					reject("404")
				}
				else
				{
					convertList.push(data.Item);
					resolve(convertOutput(convertList));
				}
			}
		});
	});
};

const getItemById = (id) =>
{
	// get item by id
	const params = 
	{
		TableName : tableName,
		IndexName : idIndex,
		ExpressionAttributeValues : {":id" : converter.input(id)},
		KeyConditionExpression : "id = :id"
	}

	return new Promise((resolve, reject) => 
	{
		dynamo.query(params, (err, data) =>
		{
			if(err)
			{
				reject(err);
			}
			else
			{
				if(!data.Items)
				{
					reject("404");
				}
				else
				{
					resolve(convertOutput(data.Items));
				}
			}
		});	
	});

};


const putItem = () =>
{

};

const updateItem = () =>
{

};

const deleteItem = () =>
{

};


exports.getItems = getItems;
exports.getItem = getItem;
exports.getItemById = getItemById;
exports.putItem = putItem;
exports.updateItem = updateItem;
exports.deleteItem = deleteItem;