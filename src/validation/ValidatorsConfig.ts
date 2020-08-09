import * as conf from "../rest/UserManagement/UserManagementConfig";
import UserManagementConfig from "../rest/UserManagement/UserManagementConfig.valid";

export class ValidatorsConfig {
  public getConfig() {
    return this.merge([new UserManagementConfig()]);
  }

  private merge(arrays: any) {
    let obj = {};
    arrays.forEach((config) => Object.assign(obj, config));
    return obj;
  }
}
