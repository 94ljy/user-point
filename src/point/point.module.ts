import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PointRepository } from './repository/point.repository'
import { PointService } from './service/point.service'

@Module({
    imports: [TypeOrmModule.forFeature([PointRepository])],
    providers: [PointService],
})
export class PointModule {}
