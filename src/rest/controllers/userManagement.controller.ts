import * as express from "express";
import Controller from "./Controller";
import { pagination } from "../../validation/Pagination.validator";
import { UserManagementValidator } from "../validator/user-management.validator";
import { UserModel } from "../models/user.model";

export class UserManagementController extends Controller {
  public path = "/user-management";
  private helper = new UserModel();
  private customValidator = new UserManagementValidator();

  constructor() {
    super();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, super.checkAuth(), super.checkRoles([this.roles.techadmin, this.roles.projectManager]),
      super.validate(pagination, "query"),
      this.getList
    );
    this.router.delete(`${this.path}/:id`, super.checkAuth(),
      super.checkRoles([this.roles.techadmin]),
      this.remove
    );
    this.router.put(`${this.path}/:id/role`, super.checkAuth(), super.checkRoles([this.roles.techadmin]),
      super.validate(this.customValidator.updateRole),
      this.updateRole
    );
  }

  private getList = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const { page, limit, sort } = request.query;
    this.helper.getListWithPagination(page, limit, sort).then(({ docs, total, limit, page, pages }) => {
      super.send200Data(response, { total, limit, page, pages }, docs.map((item) => this.helper.parseModel(item)
      ))
    });
  };

  private remove = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    this.helper.remove(request.params.id)
      .then((result) => result ? super.send204(response) : next(super.send404("User")))
      .catch(err => next(super.send404("User")));
  };

  private updateRole = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const { role } = request.body;
    this.helper
      .updateUserItem(request.params.id, { role })
      .then((user) => super.send200(response, null))
      .catch((err) => next(super.send404("User")));
  };
}
