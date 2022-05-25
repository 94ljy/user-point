import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { find } from 'rxjs'
import { PointEvent } from '../domain/point.event.entity'
import { PointRedeemEvent } from '../domain/point.redeem.event.entity'
import { PointEventType } from '../domain/type/point.event.type'
import { PointModule } from '../point.module'
import { PointEventRepository } from '../repository/point.event.repository'
import { PointService } from '../service/point.service'

describe('PointService', () => {
    let module: TestingModule
    let pointService: PointService
    let pointEventRepository: PointEventRepository

    const userId = 'test-user'

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: ':memory:',
                    entities: [PointEvent, PointRedeemEvent],
                    synchronize: true,
                    // logging: true,
                    // keepConnectionAlive: true,
                }),
                PointModule,
            ],
        }).compile()

        pointService = module.get(PointService)
        pointEventRepository = module.get(PointEventRepository)
    })

    afterEach(async () => {
        await module.close()
    })

    it('earn point', async () => {
        const earnAmount = 10000

        await expect(
            pointService.earn(userId, earnAmount, null)
        ).resolves.not.toThrow()

        const result = await pointService.getUserEarnPoint(userId)

        expect(result.availableAmount()).toBe(earnAmount)
    })

    it('over redeem point', async () => {
        const earnAmount = 10000
        await pointService.earn(userId, earnAmount, null)

        await expect(
            pointService.redeem(userId, earnAmount * 2)
        ).rejects.toThrow()
    })

    it('redeem point', async () => {
        await pointService.earn(userId, 10000, null)

        await expect(pointService.redeem(userId, 10000)).resolves.not.toThrow()
    })

    it('redeem priority', async () => {
        const date1 = new Date()
        date1.setDate(date1.getDate() + 1)
        const date2 = new Date()
        date2.setMonth(date2.getMonth() + 1)

        await pointService.earn(userId, 10000, null)
        await pointService.earn(userId, 5000, date2)
        await pointService.earn(userId, 2000, date1)

        await pointService.redeem(userId, 10000)

        let pointEvents = await pointEventRepository.find({
            where: { userId, type: PointEventType.EARN },
            relations: ['usedPointRedeemEvents'],
        })

        console.log(pointEvents)

        expect(pointEvents.length).toBe(3)

        pointEvents = pointEvents.sort(
            (a, b) => a.getExpiredTime() - b.getExpiredTime()
        )

        expect(pointEvents[0].amount).toBe(2000)
        expect(pointEvents[0].usedAmountSum()).toBe(-2000)

        expect(pointEvents[1].amount).toBe(5000)
        expect(pointEvents[1].usedAmountSum()).toBe(-5000)

        expect(pointEvents[2].amount).toBe(10000)
        expect(pointEvents[2].usedAmountSum()).toBe(-3000)
    })

    it('redeem after amount', async () => {
        await pointService.earn(userId, 10000, null)

        await pointService.redeem(userId, 5000)

        const result = await pointService.getUserEarnPoint(userId)

        expect(result.availableAmount()).toBe(5000)
    })
})
