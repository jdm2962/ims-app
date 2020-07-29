const fs = require('fs');
const path = require('path');

// user sends request: 
	// www.example.com -> root / -> www.example.com/index.html
	// www.example.com/about -> /about -> look for file in specified folder where about + .html?
		// ** what about different file extensions but same file name?



// check if file exists
function getFileFromUrl(url){
	let filePath = 

}
let filedir = 'js/index.js';
fs.stat(filedir, (err, stats) => {
	if(err!== null && err.code == "ENOENT") console.log('404 Page not found...');
	else if(err) console.log('Error:', err);
	else if(stats){
		console.log(filedir, "exists");
	}
});


