import { PointEvent } from '../domain/point.event.entity'
import { PointRedeemEvent } from '../domain/point.redeem.event.entity'

export class UserEarnPoint {
    constructor(
        public readonly userId: string,
        public readonly pointEvents: PointEvent[]
    ) {
        this.userId = userId
        this.pointEvents = pointEvents
    }

    redeem(amount: number): PointEvent {
        if (!this.canRedeem(amount)) throw new Error('Not enough point')

        const newPointEvent = PointEvent.createRedeemEvent(this.userId, amount)

        newPointEvent.pointRedeemEvents =
            this.redeemAvailablePointEvents(amount)

        return newPointEvent
    }

    redeemAvailablePointEvents(amount: number): PointRedeemEvent[] {
        let remainingAmount = amount
        const result: PointRedeemEvent[] = []

        for (const avaialablePointEvent of this.availablePointEvents()) {
            if (remainingAmount <= 0) {
                break
            }

            const usedAmount = Math.min(
                avaialablePointEvent.availableAmount(),
                remainingAmount
            )

            const pointRedeemEvent = avaialablePointEvent.redeem(usedAmount)

            result.push(pointRedeemEvent)

            remainingAmount -= usedAmount
        }

        if (remainingAmount > 0) {
            throw new Error('Not enough point')
        }

        return result
    }

    canRedeem(amount: number): boolean {
        return this.availableAmount() >= amount
    }

    availableAmount() {
        return this.availablePointEvents().reduce(
            (acc, cur) => acc + cur.availableAmount(),
            0
        )
    }

    availablePointEvents() {
        return this.pointEvents.filter((item) => item.isAvailable())
    }
}
