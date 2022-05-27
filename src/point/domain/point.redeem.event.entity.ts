import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { BaseEntity } from './base.entity'
import { PointEvent } from './point.event.entity'
import { PointEventType } from './type/point.event.type'

@Entity({ name: 'point_redeem_event' })
export class PointRedeemEvent extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'amount' })
    amount: number

    @Column({ name: 'user_id' })
    userId: string

    // @Column({ name: 'used_point_event_id' })
    // usedPointEventId: number

    @ManyToOne(() => PointEvent, (pointEvent) => pointEvent.pointRedeemEvents)
    @JoinColumn({ name: 'used_point_event_id' })
    usedPointEvent: PointEvent

    // @Column({ name: 'point_event_id' })
    // pointEventId: number

    @ManyToOne(() => PointEvent, (pointEvent) => pointEvent.pointRedeemEvents)
    @JoinColumn({ name: 'point_event_id' })
    pointEvent: PointEvent

    private constructor() {
        super()
    }

    public static createRedeemEvent(
        userId: string,
        amount: number,
        usedPointEvent: PointEvent
    ) {
        const pointRedeemEvent = new PointRedeemEvent()

        pointRedeemEvent.userId = userId
        pointRedeemEvent.amount = -amount
        pointRedeemEvent.usedPointEvent = usedPointEvent

        return pointRedeemEvent
    }
}
