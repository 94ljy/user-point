import { PointEvent } from '../domain/point.event.entity'

describe('pointEntity', () => {
    const userId = 'test-user'

    it('point entity redeem type error', () => {
        const pointEvent = PointEvent.createRedeemEvent(userId, 100)

        expect(() => pointEvent.redeem(100)).toThrow()
    })

    it('point redeem', () => {
        const earnEvent = PointEvent.createEarnEvent(userId, 1000, null)

        const redeemEvent = earnEvent.redeem(500)

        expect(redeemEvent.amount).toBe(-500)
        expect(redeemEvent.usedPointEvent).toBe(earnEvent)
    })

    it('point redeem error', () => {
        const earnEvent = PointEvent.createEarnEvent(userId, 1000, null)

        expect(() => earnEvent.redeem(1001)).toThrow()
    })
})
