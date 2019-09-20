const Handlebars = require('handlebars');

function classify(name) {
    return name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}
function modelName(name) {
	name = classify(name);
	return name.charAt(0).toLowerCase()  + name.slice(1);
}

Handlebars.registerHelper('classify', classify);
Handlebars.registerHelper('modelName', modelName);

module.exports = function(source, data){
	var template = Handlebars.compile(source);
	return template(data);
}