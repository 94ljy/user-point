import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { PointEvent } from './point.event.entity'
import { PointEventType } from './type/point.event.type'

@Entity({ name: 'point_redeem_event' })
export class PointRedeemEvent {
    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn({ name: 'created_at' })
    createAt: Date

    @UpdateDateColumn({ name: 'updated_at' })
    updateAt: Date

    @Column({ name: 'amount' })
    amount: number

    @Column()
    userId: string

    // @Column({ name: 'used_point_event_id' })
    // usedPointEventId: number

    @ManyToOne(() => PointEvent, (pointEvent) => pointEvent.pointRedeemEvents)
    usedPointEvent: PointEvent

    // @Column({ name: 'point_event_id' })
    // pointEventId: number

    @ManyToOne(() => PointEvent, (pointEvent) => pointEvent.pointRedeemEvents)
    pointEvent: PointEvent

    private constructor() {
        //
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
