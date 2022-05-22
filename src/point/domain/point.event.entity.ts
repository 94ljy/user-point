import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { PointRedeemEvent } from './point.redeem.event.entity'
import { PointEventType } from './type/point.event.type'

@Entity({ name: 'point_event' })
export class PointEvent {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date

    @Column({ name: 'type' })
    type: PointEventType

    @Column({ name: 'amount' })
    amount: number

    @Column({ type: 'date', name: 'expried_at', nullable: true })
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
        //
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

    redeem(amount: number) {
        if (this.availableAmount() < amount) {
            throw new Error('Not enough point')
        }

        const pointRedeemEvent = PointRedeemEvent.createRedeemEvent(
            this.userId,
            amount,
            this
        )

        if (!this.usedPointRedeemEvents)
            this.usedPointRedeemEvents = [pointRedeemEvent]
        else this.usedPointRedeemEvents.push(pointRedeemEvent)

        return pointRedeemEvent
    }

    isAvailable() {
        return this.availableAmount() > 0
    }

    availableAmount() {
        return this.amount + this.usedAmountSum()
    }

    usedAmountSum() {
        return (
            this.usedPointRedeemEvents?.reduce(
                (acc, cur) => acc + cur.amount,
                0
            ) ?? 0
        )
    }
}

// 포인트 1000원 적립
// 포인트 900원 사용>> 포인트 이벤트 조회하여 검증
// 남은 포인트 100원
