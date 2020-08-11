import Controller from './Controller';
import * as express from 'express';
import { setSorting } from '../../utils/sortingHelper';
import promotionModel from '../models/promotions.model';
import { Promotion } from '../interfaces/promotions.interface';

import AmazoneService from '../../services/AmazoneService';
import { getCurrentTime } from '../../utils/current-time-UTC';
import checkFiles from '../../validation/Files.validator';
import * as multer from 'multer';
import PromotionValidator from '../validator/promotions.validator';
const upload = multer();

export class PromotionsController extends Controller {
    public path = '/promotion';
    public promo = promotionModel;
    private storage = new AmazoneService();
    public valid = new PromotionValidator();

    constructor() {
        super()
        this.initializeRoutes();
    }
    private initializeRoutes() {
        this.router.get(`${this.path}`, super.validate(this.valid.pagination, 'query'), this.getList);
        this.router.delete(`${this.path}/:id`, super.checkAuth, super.checkRoles([this.roles.techadmin]), this.remove);
        this.router.post(`${this.path}`, super.checkAuth, super.checkRoles([this.roles.techadmin, this.roles.projectManager]), super.validate(this.valid.promotion), this.create);
        this.router.post(`${this.path}/:id`, super.checkAuth, upload.single('file'), checkFiles(), this.upload);
        this.router.patch(`${this.path}/:id`, super.checkAuth, super.checkRoles([this.roles.techadmin, this.roles.projectManager]), super.validate(this.valid.promotion), this.update);
        this.router.get(`${this.path}/:id`, this.overview);
    }

    private getList = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const { page = 1, limit = 20, sort, status } = request.query;
        const condition = setSorting(sort);

        let filter = {};
        if (status) {
            filter = { status: { $in: status } }
        }

        this.promo.paginate(filter, { page: +page || 1, limit: +limit || 20, sort: condition })
            .then(({ docs, total, limit, page, pages }) => {
                super.send200Data(response, { total, limit, page, pages }, docs.map(promo => this.parseFields(promo)))
            })
    };
    private create = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const promoData: Promotion = request.body;
        this.promo.findOne({ title: promoData.title })
            .then(promo => {
                if (promo && promo.title == promoData.title) {
                    next(
                        super.send422(
                            super.custom('title',
                                this.list.UNIQUE_INVALID,
                                [{ value: 'Title', }, { value: promoData.title }])
                        ))
                } else {
                    const promo = new this.promo(promoData);
                    promo.save()
                        .then(promotion => super.send201(response, this.parseFields(promotion))
                        )
                        .catch(err => {
                            next(super.send500(err))
                        })
                }
            })

    }

    private upload = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        this.storage.uploadFile(request.file)
            .then(s3 => {
                this.promo.findByIdAndUpdate(request.params.id, { $set: Object.assign({ image: s3['Location'] }, { updatedAt: getCurrentTime() }) }, { new: true })
                    .then(promo => super.send200(response, this.parseFields(promo)))
                    .catch(err => next(super.send500(response)))
            })
            .catch(err => next(super.send404('Promotion')))
    }

    private update = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const updatedData = Object.assign(request.body, { updatedAt: getCurrentTime() })
        this.promo.findByIdAndUpdate(request.params.id, { $set: updatedData }, { new: true })
            .then(promo => super.send200(response, this.parseFields(promo)))
            .catch(err => next(super.send404('Promotion')))
    }

    private remove = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        this.promo.findByIdAndDelete(request.params.id)
            .then(result => {
                result ? super.send204(response) : next(super.send404('Promotion'));
            })
            .catch(err => next(super.send404('Promotion')))
    }

    private overview = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const { id } = request.params
        this.promo.findById(id)
            .then(promo => super.send200(response, this.parseFields(promo)))
            .catch(err => next(super.send404('Promotion')))
    }

    private parseFields(promo: Promotion) {
        return {
            id: promo._id,
            title: promo.title,
            content: promo.content,
            image: promo.image,
            status: promo.status,
            startedAt: promo.startedAt,
            createdAt: promo.createdAt,
            updatedAt: promo.updatedAt
        }
    }
}