import * as express from "express";
import { UserHelper } from "../User/user.helper";
import authModel from "../AnyBody/authToken.model";
import { Authentication } from "../../interfaces/authentication.interface";
import { Registration } from "../../interfaces/registration.interface";
import { LoginHelper } from "../AnyBody/Login.action";
import EmailSenderService from "../../services/EmailSenderService";
import { AccessTokenHelper } from "../AnyBody/accessToken.helper";
import {NotFoundException} from "../../exceptions/NotFoundException";
import Controller from "./Controller";
import AnyBodyValidator from "../validator/any-body.validator";

export class AnyBodyController extends Controller {
  public path = "/auth";
  private userHelper = new LoginHelper();
  private helper = new UserHelper();
  private accessToken = new AccessTokenHelper();
  private customValidator = new AnyBodyValidator();
  private authToken = authModel;
  private mailer = new EmailSenderService();

  constructor() {
    super();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/login`, super.validate(this.customValidator.login), this.login);
    this.router.post(
      `${this.path}/register`,
      super.validate(this.customValidator.register),
      this.registering
    );
    this.router.get(`${this.path}/confirm/:token`, this.confirm);
    this.router.post(
      `${this.path}/resend-verify-email`,
      this.resendVerifyEmail
    );
  }

  private login = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const { username, password }: Authentication = request.body;
    let hash;
    const user = await this.helper.getUser({ username });
    if (user) {
      if (this.userHelper.isPasswordCorrect(password, user.passwordHash)) {
        const authToken = await this.authToken.findOne({ userId: user._id });
        if (authToken) {
          this.userHelper.isTokenExpired(authToken.expiredAt)
            ? (hash = this.userHelper.newToken(username, password))
            : (hash = authToken.token);
          this.userHelper.updateTokenTable(
            authToken._id,
            user._id,
            hash,
            response
          );
        } else {
          hash = this.userHelper.newToken(username, password);
          const token = new this.authToken({
            userId: user._id,
            token: hash,
            expiredAt: Math.round(Date.now() / 1000) + 8 * 3600,
          });

          token.save().then((tokenData) => {
            super.send200(response, {
              token: tokenData.token,
              expiredAt: tokenData.expiredAt,
            });
          });
        }
      } else {
        next(
          super.send422(
            super.custom('username', this.list.CREDENTIALS_INVALID)
          )
        );
      }
    } else {
      next(
        super.send422(
          super.custom('username', this.list.CREDENTIALS_INVALID)
        )
      );
    }
  };

  private registering = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const registerData: Registration = request.body;

    const emailExist = await this.helper.getUser({ email: registerData.email });
    const usernameExist = await this.helper.getUser({
      username: registerData.username,
    });

    if (registerData.password !== registerData.confirmPassword) {
      console.log(registerData.password !== registerData.confirmPassword);
      next(
        super.send422(
          super.custom('confirmPassword', this.list.COMPARE_EQUAL, [{ value: 'Confirm Password' }, { value: 'Password' }])
        )
      )
    } else if (emailExist) {
      next(
        super.send422(
          super.custom('email', this.list.UNIQUE_INVALID, [{ value: 'Email' }, { value: registerData.email }])
        )
      )


    } else if (usernameExist) {
      next(
        super.send422(
          super.custom('username', this.list.UNIQUE_INVALID, [{ value: 'Username' }, { value: registerData.username }])
        )
      );
    } else {
      this.helper
        .createUser(
          Object.assign(registerData, {
            passwordHash: this.helper.createPasswordHash(registerData.password),
          })
        )
        .then((user) =>
          this.accessToken
            .saveAccessToken(user)
            .then((tokenData) => {
              this.mailer
                .send(user.email, "Welcome to Dominos", "register.pug", {
                  title: "Welcome",
                  link: `https://dominos-app.herokuapp.com/auth/confirm/${tokenData.token}`,
                })
                .then((res) => console.log(res));
            })
            .then(() => {
              super.send201(response, this.helper.parseUserModel(user));
            })
        );
    }
  };
  private confirm = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const { token } = request.params;
    this.accessToken.checkAccessTokenValid(token).then((result) => {
      switch (result) {
        case null:
          return next(new NotFoundException("Token"));
        case false:
          return next(
            super.send422(
              super.custom('token', this.list.EXIST_INVALID, [{ value: 'Token' }])
            )
          );
        case true:
          return this.accessToken
            .confirmEmail(token)
            .then((res) => super.send201(response, null))
      }
    });
  };
  private resendVerifyEmail = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const { email } = request.body;
    this.accessToken
      .updateAccessToken(email)
      .then((result) => {
        this.mailer.send(email, "Welcome to Dominos", "register.pug", {
          title: "Welcome",
          link: `https://dominos-app.herokuapp.com/${result.token}`,
        });
        super.send204(response);
      })
      .catch((e) =>
        next(
          super.send422(
            super.custom('username', this.list.EMAIL_INVALID, [{ value: 'Email' }])
          )
        )
      );
  };
}
