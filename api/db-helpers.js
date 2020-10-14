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
					reject("404");
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
	};

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
				if(data.Items.length === 0)
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


const insertItem = (id, category, name, singles, packages, quantityPerPackage, total) =>
{
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

	return new Promise((resolve, reject) => 
	{
		dynamo.putItem(params, (err, data) => 
		{
			if(err){
				if(err.code === 'ConditionalCheckFailedException')
				{
					reject("400");	
				} 
				else{
					console.log(err);
					reject("500");
				}
			}
			else
			{
				resolve("Success. Item entered.");
			}
		});
	});

};

const updateItem = (category, name, singles, packages, quantityPerPackage, total) =>
{
	const params = {
		TableName : tableName,
		Key : {
			'category' : {'S': category},
			'name' : {'S': name}
		},
		ExpressionAttributeNames : 
		{
			"#S" : "singles",
			"#P" : "packages",
			"#Q" : "quantityPerPackage",
			"#T" : "total",
		},
		ExpressionAttributeValues : 
		{
			":s" : {N : singles.toString()},
			":p" : {N : packages.toString()},
			":q" : {N : quantityPerPackage.toString()},
			":t" : {N : total.toString()},
		},
		UpdateExpression: "SET #S = :s, #P = :p, #Q = :q, #T = :t",
		ReturnValues: 'ALL_NEW',
	};

	return new Promise((resolve, reject) =>
	{
		dynamo.updateItem(params, (err, data) =>
		{
			if(err)
			{
				if(err.code === 'ConditionalCheckFailedException')
				{
					reject("404");
				}
				else
				{
					reject(err);
				}
			}
			else
			{
				resolve(data);
			}
		})		
	});

};

const deleteItem = (category, name) =>
{
	const params = {
		TableName : tableName,
		Key : {
			'category' : {'S' : category},
			'name' : {'S' : name}
		},
		ConditionExpression : 'attribute_exists(id)'
	};

	return new Promise((resolve, reject) => 
	{
		dynamo.deleteItem(params, (err, data) => {
			if(err){
				if(err.code === 'ConditionalCheckFailedException')
				{
					reject("404");
				}
				else
				{
					reject("500");
				}
				
			}
			else 
			{
				resolve("Success. Item deleted.");
			}
		});
	});
};


exports.getItems = getItems;
exports.getItem = getItem;
exports.getItemById = getItemById;
exports.insertItem = insertItem;
exports.updateItem = updateItem;
exports.deleteItem = deleteItem;