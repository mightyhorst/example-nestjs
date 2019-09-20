module.exports = {
    setJSONBody: setJSONBody,
    logHeaders: logHeaders
}

function setJSONBody(requestParams, context, ee, next) {
    console.log('context --> ', context);
    return next(); 
}

function logHeaders(requestParams, response, context, ee, next) {
    console.log('headers --> ', response.headers);
    return next(); 
}