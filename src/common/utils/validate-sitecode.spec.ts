import 'reflect-metadata';
// import { Test, TestingModule } from '@nestjs/testing';
import { validateSiteCode } from './validate-sitecode';

import {
	IValidationRuleError,
	ValidationError
} from '@errors/index';


describe('Utils', () => {
	describe('validateSiteCode', () => {

		it('string "1234" should be valid and return an integer', () => {
			expect(validateSiteCode("1234")).toEqual(1234);
		});
		it('number 1234 should be valid and return an integer', () => {
			expect(validateSiteCode(1234)).toEqual(1234);
		});
		
		it('string "12345" should throw TypeError', () => {			
			
			expect(()=>{
				validateSiteCode('12345');
			}).toThrow(ValidationError);

			
			try{
				validateSiteCode('12345');
			}
			catch(err){
				
				console.log('✅ err instanceof ValidationError: ', err instanceof ValidationError);
				console.log('✅ err.message: ', err.message);
				console.log('✅ err.code: ', err.code);
				
				expect(err instanceof ValidationError).toBe(true);
				expect(err.message).toEqual(`12345 is not a 4 digit number`);
				expect(err.code).toEqual(422);
			}

			
		});

		it('number 12345 should throw TypeError', () => {			
			
			expect(()=>{
				validateSiteCode('12345');
			}).toThrow(ValidationError);

			
			try{
				validateSiteCode('12345');
			}
			catch(err){
				
				console.log('✅ err instanceof ValidationError:', err instanceof ValidationError);
				console.log('✅ err.message:', err.message);
				console.log('✅ err.code:', err.code);
				console.log('✅ err.validationError.field:', err.validationError.field);
				console.log('✅ err.validationError.packet:', err.validationError.packet);
				console.log('✅ err.validationError.value:', err.validationError.value);

				expect(err instanceof ValidationError).toBe(true);
				expect(err.message).toEqual(`12345 is not a 4 digit number`);
				expect(err.code).toEqual(422);
				expect(err.validationError.field).toEqual('sitecode');
				expect(err.validationError.packet).toEqual('param');
				expect(err.validationError.value).toEqual('12345');
			}

		});

		it('string "123" should throw TypeError', () => {			
			
			expect(()=>{
				validateSiteCode('123');
			}).toThrow(ValidationError);

			
			try{
				validateSiteCode('123');
			}
			catch(err){
				
				console.log('✅ err instanceof ValidationError:', err instanceof ValidationError);
				console.log('✅ err.message:', err.message);
				console.log('✅ err.code:', err.code);
				console.log('✅ err.validationError.field:', err.validationError.field);
				console.log('✅ err.validationError.packet:', err.validationError.packet);
				console.log('✅ err.validationError.value:', err.validationError.value);

				expect(err instanceof ValidationError).toBe(true);
				expect(err.message).toEqual(`123 is not a 4 digit number`);
				expect(err.code).toEqual(422);
				expect(err.validationError.field).toEqual('sitecode');
				expect(err.validationError.packet).toEqual('param');
				expect(err.validationError.value).toEqual('123');
			}

		});

		it('number 123 should throw TypeError', () => {			
			
			expect(()=>{
				validateSiteCode('123');
			}).toThrow(ValidationError);

			
			try{
				validateSiteCode('123');
			}
			catch(err){
				
				console.log('✅ err instanceof ValidationError:', err instanceof ValidationError);
				console.log('✅ err.message:', err.message);
				console.log('✅ err.code:', err.code);
				console.log('✅ err.validationError.field:', err.validationError.field);
				console.log('✅ err.validationError.packet:', err.validationError.packet);
				console.log('✅ err.validationError.value:', err.validationError.value);

				expect(err instanceof ValidationError).toBe(true);
				expect(err.message).toEqual(`123 is not a 4 digit number`);
				expect(err.code).toEqual(422);
				expect(err.validationError.field).toEqual('sitecode');
				expect(err.validationError.packet).toEqual('param');
				expect(err.validationError.value).toEqual('123');
			}

		});
	});
});

