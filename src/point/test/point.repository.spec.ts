import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { testDatabaseModule } from '../../common/module/test.database'
import { Point } from '../domain/point.entity'
import { PointRepository } from '../repository/point.repository'

describe('point repository test', () => {
    let pointRepository: PointRepository
    let module: TestingModule
    const testUserId = 'test-user-id'

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [
                testDatabaseModule,
                TypeOrmModule.forFeature([PointRepository]),
            ],
        }).compile()

        pointRepository = module.get(PointRepository)
    })

    afterEach(async () => {
        await module.close()
    })

    it('create point', async () => {
        const point = await pointRepository.save(Point.create(testUserId))

        expect(point.userId).toBe(testUserId)
    })
})
