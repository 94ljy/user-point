import { Controller, Post } from '@nestjs/common'
import { BaseResponse } from '../../common/controller/base.response'
import { PointService } from '../service/point.service'

@Controller('point')
export class PointController {
    constructor(private readonly pointService: PointService) {}

    @Post()
    public async create(userId: string) {
        await this.pointService.create(userId)
        return BaseResponse.OK()
    }
}
