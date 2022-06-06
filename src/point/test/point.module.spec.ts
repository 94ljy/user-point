import { PointRepository } from '../repository/point.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { PointModule } from '../point.module'
import { testDatabaseModule } from '../../common/module/test.database'
import { PointService } from '../service/point.service'
import { Point } from '../domain/point.entity'

describe('point module', () => {
    let pointRepository: PointRepository
    let pointService: PointService
    let module: TestingModule
    const testUserId = 'test-user-id'

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [testDatabaseModule, PointModule],
        }).compile()

        pointService = module.get(PointService)
        pointRepository = module.get(PointRepository)
    })

    afterEach(async () => {
        await module.close()
    })

    it('should create point', async () => {
        const point = await pointService.create(testUserId)

        expect(point.userId).toBe(testUserId)
        expect(point.balance).toBe(0)
        expect(point.totalUsedAmount).toBe(0)
    })

    describe('user point test', () => {
        beforeEach(async () => {
            // init user point
            await pointService.create(testUserId)
        })

        it('default user balance should be 0', async () => {
            const point = await pointService.getUserPoint(testUserId)

            expect(point.balance).toBe(0)
        })

        it('should earn point', async () => {
            await pointService.earn(testUserId, 1000)

            const point = await pointService.getUserPoint(testUserId)

            expect(point.balance).toBe(1000)
        })

        it('should redeem point', async () => {
            await pointService.earn(testUserId, 1000)
            await pointService.redeem(testUserId, 500)

            const point = await pointService.getUserPoint(testUserId)

            expect(point.balance).toBe(500)
        })

        it('should not redeem point if balance is not enough', async () => {
            await pointService.earn(testUserId, 1000)

            await expect(
                pointService.redeem(testUserId, 1500)
            ).rejects.toThrow()

            const point = await pointService.getUserPoint(testUserId)

            expect(point.balance).toBe(1000)
        })
    })
})
