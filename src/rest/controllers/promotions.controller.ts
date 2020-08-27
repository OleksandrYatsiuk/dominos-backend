import Controller from './Controller';
import * as express from 'express';
import { PromotionModel } from '../models/promotions.model';
import { Promotion } from '../interfaces/promotions.interface';

import AmazoneService from '../../services/AmazoneService';
import { getCurrentTime } from '../../utils/current-time-UTC';
import checkFiles from '../../validation/Files.validator';
import PromotionValidator from '../validator/promotions.validator';

export class PromotionsController extends Controller {
    public path = '/promotion';
    public helper = new PromotionModel();
    private storage = new AmazoneService();
    public valid = new PromotionValidator();

    constructor() {
        super()
        this.initializeRoutes();
    }
    private initializeRoutes() {
        this.router.get(`${this.path}`, super.validate(this.valid.pagination, 'query'), this.getList);
        this.router.post(`${this.path}`, super.checkAuth(), super.checkRoles([this.roles.techadmin, this.roles.projectManager]),
            this.multer.any(), super.validate(this.valid.promotion), checkFiles(), this.create);
        this.router.delete(`${this.path}/:id`, super.checkAuth(), super.checkRoles([this.roles.techadmin]), this.remove);
        this.router.patch(`${this.path}/:id`, super.checkAuth(),
            super.checkRoles([this.roles.techadmin, this.roles.projectManager]), this.multer.any(),
            super.validate(this.valid.promotion), this.update);
        this.router.get(`${this.path}/:id`, this.overview);
    }

    private getList = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const { page = 1, limit = 20, sort, status } = request.query;
        let filter = {};
        if (status) {
            filter = { status: { $in: status } }
        }

        this.helper.getListWithPagination(filter, page, limit, sort)
            .then(({ docs, total, limit, page, pages }) => {
                super.send200Data(response, { total, limit, page, pages }, docs.map(promo => this.helper.parseFields(promo)))
            })
    };
    private create = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const promoData: Promotion = request.body;
        this.helper.model.exists({ title: promoData.title })
            .then(result => {
                if (result) {
                    next(
                        super.send422(
                            super.custom('title',
                                this.list.UNIQUE_INVALID,
                                [{ value: 'Title', }, { value: promoData.title }])
                        ))
                } else {

                    if (request.files.length > 0) {
                        this.storage.uploadFile(request.files[0])
                            .then(s3 => {
                                promoData.image = s3['Location']
                                this.helper.model.create(promoData)
                                    .then(promotion => super.send201(response, this.helper.parseFields(promotion)))
                                    .catch(err => next(super.send500(err)))
                            })
                            .catch(e => next(this.send500(e)))
                    } else {
                        promoData.image = null;
                        this.helper.model.create(promoData)
                            .then(promotion => super.send201(response, this.helper.parseFields(promotion)))
                            .catch(err => next(super.send500(err)))
                    }
                }
            })
    }

    private update = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const promoData = Object.assign(request.body, { updatedAt: getCurrentTime() })
        this.helper.model.findById(request.params.id).then(promo => {
            if (request.files.length > 0) {
                this.storage.uploadFile(request.files[0])
                    .then(s3 => {
                        promoData.image = s3['Location']
                        this.helper.model.findByIdAndUpdate(request.params.id, { $set: promoData }, { new: true })
                            .then(promo => super.send200(response, this.helper.parseFields(promo)))
                            .catch(err => next(super.send500(err)))
                    })
                    .catch(e => next(this.send500(e)))
            } else {
                typeof promoData.image == 'string' ? promoData.image = null : false;
                this.helper.model.findByIdAndUpdate(request.params.id, { $set: promoData }, { new: true })
                    .then(promotion => super.send200(response, this.helper.parseFields(promotion)))
                    .catch(err => next(super.send500(err)))
            }
        })
            .catch(err => next(super.send404('Promotion')))
    }

    private remove = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        this.helper.remove(request.params.id)
            .then(result => result ? super.send204(response) : next(super.send404('Promotion')))
            .catch(err => next(super.send404('Promotion')))
    }

    private overview = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const { id } = request.params
        this.helper.model.findById(id)
            .then(promo => super.send200(response, this.helper.parseFields(promo)))
            .catch(err => next(super.send404('Promotion')))
    }
}