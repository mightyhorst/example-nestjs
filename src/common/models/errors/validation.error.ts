import { ApiModelProperty } from '@nestjs/swagger';
import { HttpError, ErrorType } from './http.error';

export class IValidationRuleError{

	@ApiModelProperty({
		required: true,
		description: 'The invalid input field'
	})
	field: string;

	@ApiModelProperty({
		required: false,
		description: 'Where the input was in the request',
		enum: ['header', 'param', 'query', 'body']
	})
	packet: string;

	@ApiModelProperty({
		required: true,
		description: 'The original value of the input field'
	})
	value: any;

	@ApiModelProperty({
		required: true,
		description: 'The rule violated'
	})
	rule?: string;

	@ApiModelProperty({
		required: true,
		description: 'The description of the rule'
	})
	description?: string;

	constructor(
		field: string,
		packet: string = 'header',
		value: any,
		rule?: string,
		description?: string
	){
		this.field = field;
		this.packet = packet;
		this.value = value;
		if(rule) this.rule = rule;
		if(description) this.description = description;
	}
}



export class ValidationError extends HttpError{

	@ApiModelProperty({
		required: false,
		description: 'One validation or business rules violated'
	})
	validationError?: IValidationRuleError;

	@ApiModelProperty({
		required: false,
		description: 'A list of the validation and/or business rules violated'
	})
	validationErrors?: IValidationRuleError[];

	constructor(message:string, validationError?: IValidationRuleError, validationErrors?: IValidationRuleError[], req?: Request, code?:number){
		super(code || 422, ErrorType.Validation, message, req );
		
		if(validationError)
			this.validationError = validationError; 

		if(validationErrors)
			this.validationErrors = validationErrors; 

		this.description = '422 Validation error (request was invalid)';
		
	}

}