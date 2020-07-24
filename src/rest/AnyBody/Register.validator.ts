import * as Joi from '@hapi/joi';
import {
	usernameMinLength,
	usernameMaxLength,
	fullNameMinLength,
	fullNameMaxLength
} from '../../rest/UserManagement/UserManagement.validator';

export const registerSchema = Joi.object({
	username: Joi.string().label('Username').required().min(usernameMinLength).max(usernameMaxLength),
	fullName: Joi.string().required().label('Full Name').min(fullNameMinLength).max(fullNameMaxLength),
	email: Joi.string().required().label('Email'),
	password: Joi.string().required().label('Password'),
	confirmPassword: Joi.string().required().label('Confirm Password')
});

export const changePassword = Joi.object({
	currentPassword: Joi.string().required().label('Current Password'),
	newPassword: Joi.string().required().label('New Password'),
	confirmPassword: Joi.string().required().label('Confirm Password')
});
