import { Point } from '../domain/point.entity'

describe('point', () => {
    const userId = 'test-user-id'
    let point: Point

    beforeEach(() => {
        point = Point.create(userId)
    })

    it('default user point', () => {
        expect(point.balance).toBe(0)
        expect(point.totalUsedAmount).toBe(0)
        expect(point.userId).toBe(userId)
    })

    it('earn point', () => {
        point.earn(1000)

        expect(point.balance).toBe(1000)
        expect(point.totalUsedAmount).toBe(0)
        expect(point.pointEvents).toHaveLength(1)
    })

    it('redeem point', () => {
        point.earn(1000)
        point.redeem(500)

        expect(point.balance).toBe(500)
        expect(point.totalUsedAmount).toBe(500)
        expect(point.pointEvents).toHaveLength(2)
    })

    it('can not redeem point', () => {
        point.earn(1000)

        expect(() => point.redeem(1001)).toThrowError('Not enough point')
    })

    it('can redeem point', () => {
        point.earn(1000)

        expect(point.canRedeem(1000)).toBe(true)
    })

    it('can not redeem point', () => {
        point.earn(1000)

        expect(point.canRedeem(1001)).toBe(false)
    })
})
