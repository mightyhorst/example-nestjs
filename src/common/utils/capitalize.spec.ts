import 'reflect-metadata';
// import { Test, TestingModule } from '@nestjs/testing';
import { capitalize } from './capitalize';


describe('Utils', () => {
	describe('capitalize', () => {

		it('should be capitalized', () => {
			expect(capitalize('it should be capitalized')).toEqual('It Should Be Capitalized');
		});
		
		it('check again', () => {			
			expect(capitalize('check again')).toEqual('Check Again');
		});
	});
});

