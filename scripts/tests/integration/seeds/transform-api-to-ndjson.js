const fs = require('fs');
const axios = require('axios');

const FROM_API = true;
const INDEX = 'ict_plus_fib_hourly_history'; //ict_plus_device_data
const API = `http://vpc-ictplustest-ci4hdrpuv4gyepev3khzfo7eoa.ap-southeast-2.es.amazonaws.com/${INDEX}/_search`;
const FILE = 'fiblog.ndjson';


class TransformCtrl{

	constructor(FROM_API, API, FILE){
		this.FROM_API = FROM_API
		this.API = API
		this.FILE = FILE
	}

	transform(rows){

		let fileContents = rows.map(row => {
			return {
				create: `{ "create" : { "_index" : "${INDEX}", "_type" : "_doc", "_id" : "${row._id ? row._id : row.device_name}" } }`,
				data: JSON.stringify(this.FROM_API ? row._source : row)
			}
		})
		.reduce((contents, item) => {
			if(!contents) contents = "";
			contents += item.create;
			contents += "\n";
			contents += item.data
			contents += "\n";
			return contents;
		})

		console.log('fileContents --->', fileContents);
		fs.writeFileSync(__dirname + '/' + this.FILE, fileContents, 'utf8');
	}


	run(){
		if(this.FROM_API){
			axios.get(this.API)
			.then(response => {
				this.transform(response.data.hits.hits);
			}).
			catch(err => {
				console.log('FAILED: ', err);
			});
		}
		else{
			const json = JSON.parse(fs.readFileSync(this.FILE, 'utf8'));
			this.transform(json);
		}
	}

}
const ctrl = new TransformCtrl(FROM_API, API, FILE);
	  ctrl.run();
