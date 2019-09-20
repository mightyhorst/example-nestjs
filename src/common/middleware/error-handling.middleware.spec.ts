import 'reflect-metadata';
// import { Test, TestingModule } from '@nestjs/testing';
import { errorHandling } from './index';
import { validateSiteCode } from '@utils/index';


/**
* Errors 
**/
import { 
	HttpError, 
	ErrorType, 
	ServerError, 
	ValidationError, 
	IntegrationError, 
	AuthError,
	ElasticSearchError
} from '@errors/index';

/**
* Responses 
**/
import { 
	AuthErrorResponseDto as AuthErrorRes,
	ValidationErrorResponseDto as ValidErrorRes,
	IntegrationErrorResponseDto as PlatErrorRes,
	ServerErrorResponseDto as ServerErrorRes,
	ErrorResponseDto as ErrRes
} from '@responses/index';


describe('Middleware', () => {
	describe('errorHandling', () => {

		it('string "123456" should throw Validation Error', () => {

			try{
				validateSiteCode("123456");
			}
			catch(err){

				/**
				* @step 1 - throw validation error 
				**/
				console.log('✅ err instanceof ValidationError:', err instanceof ValidationError);
				console.log('✅ err.message:', err.message);
				console.log('✅ err.code:', err.code);
				console.log('✅ err.validationError.field:', err.validationError.field);
				console.log('✅ err.validationError.packet:', err.validationError.packet);
				console.log('✅ err.validationError.value:', err.validationError.value);

				expect(err instanceof ValidationError).toBe(true);
				expect(err.message).toEqual(`123456 is not a 4 digit number`);
				expect(err.code).toEqual(422);
				expect(err.validationError.field).toEqual('sitecode');
				expect(err.validationError.packet).toEqual('param');
				expect(err.validationError.value).toEqual('123456'); 


				/**
				* @step 2 - pass to middelware 
				**/
				errorHandling(err)
					.then(errRes =>{
						
					})
					.catch(errRes =>{
						expect(errRes instanceof ValidErrorRes).toEqual(true);
						expect(errRes.type).toEqual(ErrorType.Validation);
						expect(errRes.message).toEqual('123456 is not a 4 digit number');
					})

			}

		});


		it('should catch Validation Error', async ()=>{

			const message = 'ValidationError';
			try{
				throw new ValidationError(message);
			}
			catch(err){

				try{
					await errorHandling(err);
				}
				catch(errRes){
					expect(errRes.success).toEqual(false);
					expect(errRes.error.code).toEqual(422);
					expect(errRes.type).toEqual(ErrorType.Validation);
					expect(errRes.error.message).toEqual(message);
					expect(errRes.error.description).toEqual('422 Validation error (request was invalid)');

				}

			}

		});
		it('should catch Authorization Error', async ()=>{

			const message = 'AuthError';

			try{
				throw new AuthError(message);
			}
			catch(err){

				try{
					await errorHandling(err);
				}
				catch(errRes){
					expect(errRes.error.code).toEqual(401);
					expect(errRes.type).toEqual(ErrorType.Authorization);
					expect(errRes.error.message).toEqual(message);
					expect(errRes.error.description).toEqual('Authorization or Authentication error');
				}

			}

		});
		it('should catch Integration Error', async ()=>{

			const message = 'IntegrationError';

			try{
				throw new IntegrationError(message);
			}
			catch(err){

				try{
					await errorHandling(err);
				}
				catch(errRes){
					expect(errRes.error.code).toEqual(504);
					expect(errRes.type).toEqual(ErrorType.Integration);
					expect(errRes.error.message).toEqual(message);
					expect(errRes.error.description).toEqual('504 Integration error (problem downstream with ElasticSearch or Identity Provider)');
				}

			}


		});
		it('ElasticSearchError should return an Integration Error', async ()=>{

			const message = 'ElasticSearchError';

			try{
				throw new ElasticSearchError(message);
			}
			catch(err){

				try{
					await errorHandling(err);
				}
				catch(errRes){
					expect(errRes.error.code).toEqual(504);
					expect(errRes.type).toEqual(ErrorType.Integration);
					expect(errRes.error.message).toEqual('ElasticSearch error - '+message);
					expect(errRes.error.description).toEqual('504 Integration error (problem downstream with ElasticSearch or Identity Provider)');
				}
			}


		});
		it('should catch Server Error', async ()=>{

			const message = 'ServerError';

			try{
				throw new ServerError(message);
			}
			catch(err){

				try{
					await errorHandling(err);
				}
				catch(errRes){
					expect(errRes.error.code).toEqual(500);
					expect(errRes.type).toEqual(ErrorType.Server);
					expect(errRes.error.message).toEqual(message);
					expect(errRes.error.description).toEqual('500 Server error (runtime error to be fixed by developer)');
				}

			}


		});

		it('should throw Server Error as for HttpError', async ()=>{

			const code = 400;
			const type = ErrorType.Server;
			const message = 'HttpError';

			try{
				throw new HttpError(code, type, message);
			}
			catch(err){

				try{
					await errorHandling(err);
				}
				catch(errRes){
					expect(errRes.error.code).toEqual(code);
					expect(errRes.type).toEqual(ErrorType.Server);
					expect(errRes.error.message).toEqual(message);
					expect(errRes.error.description).toEqual('HTTP Custom Error');
					// expect(errRes.description).toEqual('500 Server error (runtime error to be fixed by developer)');
				}

			}

		});

		it('a normal error should throw Server Error as a default', async ()=>{

			const message = 'This is an error';
			try{
				throw new Error(message);
			}
			catch(err){

				try{
					await errorHandling(err);
				}
				catch(errRes){
					
					console.log(`🍏 errRes.error.message: `, errRes.error.message);

					expect(errRes.error.code).toEqual(undefined);
					expect(errRes.type).toEqual(undefined);
					expect(errRes.error.message).toEqual(message);
					expect(errRes.description).toEqual(undefined);
					// expect(errRes.error.description).toEqual('500 Server error (runtime error to be fixed by developer)');
				}

			}

		});

		
	});

});

