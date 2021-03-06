import { isAfter, isBefore } from 'date-fns'
import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { BaseEntity } from './base.entity'
import { PointRedeemEvent } from './point.redeem.event.entity'
import { PointEventType } from './type/point.event.type'

@Entity({ name: 'point_event' })
export class PointEvent extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number

    @Column({ name: 'type' })
    type: PointEventType

    @Column({ name: 'amount' })
    amount: number

    @Column({ type: 'datetime', name: 'expried_at', nullable: true })
    expiredAt: Date | null = null

    @Column({ name: 'user_id' })
    userId: string

    @OneToMany(
        () => PointRedeemEvent,
        (pointRedeemEvent) => pointRedeemEvent.usedPointEvent,
        { cascade: true }
    )
    usedPointRedeemEvents?: PointRedeemEvent[]

    @OneToMany(
        () => PointRedeemEvent,
        (pointRedeemEvent) => pointRedeemEvent.pointEvent,
        { cascade: true }
    )
    pointRedeemEvents?: PointRedeemEvent[]

    private constructor() {
        super()
    }

    public static createRedeemEvent(userId: string, amount: number) {
        const pointEvent = new PointEvent()

        pointEvent.type = PointEventType.REDEEM
        pointEvent.amount = -amount
        pointEvent.expiredAt = null
        pointEvent.userId = userId

        return pointEvent
    }

    public static createEarnEvent(
        userId: string,
        amount: number,
        expiredAt: Date | null
    ) {
        const pointEvent = new PointEvent()

        pointEvent.type = PointEventType.EARN
        pointEvent.amount = amount
        pointEvent.expiredAt = expiredAt
        pointEvent.userId = userId

        return pointEvent
    }

    redeem(amount: number): PointRedeemEvent {
        if (this.type !== PointEventType.EARN) {
            throw new Error('PointEvent is not earn event')
        }

        if (this.availableAmount() < amount) {
            throw new Error('Not enough point')
        }

        const pointRedeemEvent = PointRedeemEvent.createRedeemEvent(
            this.userId,
            amount,
            this
        )

        this.addUsedPointRedeemEvent(pointRedeemEvent)

        return pointRedeemEvent
    }

    addUsedPointRedeemEvent(pointRedeemEvent: PointRedeemEvent) {
        if (!this.usedPointRedeemEvents)
            this.usedPointRedeemEvents = [pointRedeemEvent]
        else this.usedPointRedeemEvents.push(pointRedeemEvent)
    }

    isAvailable(): boolean {
        if (this.expiredAt && isAfter(new Date(), this.expiredAt)) {
            return false
        }
        return this.availableAmount() > 0
    }

    availableAmount(): number {
        return this.amount + this.usedAmountSum()
    }

    usedAmountSum(): number {
        return (
            this.usedPointRedeemEvents?.reduce(
                (acc, cur) => acc + cur.amount,
                0
            ) ?? 0
        )
    }

    getExpiredTime(): number {
        if (this.expiredAt) return this.expiredAt.getTime()
        else return Number.MAX_VALUE
    }
}

// ????????? 1000??? ??????
// ????????? 900??? ??????>> ????????? ????????? ???????????? ??????
// ?????? ????????? 100???
