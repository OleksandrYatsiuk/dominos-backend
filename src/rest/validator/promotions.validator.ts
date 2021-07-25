import { PromotionStatuses } from "../interfaces/promotions.interface";
import { PromotionConfig } from "./validatorConfig/index";
import { BaseValidator } from "./base.validator";

export default class PromotionValidator extends BaseValidator {
    public config = new PromotionConfig();
    constructor() {
        super()
    }

    private title = this.val.string().required().label('Title').max(this.config.promoTitleMaxLength);
    private description = this.val.string().required().label('Content').max(this.config.promoDescriptionMaxLength);
    private image = this.val.allow(null).label('Image')
    private startedAt = this.val.string().optional().allow(null).label('Started Date');
    private endedAt = this.val.string().optional().allow(null).label('Started Date');
    private status = this.val.number().label('Status')
        .valid(
            PromotionStatuses.New,
            PromotionStatuses.Active,
            PromotionStatuses.Deactivate,
            PromotionStatuses.Finished)

    public promotion = this.schema({
        title: this.title,
        description: this.description,
        image: this.image,
        startedAt: this.startedAt,
        endedAt: this.endedAt,
        status: this.status
    })

    public pagination = super.paginationSchema(
        {
            sort: this.val.optional().label('Sorting'),
            status: this.val.array().label('Status').items(this.status)
        }
    )
}



