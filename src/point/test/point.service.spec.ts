import { Test, TestingModule } from '@nestjs/testing'
import { PointEvent } from '../domain/point.event.entity'
import { PointEventType } from '../domain/type/point.event.type'
import { PointEventRepository } from '../repository/point.event.repository'
import { PointService } from '../service/point.service'

describe('PointService', () => {
    let pointService: PointService
    let pointEventRepository: PointEventRepository
    const userId = 'test-user'

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: PointEventRepository,
                    useValue: {},
                },
                PointService,
            ],
        }).compile()

        pointService = module.get<PointService>(PointService)
        pointEventRepository =
            module.get<PointEventRepository>(PointEventRepository)
    })

    it('getUserEarnPoint', async () => {
        pointEventRepository.find = jest
            .fn()
            .mockResolvedValue([PointEvent.createEarnEvent(userId, 1000, null)])
        const userPoint = await pointService.getUserEarnPoint(userId)
        const availableAmount = userPoint.availableAmount()
        expect(availableAmount).toBe(1000)
    })

    it('earnSuccess', async () => {
        const earnAmount = 10000

        pointEventRepository.save = jest.fn().mockResolvedValue(null)
        await pointService.earn(userId, earnAmount, null)

        expect(pointEventRepository.save).toBeCalledWith(
            expect.objectContaining(
                PointEvent.createEarnEvent(userId, earnAmount, null)
            )
        )
    })

    it('overRedemAmount', async () => {
        pointEventRepository.find = jest
            .fn()
            .mockResolvedValue([PointEvent.createEarnEvent(userId, 1000, null)])

        const userPoint = await pointService.getUserEarnPoint(userId)

        const availableAmount = userPoint.availableAmount()

        const redemAmount = availableAmount + 1

        expect(pointService.redeem(userId, redemAmount)).rejects.toThrow()
    })

    it('redeemSuccess', async () => {
        pointEventRepository.find = jest
            .fn()
            .mockResolvedValue([PointEvent.createEarnEvent(userId, 1000, null)])

        pointEventRepository.save = jest.fn().mockResolvedValue(null)

        await pointService.redeem(userId, 500)

        expect(pointEventRepository.save).toBeCalledWith(
            expect.objectContaining(PointEvent.createRedeemEvent(userId, 500))
        )
    })
})
