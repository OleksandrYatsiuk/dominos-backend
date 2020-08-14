
export default class ErrorList {
	public BASIC_ERROR = 1000;

	public EMAIL_INVALID = 1010;
	public EMAIL_VERIFIED = 1005;
	public REQUIRED_INVALID = 1060;

	public DATE_INVALID = 1020;
	public DATE_TOO_SMALL = 1021;
	public DATE_TOO_BIG = 1022;

	public UNIQUE_INVALID = 1150;
	public CREDENTIALS_INVALID = 1200;

	public NUMBER_INVALID = 1050;
	public NUMBER_INTEGER_ONLY = 1051;
	public NUMBER_TOO_SMALL = 1052;
	public NUMBER_TOO_BIG = 1053;

	public STRING_INVALID = 1080;
	public STRING_TOO_SHORT = 1081;
	public STRING_TOO_LONG = 1082;
	public STRING_NOT_EQUAL = 1083;

	public EXIST_INVALID = 1160;

	public COMPARE_EQUAL = 1110;

	public PHONE_NUMBER_INVALID = 1120;

	public PASSWORD_WRONG = 1130;

	public ERRORS = {
		[this.REQUIRED_INVALID]: '{attr} cannot be blank.',

		[this.UNIQUE_INVALID]: '"{attr}" "{value}" has already been taken.',
		[this.EMAIL_INVALID]: 'Email "{attr}" is not a valid email address.',
		[this.EMAIL_VERIFIED]: 'Email "{attr}" is verified.',
		[this.DATE_INVALID]: 'The format of "{attr}" is invalid.',
		[this.DATE_TOO_SMALL]: '"{attr}" must be no less than {min}.',
		[this.DATE_TOO_BIG]: '"{attr}" must be no greater than {max}.',
		[this.CREDENTIALS_INVALID]: 'Incorrect email address and/or password',
		[this.EXIST_INVALID]: '"{attr}" is invalid.',

		[this.NUMBER_INVALID]: '"{attr}" must be a number.',
		[this.NUMBER_INTEGER_ONLY]: '"{attr}" must be an integer.',
		[this.NUMBER_TOO_SMALL]: '"{attr}" must be no less than {min}.',
		[this.NUMBER_TOO_BIG]: '"{attr}" must be no greater than {max}.',

		[this.STRING_INVALID]: '"{attr}" must be a string.',
		[this.STRING_TOO_SHORT]: '"{attr}" should contain at least {min} character(s).',
		[this.STRING_TOO_LONG]: '"{attr}" should contain at most {max} character(s).',
		[this.STRING_NOT_EQUAL]: '"{attr}" should contain {length} character(s).',
		[this.COMPARE_EQUAL]: '"{attr}" must be equal to "{compareValueOrAttr}".',
		[this.PHONE_NUMBER_INVALID]: '"{value}" is not a valid phone number.',
		[this.PASSWORD_WRONG]: 'Password should contain at least 8 symbols, one upper case, one lowercase and one number and one special symbol.'
	};
}
