export const ERRORS = {
    [this.EMAIL_INVALID]: '{attr} is not a valid email address.',
    [this.DATE_INVALID]: 'The format of {attr} is invalid.',
    [this.DATE_TOO_SMALL]: '{attr} must be no less than {min}.',
    [this.DATE_TOO_BIG]: '{attr} must be no greater than {max}.',
    [this.UNIQUE_INVALID]: '{attr} "{value}" has already been taken.',
};
export default class ErrorList {
    public BASIC_ERROR = 1000;

    public EMAIL_INVALID = 1010;
    public REQUIRED_INVALID = 1060;

    public DATE_INVALID = 1020;
    public DATE_TOO_SMALL = 1021;
    public DATE_TOO_BIG = 1022;

    public UNIQUE_INVALID = 1150;
    public CREDENTIALS_INVALID = 1200;

    public EXIST_INVALID = 1160;

    public ERRORS = {
        [this.UNIQUE_INVALID]: '{attr} "{value}" has already been taken.',
        [this.EMAIL_INVALID]: '{attr} is not a valid email address.',
        [this.DATE_INVALID]: 'The format of {attr} is invalid.',
        [this.DATE_TOO_SMALL]: '{attr} must be no less than {min}.',
        [this.DATE_TOO_BIG]: '{attr} must be no greater than {max}.',
        [this.CREDENTIALS_INVALID]: 'Incorrect email address and/or password',
        [this.EXIST_INVALID]: '{attr} is invalid.',
        [this.REQUIRED_INVALID]: '{attr} cannot be blank.'
    };
}