const inquirer = require('inquirer');
const compile = require('./src/compile');
const fs = require('fs');
const chalk = require('chalk');
const updateAppModule = require('./src/update.app.module');





/**
*
* Generator 
*
**/
const generate = {
	module: function(answers) {
		let moduleTemplate 	= fs.readFileSync(__dirname+'/templates/module.hbs', 'utf8');
		let moduleCode 		= compile(moduleTemplate, answers);
		return moduleCode;
	},
	ctrl: function(answers) {
		let template 	= fs.readFileSync(__dirname+'/templates/ctrl.hbs', 'utf8');
		let code 		= compile(template, answers);
		return code;
	},
	ctrlTest: function(answers) {
		let template 	= fs.readFileSync(__dirname+'/templates/ctrl.test.hbs', 'utf8');
		let code 		= compile(template, answers);
		return code;
	},
	service: function(answers) {
		let template 	= fs.readFileSync(__dirname+'/templates/service.hbs', 'utf8');
		let code 		= compile(template, answers);
		return code;
	},
	serviceTest: function(answers) {
		let template 	= fs.readFileSync(__dirname+'/templates/service.test.hbs', 'utf8');
		let code 		= compile(template, answers);
		return code;
	},
	dto: {
		req: function(answers) {
			let template 	= fs.readFileSync(__dirname+'/templates/dto.req.hbs', 'utf8');
			let code 		= compile(template, answers);
			return code;
		},
		res: function(answers) {
			let template 	= fs.readFileSync(__dirname+'/templates/dto.res.hbs', 'utf8');
			let code 		= compile(template, answers);
			return code;
		},
		resError: function(answers) {
			let template 	= fs.readFileSync(__dirname+'/templates/dto.error.res.hbs', 'utf8');
			let code 		= compile(template, answers);
			return code;
		},
		resChart: function(answers) {
			let template 	= fs.readFileSync(__dirname+'/templates/dto.chart.res.hbs', 'utf8');
			let code 		= compile(template, answers);
			return code;
		},
		resIndex: function(answers) {
			let template 	= fs.readFileSync(__dirname+'/templates/dto.index.hbs', 'utf8');
			let code 		= compile(template, answers);
			return code;
		}
	}
}





/**
*
* Logs
*
**/
const log = {
	red: function(txt){
		console.log(chalk.red(txt));
	},
	green: function(txt){
		console.log(chalk.green(txt));
	},
	blue: function(txt){
		console.log(chalk.blue(txt));
	},
	magenta: function(txt){
		console.log(chalk.magenta(txt));	
	}
}



/**
*
* Write folders and Files  
*
**/
const FOLDER = __dirname+'/../../src/components/';
const write = {
	folder: function(name){
		if (!fs.existsSync(FOLDER+name)){
		    fs.mkdirSync(FOLDER+name);
		    log.green('Created folder /src/'+name);
		    return true;
		}
		else{
			log.red('Folder already exists: '+name);
			return false;
		}
	},
	file: function(folder, name, contents){
		fs.writeFileSync(FOLDER+folder+'/'+name, contents)
		log.blue('Created file /src/'+folder+'/'+name);
	},
	module: function(name, code) {
		
		// -- 1. Module folder 
		if( write.folder(name) ){

			// -- 2. Module file 
			write.file(name, `${name}.module.ts`, code);

			// -- 3. ctrl, dto and service folder 
			write.folder(name+'/ctrl');
			write.folder(name+'/service');
			write.folder(name+'/dto');

			// -- 4. ctrl file


			// -- 5. service file


			// -- 6. request + response file 

			return {
				className: name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')+'Module',
				filePath: `./${name}/${name}.module`
			}
		}

	},
	ctrl: function(name, code) {
		write.file(name+'/ctrl', `${name}.ctrl.ts`, code);
	},
	ctrlTest: function(name, code) {
		write.file(name+'/ctrl', `${name}.ctrl.spec.ts`, code);
	},
	service: function(name, code) {
		write.file(name+'/service', `${name}.service.ts`, code);
	},
	serviceTest: function(name, code) {
		write.file(name+'/service', `${name}.service.spec.ts`, code);
	},
	dto: {
		req: function(name, code) {
			write.file(name+'/dto', `${name}.request.dto.ts`, code);
		},
		res: function(name, code) {
			write.file(name+'/dto', `${name}.response.dto.ts`, code);
		},
		resError: function(name, code) {
			write.file(name+'/dto', `${name}.error.response.dto.ts`, code);
		},
		resChart: function(name, code) {
			write.file(name+'/dto', `${name}-chart.response.dto.ts`, code);
		},
		resIndex: function(name, code) {
			write.file(name+'/dto', `index.ts`, code);
		}
	}
}

/**
*
* Questions 
*
**/
const question = {
	input: function(key, msg, defaultVal){
		return {
		    type: 'input',
		    name: key,
		    message: msg,
		    default: defaultVal || false
		}	
	}
}
const questions = [
	question.input(
		'txtModuleName', 
		'What is the module name?',
		'device-list'
	),
	question.input(
		'txtChartType', 
		'Is it a bar or pie chart?',
		'bar'
	),
	question.input(
		'txtAgg', 
		'Aggregation name?',
		'form_factor_'
	),
	question.input(
		'txtEsIndex', 
		'Elastic search Index?',
		'ict_plus_device_data'
	),
	
]





/**
*
* Menu 
*
**/
inquirer
	.prompt(questions)
	.then(answers => {
		/**
		|
		| 	answers
		|		.txtModuleName
		|
		|*/

		/**
		* Module code + folders 
		*/
		let moduleCode = generate.module(answers);
		let module = write.module(answers.txtModuleName, moduleCode);

		/**
		* Ctrl code 
		*/
		let ctrlCode = generate.ctrl(answers);
		write.ctrl(answers.txtModuleName, ctrlCode);

		let ctrlTest = generate.ctrlTest(answers);
		write.ctrlTest(answers.txtModuleName, ctrlTest);

		/**
		* Service code 
		*/
		let serviceCode = generate.service(answers);
		write.service(answers.txtModuleName, serviceCode);

		let serviceTest = generate.serviceTest(answers);
		write.serviceTest(answers.txtModuleName, serviceTest);

		/**
		* Req code 
		*/
		let requestCode = generate.dto.req(answers);
		//@todo - not needed -- write.dto.req(answers.txtModuleName, requestCode);

		/**
		* Res code 
		*/
		let responseCode = generate.dto.res(answers);
		write.dto.res(answers.txtModuleName, responseCode);

		/**
		* Res Barrel file
		*/
		let resIndexCode = generate.dto.resIndex(answers);
		write.dto.resIndex(answers.txtModuleName, resIndexCode);

		/**
		* Res code 
		*/
		let resChartCode = generate.dto.resChart(answers);
		write.dto.resChart(answers.txtModuleName, resChartCode);

		/**
		* Error Res code 
		*/
		let resErrorCode = generate.dto.resError(answers);
		write.dto.resError(answers.txtModuleName, resErrorCode);

		/**
		* Update app module file 
		**/
		updateAppModule(module.className, module.filePath);
		log.magenta('UPDATED app.module to include new module: '+module.className);

	});


