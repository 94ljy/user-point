import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PointEvent } from './domain/point.event.entity'
import { PointRedeemEvent } from './domain/point.redeem.event.entity'
import { PointEventRepository } from './repository/point.event.repository'
import { PointService } from './service/point.service'

@Module({
    imports: [TypeOrmModule.forFeature([PointEventRepository])],
    providers: [PointService],
})
export class PointModule {}
