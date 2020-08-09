import * as Joi from "@hapi/joi";
import { Roles } from "../../interfaces/roles.interface";
import * as config from "./UserManagementConfig";
import UserManagementConfig from "./UserManagementConfig.valid";

export default class UserManagementValidator {
  private conf = new UserManagementConfig();

  public phoneEqual = (value, helpers) => {
    if (value.toString().length != 12) {
      return helpers.error("number.invalid");
    }
  };

  public update = Joi.object({
    username: Joi.string()
      .optional()
      .empty()
      .label("Username")
      .min(this.conf.usernameMinLength)
      .max(this.conf.usernameMaxLength),
    fullName: Joi.string()
      .optional()
      .empty()
      .label("Full Name")
      .min(this.conf.fullNameMinLength)
      .max(this.conf.fullNameMaxLength),
    email: Joi.string().optional().empty().label("Email").email(),
    birthday: Joi.string().optional().empty().label("Birthday").isoDate(),
    phone: Joi.number()
      .optional()
      .empty()
      .custom(this.phoneEqual, "phone count")
      .label("Phone"),
  });

  public updateLocation = Joi.object({
    lat: Joi.number().required().empty().label("Latitude"),
    lng: Joi.number().required().empty().label("Longitude"),
  });

  public checkRoles = (value: string, helpers) => {
    if (!Object.values(Roles).find((role) => value === role)) {
      return helpers.error("any.invalid");
    }
  };

  updateRole = Joi.object({
    role: Joi.string()
      .required()
      .empty()
      .label("Role")
      .custom(this.checkRoles, "role validation"),
  });
}
