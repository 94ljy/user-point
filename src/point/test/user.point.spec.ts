import { PointEvent } from '../domain/point.event.entity'
import { PointRedeemEvent } from '../domain/point.redeem.event.entity'
import { PointEventType } from '../domain/type/point.event.type'
import { UserEarnPoint } from '../service/user.point'

describe('UserPoint', () => {
    const userId = 'test-user'
    const pointEvents: PointEvent[] = [
        PointEvent.createEarnEvent(userId, 1000, null),
        PointEvent.createEarnEvent(userId, 500, null),
        PointEvent.createEarnEvent(userId, 2000, null),
    ]

    pointEvents[0].usedPointRedeemEvents = [
        PointRedeemEvent.createRedeemEvent(userId, 100, pointEvents[0]),
    ]

    const userPoint = new UserEarnPoint(userId, pointEvents)

    it('availableAmount', () => {
        const availableAmount = userPoint.availableAmount()

        expect(availableAmount).toBe(3400)
    })

    it('canRedeem', () => {
        expect(userPoint.canRedeem(500)).toBe(true)

        expect(userPoint.canRedeem(userPoint.availableAmount() + 1)).toBe(false)
    })

    it('redeemError overPoint', () => {
        const availableAmount = userPoint.availableAmount()

        expect(() => userPoint.redeem(availableAmount + 1)).toThrow(
            'Not enough point'
        )
    })

    it('redeem', async () => {
        const newPointEvent = userPoint.redeem(2000)

        expect(newPointEvent).toEqual({
            amount: -2000,
            type: PointEventType.REDEEM,
            expiredAt: null,
            userId,
            pointRedeemEvents: [
                {
                    amount: -900,
                    usedPointEvent: pointEvents[0],
                    userId,
                },
                {
                    amount: -500,
                    usedPointEvent: pointEvents[1],
                    userId,
                },
                {
                    amount: -600,
                    usedPointEvent: pointEvents[2],
                    userId,
                },
            ],
        })
    })
})
