import { UserConfig } from "./validatorConfig/index";
import { BaseValidator } from "./base.validator";

export class UserManagementValidator extends BaseValidator {
  public config = new UserConfig();
  constructor() {
    super();
  }

  public update = this.schema({
    username: this.val.string()
      .optional()
      .empty()
      .label("Username")
      .min(this.config.usernameMinLength)
      .max(this.config.usernameMaxLength),
    fullName: this.val.string()
      .optional()
      .empty()
      .label("Full Name")
      .min(this.config.fullNameMinLength)
      .max(this.config.fullNameMaxLength),
    email: this.val.string().optional().empty().label("Email").email(),
    birthday: this.val.string().optional().empty().allow("").label("Birthday").isoDate(),
    phone: this.val.string()
      .optional()
      .empty()
      .allow("")
      .custom(this.phoneEqual)
      .label("Phone"),
  });

  public updateLocation = this.val.object({
    lat: this.val.number().required().empty().label("Latitude"),
    lng: this.val.number().required().empty().label("Longitude"),
  });



  public updateRole = this.val.object({
    role: this.val.string()
      .required()
      .empty()
      .label("Role")
      .custom(this.checkRoles),
  });
}
