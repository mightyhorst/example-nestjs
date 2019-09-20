import { Test, TestingModule } from '@nestjs/testing';
import {log} from './index';

describe('LoggerService ', ()=>{

	it('#log should log', ()=>{
		log.log('log');
	})
	it('#error should log error', ()=>{
		log.error('error', new Error('error trace'));
	})
	it('#warn should log warning', ()=>{
		log.warn('warn');	
	})
	it('#debug should log debug', ()=>{
		log.debug('debug');
	})
	it('#verbose should log verbose', ()=>{
		log.verbose('verbose');
	})

})