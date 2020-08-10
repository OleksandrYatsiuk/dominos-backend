import Controller from './Controller';
import * as express from 'express';
import { setSorting } from '../../utils/sortingHelper';
import { code200DataProvider, code201, code500, code200, code404, code204 } from '../../middleware/base.response';
import promotionModel from '../models/promotions.model';
import validate from '../../middleware/validation.middleware';
import { Promotion } from '../interfaces/promotions.interface';
import UnprocessableEntityException from '../../exceptions/UnprocessableEntityException';
import checkAuth from '../../middleware/auth.middleware';
import checkRoles from '../../middleware/roles.middleware';

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
        this.router.get(`${this.path}`, validate(this.valid.pagination, 'query'), this.getList);
        this.router.delete(`${this.path}/:id`, checkAuth, checkRoles([this.roles.techadmin]), this.remove);
        this.router.post(`${this.path}`, checkAuth, checkRoles([this.roles.techadmin, this.roles.projectManager]), validate(this.valid.promotion), this.create);
        this.router.post(`${this.path}/:id`, checkAuth, upload.single('file'), checkFiles(), this.upload);
        this.router.patch(`${this.path}/:id`, checkAuth, checkRoles([this.roles.techadmin, this.roles.projectManager]), validate(this.valid.promotion), this.update);
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
                code200DataProvider(response, { total, limit, page, pages }, docs.map(promo => this.parseFields(promo)))
            })
    };
    private create = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const promoData: Promotion = request.body;
        this.promo.findOne({ title: promoData.title })
            .then(promo => {
                if (promo && promo.title == promoData.title) {
                    next(new UnprocessableEntityException(
                        this.validator.addCustomError(
                            'title',
                            this.list.UNIQUE_INVALID,
                            [{ value: 'Title', }, { value: promoData.title }])))
                } else {
                    const promo = new this.promo(promoData);
                    promo.save()
                        .then(promotion => code201(response, this.parseFields(promotion))
                        )
                        .catch(err => {
                            code500(response, err)
                        })
                }
            })

    }

    private upload = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        this.storage.uploadFile(request.file)
            .then(s3 => {
                this.promo.findByIdAndUpdate(request.params.id, { $set: Object.assign({ image: s3['Location'] }, { updatedAt: getCurrentTime() }) }, { new: true })
                    .then(promo => code200(response, this.parseFields(promo)))
                    .catch(err => code500(response, err))
            })
            .catch(err => code404(response, "Promotion is invalid"))
    }

    private update = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const updatedData = Object.assign(request.body, { updatedAt: getCurrentTime() })
        this.promo.findByIdAndUpdate(request.params.id, { $set: updatedData }, { new: true })
            .then(promo => code200(response, this.parseFields(promo)))
            .catch(err => code404(response, "Pizza was not found."))
    }

    private remove = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        this.promo.findByIdAndDelete(request.params.id)
            .then(result => {
                result ? code204(response) : code404(response, "Promo is not founded");
            })
            .catch(err => code404(response, code404(response, "Promo is not founded")))
    }

    private overview = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const { id } = request.params
        this.promo.findById(id)
            .then(promo => code200(response, this.parseFields(promo)))
            .catch(err => code404(response, code404(response, "Promo is not founded")))
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