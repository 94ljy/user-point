import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PointEvent } from '../domain/point.event.entity'
import { PointRedeemEvent } from '../domain/point.redeem.event.entity'
import { PointModule } from '../point.module'
import { PointService } from '../service/point.service'

describe('PointService', () => {
    let pointService: PointService
    const userId = 'test-user'

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: ':memory:',
                    entities: [PointEvent, PointRedeemEvent],
                    synchronize: true,
                    logging: true,
                    keepConnectionAlive: true,
                }),
                PointModule,
            ],
        }).compile()

        pointService = module.get<PointService>(PointService)
    })

    it('earn point', async () => {
        const earnAmount = 10000

        await expect(
            pointService.earn(userId, earnAmount, null)
        ).resolves.not.toThrow()
    })

    it('over redeem point', async () => {
        const userEarnPoint = await pointService.getUserEarnPoint(userId)

        const redemAmount = userEarnPoint.availableAmount() * 2

        await expect(pointService.redeem(userId, redemAmount)).rejects.toThrow()
    })

    it('redeem point', async () => {
        await pointService.earn(userId, 10000, null)

        await expect(pointService.redeem(userId, 10000)).resolves.not.toThrow()
    })
})
