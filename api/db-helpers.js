const aws = require('aws-sdk');
const dynamo = new aws.DynamoDB({'region' : 'us-east-1'});
const converter = aws.DynamoDB.Converter;

const tableName = 'ims-table';

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
				returnList = convertOutput(data.Items);
				resolve(returnList);
			}
		});		
	});
};


const getItem = () =>
{

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
exports.putItem = putItem;
exports.updateItem = updateItem;
exports.deleteItem = deleteItem;