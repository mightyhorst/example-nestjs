import {
	IValidationRuleError,
	ValidationError
} from '@errors/index';

export function validateSiteCode(val):number{
	const isValid = /^\d{4}$/.test(val); 
	if(isValid){ 
		return parseInt(val);
	}
	else {
		throw new ValidationError(
			`${val} is not a 4 digit number`, 
			new IValidationRuleError('sitecode', 'param', val) 
		)
	}
}
