import {ApiModelProperty} from '@nestjs/swagger';
import {BUDResponse, IBUDLinks, IBUDMeta, IBUDSuccessResponse, IMetric} from '@components/bud-proxy/service/bud';

export class BudApiResponse implements IBUDSuccessResponse<IMetric> {

    @ApiModelProperty({required: true, description: 'Metric data', default: false})
    items: IMetric[];

    @ApiModelProperty({required: true, description: 'HATEOAS style links', default: false})
    _links: IBUDLinks;

    @ApiModelProperty({required: true, description: 'HATEOAS style links', default: false})
    _meta: IBUDMeta;
}
