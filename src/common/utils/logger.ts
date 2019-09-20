import { Logger } from '@nestjs/common';

class MyLogger extends Logger {
	log(message: string, obj?:any) {
		var val;
		try{
			val = JSON.stringify(obj);
		}
		catch(err){}
		super.log('msg:'+ message);
		super.debug('val:'+ val);
	}
	error(message: string, trace: string) {
		super.error(message, trace);
	}
	warn(message: string, obj?:any) {
		super.warn(message);
	}
	debug(message: string, obj?:any) {
		super.debug(message);
	}
	verbose(message: string, obj?:any) {
		super.verbose(message);
	}
}
/**
* @todo singleton pattern is an anti pattern 
**/
export const logger = new MyLogger();
export const log = (msg, obj?:any) => logger.log(msg);
export const error = (msg, err) => logger.error(msg, err);
export const warn = (msg, obj?:any) => logger.warn(msg);
export const debug = (msg, obj?:any) => logger.debug(msg);
export const verbose = (msg, obj?:any) => logger.verbose(msg);