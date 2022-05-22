import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { PointEvent } from '../domain/point.event.entity'
import { PointRedeemEvent } from '../domain/point.redeem.event.entity'
import { PointEventType } from '../domain/type/point.event.type'
import { PointEventRepository } from '../repository/point.event.repository'
import { UserEarnPoint } from './user.earn.point'

@Injectable()
export class PointService {
    constructor(private readonly pointEventRepository: PointEventRepository) {}

    async getUserEarnPoint(userId: string): Promise<UserEarnPoint> {
        const earnPointEvents = await this.pointEventRepository.find({
            where: {
                type: PointEventType.EARN,
                userId,
            },
            relations: ['usedPointRedeemEvents'],
        })

        const userEarnPoint = new UserEarnPoint(userId, earnPointEvents)

        return userEarnPoint
    }

    async earn(userId: string, amount: number, expiredAt: Date | null) {
        const pointEvent = PointEvent.createEarnEvent(userId, amount, expiredAt)
        await this.pointEventRepository.save(pointEvent)
    }

    async redeem(userId: string, amount: number) {
        const userEarnPoint = await this.getUserEarnPoint(userId)

        const newPointEvent = userEarnPoint.redeem(amount)

        await this.pointEventRepository.save(newPointEvent)
    }
}
