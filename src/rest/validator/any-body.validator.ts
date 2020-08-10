import { BaseValidator } from "./base.validator";
import { UserConfig } from "./validatorConfig";

export default class AnyBodyValidator extends BaseValidator {
  public config = new UserConfig();
  constructor() {
    super()
  }


  private username = this.val.string()
    .label("Username")
    .required()
    .min(this.config.usernameMinLength)
    .max(this.config.usernameMaxLength)

  private fullName = this.val.string()
    .required()
    .label("Full Name")
    .min(this.config.fullNameMinLength)
    .max(this.config.fullNameMaxLength)

  private email = this.val.string().required().label("Email")
  private password = this.val.string().required().label("Password")
  private confirmPassword = this.val.string().required().label("Confirm Password")
  private currentPassword = this.val.string().required().label("Current Password")
  private newPassword = this.val.string().required().label("Current Password")


  public login = this.schema({
    username: this.username,
    password: this.password
  });

  public register = this.schema({
    username: this.username,
    fullName: this.fullName,
    email: this.email,
    password: this.password,
    confirmPassword: this.confirmPassword
  });

  public changePassword = this.schema({
    currentPassword: this.currentPassword,
    newPassword: this.newPassword,
    confirmPassword: this.confirmPassword
  });


}
