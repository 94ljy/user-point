import { Injectable } from '@nestjs/common'
import { Point } from '../domain/point.entity'
import { PointRepository } from '../repository/point.repository'

@Injectable()
export class PointService {
    constructor(private readonly pointRepository: PointRepository) {}

    public async create(userId: string): Promise<Point> {
        const point = Point.create(userId)

        return this.pointRepository.save(point)
    }

    async earn(
        userId: string,
        amount: number,
        expiredAt?: Date
    ): Promise<Point> {
        const point = await this.getUserPoint(userId)
        point.earn(amount, expiredAt)

        return this.pointRepository.save(point)
    }

    async redeem(userId: string, amount: number): Promise<Point> {
        const point = await this.getUserPoint(userId)
        point.redeem(amount)

        return this.pointRepository.save(point)
    }

    async getUserPoint(userId: string): Promise<Point> {
        const point = await this.pointRepository.findOne({
            where: { userId },
            relations: ['pointEvents'],
        })

        if (!point)
            throw new Error(`user point not found for userId: ${userId}`)

        return point
    }
}
