const fs = require('fs');

const appModule = __dirname+'/../../../src/app.module.ts';

var i = 0; 

const lines = fs
	.readFileSync(appModule, 'utf-8')
	.split(/\r?\n/)
	.map(function(line){ 
		return {
			id: ++i,
			line: line 
		}
	});


let lastImport = lines.reduce((lastImport, model) => {
	return (model.line.split('import ').length > 1 ? model : lastImport);
})

let imports = lines.reduce((lastImport, model) => {
	return (model.line.split('imports: [').length > 1 ? model : lastImport);
})

function insert(filePath, txtToInsert, lineNumber){

	return new Promise((done, fail)=>{

		var data = fs.readFileSync(filePath)
			.toString()
			.split("\n");

		data.splice(lineNumber, 0, txtToInsert);

		var contents = data.join("\n");

		fs.writeFile(filePath, contents, function (err) {
			if (err) {
				fail(err);
			}
			else{
				done();
			}
		});

	})
	

}


function replace(filePath, txtToReplace, lineNumber){

	return new Promise((done, fail)=>{
		var data = fs.readFileSync(filePath)
			.toString()
			.split("\n");

		data[lineNumber] = txtToReplace;

		var contents = data.join("\n");

		fs.writeFile(filePath, contents, function (err) {
			if (err) {
				fail(err);
			}
			else{
				done();
			}
		});
	});
}


async function updateAppModule(className, filePath){

	await insert(appModule, `import { ${className} } from '@components/${filePath.replace('./', '/')}';`, lastImport.id)
	await replace(appModule, imports.line.replace('],', `, ${className}],`), imports.id);	
}
module.exports = updateAppModule;



