import * as Joi from "@hapi/joi";
import { SchemaMap } from "@hapi/joi";
import { ErrorMessage } from "../../validation/ErrorMessage";
import { BaseConfig } from "./validatorConfig/base.config";
import { RolesMap } from "../interfaces/roles.interface";
import { HttpException } from "../../exceptions/index";

export class BaseValidator extends ErrorMessage {
    public conf = new BaseConfig()
    public val = Joi;
    constructor() {
        super();

    }

    private joiArray = [
        { 'any.required': this.REQUIRED_INVALID },
        { 'string.empty': this.REQUIRED_INVALID },
        { 'string.min': this.STRING_TOO_SHORT },
        { 'string.max': this.STRING_TOO_LONG },
        { 'string.base': this.STRING_INVALID },
        { 'object.unknown': this.EXIST_INVALID },
        { 'any.only': this.EXIST_INVALID },
        { 'number.base': this.NUMBER_INVALID },
        { 'number.min': this.NUMBER_TOO_SMALL },
        { 'string.email': this.EMAIL_INVALID },
        { 'phone.invalid': this.PHONE_NUMBER_INVALID },
        { 'date.base': this.DATE_INVALID },
        { 'any.invalid': this.EXIST_INVALID },
    ];

    public schema(schema: SchemaMap) {
        return this.val.object(schema);
    }

    public findCode(type: string): number {
        try {
            return this.joiArray.find((item) => type in item)[type];
        } catch (error) {
            throw new HttpException(500, `"${type}" is not define yet!`);
        }
    }

    public phoneEqual = (value: string, helpers) => {
        if (new RegExp(this.conf.phoneRegexExp).test(value)) {
            return helpers.error("phone.invalid");
        }
    };

    public paginationSchema(options?: SchemaMap) {
        return this.schema(
            Object.assign({
                page: this.val.number().optional().label('Page')
                    .min(this.conf.minPaginationPage)
                    .default(this.conf.defaultPaginationPage),
                limit: this.val.number().optional().label('Limit')
                    .min(this.conf.minPaginationPage)
                    .default(this.conf.defaultPaginationPerPage)
            }, options),
        )
    }
    public checkRoles = (value: string, helpers?) => {
        if (!Object.values(RolesMap).find((role) => value === role)) {
          return helpers.error("any.invalid");
        }
      };

}