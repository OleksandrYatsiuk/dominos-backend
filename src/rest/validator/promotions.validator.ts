import { PromotionStatuses, PromotionStatusesMap } from "../interfaces/promotions.interface";
import { PromotionConfig } from "./validatorConfig/index";
import { BaseValidator } from "./base.validator";

export default class PromotionValidator extends BaseValidator {
    public config = new PromotionConfig();
    constructor() {
        super()
    }

    private title = this.val.string().required().label('Title').max(this.config.titleMaxLength);
    private content = this.val.string().required().label('Content').max(this.config.descriptionMaxLength);
    private image = this.val.string().optional().allow("").label('Image');
    private startedAt = this.val.date().required().label('Started Date');
    private status = this.val.number().label('Status')
        .valid(
            PromotionStatuses.New,
            PromotionStatuses.Active,
            PromotionStatuses.Deactivate,
            PromotionStatuses.Finished)

    public promotion = this.schema({
        title: this.title,
        content: this.content,
        image: this.image,
        startedAt: this.startedAt,
        status: this.status
    })

    public pagination = super.paginationSchema(
        {
            sort: this.val.optional().label('Sorting'),
            status: this.val.array().label('Status').items(this.status)
        }
    )
}



