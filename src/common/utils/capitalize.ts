import {ServerError} from '@errors/index';

export function capitalize(str) {

	if(typeof(str) !== 'string') throw new ServerError(`${str} not a string`);

   	var splitStr = str.toLowerCase().split(' ');
   	for (var i = 0; i < splitStr.length; i++) {
       splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
   	}
   	return splitStr.join(' '); 
}