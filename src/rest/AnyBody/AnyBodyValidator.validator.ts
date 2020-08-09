import * as Joi from "@hapi/joi";
import * as UserManagementConfig from "../UserManagement/UserManagementConfig";

export default class AnyBodyValidator {
  constructor() {}

  public config = UserManagementConfig;
  public registerSchema = Joi.object({
    username: Joi.string()
      .label("Username")
      .required()
      .min(this.config.usernameMinLength)
      .max(this.config.usernameMaxLength),
    fullName: Joi.string()
      .required()
      .label("Full Name")
      .min(this.config.fullNameMinLength)
      .max(this.config.fullNameMaxLength),
    email: Joi.string().required().label("Email"),
    password: Joi.string().required().label("Password"),
    confirmPassword: Joi.string().required().label("Confirm Password"),
  });

  public changePassword = Joi.object({
    currentPassword: Joi.string().required().label("Current Password"),
    newPassword: Joi.string().required().label("New Password"),
    confirmPassword: Joi.string().required().label("Confirm Password"),
  });
}
