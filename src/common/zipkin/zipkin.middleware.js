const ZipkinContext = require('zipkin-context-cls');
const {Tracer} = require('zipkin');
const {recorder} = require('./zipkin.recorder');
const zipkinExpress = require('zipkin-instrumentation-express');



module.exports = {
	zipkinMiddleware: function(app){
		const ctxImpl = new ZipkinContext('zipkin');
		const nameOfService = 'API'
		const tracer = new Tracer({ctxImpl, recorder, nameOfService});
		const zipkinExpressMiddleware = zipkinExpress.expressMiddleware;
		app.use(zipkinExpressMiddleware({tracer}));	
	}
}