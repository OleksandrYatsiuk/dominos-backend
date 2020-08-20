import * as express from "express";
import { Authentication } from "../../interfaces/authentication.interface";
import { Registration } from "../../interfaces/registration.interface";
import EmailSenderService from "../../services/EmailSenderService";
import Controller from "./Controller";
import AnyBodyValidator from "../validator/any-body.validator";
import { AccessTokenModel } from "../models/accessToken.model";
import { UserModel } from "../models/user.model";
import { AuthTokenModel } from "../models/authToken.model";

export class AnyBodyController extends Controller {
  public path = "/auth";
  private helper = new UserModel();
  private accessToken = new AccessTokenModel();
  private customValidator = new AnyBodyValidator();
  private mailer = new EmailSenderService();

  constructor() {
    super();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/login`, super.validate(this.customValidator.login), this.login);
    this.router.post(`${this.path}/register`, super.validate(this.customValidator.register), this.registering);
    this.router.get(`${this.path}/confirm/:token`, this.confirm);
    this.router.post(`${this.path}/resend-verify-email`, this.resendVerifyEmail);
  }

  private login = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const { username, password }: Authentication = request.body;
    this.helper.getUser({ username }).then(user => {
      if (user) {
        this.helper.isPassValid(user, password).then(valid => {
          if (valid) {
            this.accessToken.create(user._id)
              .then(({ token, expiredAt }) => super.send201(response, { token, expiredAt }))
          } else {
            next(
              super.send422(
                super.custom('username', this.list.CREDENTIALS_INVALID)
              )
            );
          }
        })
      } else {
        next(
          super.send422(
            super.custom('username', this.list.CREDENTIALS_INVALID)
          )
        );
      }
    })
  };

  private registering = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const data: Registration = request.body;
    const emailExist = await this.helper.getUser({ email: data.email });
    const usernameExist = await this.helper.getUser({ username: data.username });

    if (data.password !== data.confirmPassword) {
      next(
        super.send422(
          super.custom('confirmPassword', this.list.COMPARE_EQUAL, [{ value: 'Confirm Password' }, { value: 'Password' }])
        )
      )
    } else if (emailExist) {
      next(
        super.send422(
          super.custom('email', this.list.UNIQUE_INVALID, [{ value: 'Email' }, { value: data.email }])
        )
      )
    } else if (usernameExist) {
      next(
        super.send422(
          super.custom('username', this.list.UNIQUE_INVALID, [{ value: 'Username' }, { value: data.username }])
        )
      );
    } else {
      this.helper.model.create(Object.assign({
        passwordHash: this.helper.createPasswordHash(data.password)
      }, data))
        .then((user) => {
          this.accessToken
            .create(user._id)
            .then((tokenData) => {
              this.mailer.send(user.email, "Welcome to Dominos", "register.pug", {
                title: "Welcome",
                link: `${process.env.FRONTEND_URL}auth/confirm/${tokenData.token}`,
              })
            })
            .then(() => {
              super.send201(response, this.helper.parseModel(user));
            })
        });
    }
  };
  private confirm = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const { token } = request.params;
    this.accessToken.checkAccessTokenValid(token).then((result) => {
      switch (result) {
        case null:
          return next(super.send404('Token'));
        case false:
          return next(
            super.send422(
              super.custom('token', this.list.EXIST_INVALID, [{ value: 'Token' }])
            )
          );
        case true:
          return this.accessToken.confirmEmail(token)
            .then((res) => super.send200(response))
      }
    });
  };
  private resendVerifyEmail = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const { email } = request.body;
    this.helper.getUser({ email }).then(user => {
      if (user) {
        this.accessToken.exists({ userId: user._id }).then(exist => {
          if (exist) {
            this.accessToken
              .updateAccessToken(email)
              .then((result) => {
                this.mailer.send(email, "Welcome to Dominos", "register.pug", {
                  title: "Welcome",
                  link: `${process.env.FRONTEND_URL}auth/confirm/${result.token}`,
                })
                  .then(res => super.send204(response))
                  .catch(e => next(super.send500(e)));
              })
          } else {
            next(super.send422(
              super.custom('email', this.list.EMAIL_VERIFIED, [{ value: email }])
            ))
          }
        })
      } else {
        next(super.send422(
          super.custom('email', this.list.EMAIL_INVALID, [{ value: email }])
        ))
      }
    })


  };
}
