# Inventory management system

**Built using**:
- react 
- nodejs 
- express
- aws: 
	- dynamodb
	- ec2 


## Routes
- **get all items** : GET /api/items
- **get item by id** : GET /api/item/:id
	- ex) /api/item/2a7ed25f-176b-4355-a071-523f80d869c3
- **get item by category and name** : GET /api/item/:category/:name
	- ex) /api/item/fruit/strawberries
- **insert item by category and name and optionally singles, packages, quantityPerPackage** : 
	POST /api/item/:category/:id?singles=value&packages=value&quantityPerPackage=value
		- ex) /api/item/fruit/strawberries?singles=12&packages=2&quantitiyPerPackage=5
	- category and name are required to enter an item
	- singles, packages, and quantityPerPackage are optional and default to 0, if not specified.
- **delete item by category and name** : DELETE /api/item/:category/:name
	- ex) /api/item/fruit/strawberries
- **update item by category and name** PUT /api/item/category/name?singles=value&?name=value&?packages=value&?quantityPerPackage=value&?category=value
	- You need to specify at least one of the following *category, name, singles, packages quantityPerPackage* as a query string parameter
	- ex) /api/fruit/strawberries?singles=22&packages=12&name=strawberry
	- ex) /api/fruit/strawberries?singles=32
	- ex) /api/fruit/strawberries?singles=22&packages=12&name=carrot&category=vegetable&quantityPerPackage=12
