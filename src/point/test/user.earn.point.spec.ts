import { add } from 'date-fns'
import { PointEvent } from '../domain/point.event.entity'
import { PointRedeemEvent } from '../domain/point.redeem.event.entity'
import { PointEventType } from '../domain/type/point.event.type'
import { UserEarnPoint } from '../service/user.earn.point'

describe('UserPoint', () => {
    let userEarnPoint: UserEarnPoint

    beforeEach(() => {
        const userId = 'test-user'
        const pointEvents: PointEvent[] = [
            PointEvent.createEarnEvent(userId, 1000, null),
            PointEvent.createEarnEvent(userId, 500, null),
            PointEvent.createEarnEvent(userId, 2000, null),
        ]

        pointEvents.forEach((item) => (item.createdAt = new Date()))

        pointEvents[0].usedPointRedeemEvents = [
            PointRedeemEvent.createRedeemEvent(userId, 100, pointEvents[0]),
        ]
        userEarnPoint = new UserEarnPoint(userId, pointEvents)
    })

    it('availableAmount', () => {
        const availableAmount = userEarnPoint.availableAmount()

        expect(availableAmount).toBe(3400)
    })

    it('canRedeem', () => {
        expect(userEarnPoint.canRedeem(500)).toBe(true)

        expect(
            userEarnPoint.canRedeem(userEarnPoint.availableAmount() + 1)
        ).toBe(false)
    })

    it('redeemError overPoint', () => {
        const availableAmount = userEarnPoint.availableAmount()

        expect(() => userEarnPoint.redeem(availableAmount + 1)).toThrow(
            'Not enough point'
        )
    })

    it('redeem', async () => {
        const availableAmount = userEarnPoint.availableAmount()

        userEarnPoint.redeem(availableAmount / 2)

        expect(userEarnPoint.availableAmount()).toBe(availableAmount / 2)
    })

    it('redeem priority', () => {
        userEarnPoint.pointEvents[2].expiredAt = add(new Date(), {
            days: 1,
        })

        const pointEvent = userEarnPoint.redeem(500)

        expect(pointEvent.pointRedeemEvents[0].usedPointEvent.amount).toBe(2000)
    })
})
