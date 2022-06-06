import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { BaseTimeEntity } from '../../common/domain/base.time.entity'
import { Point } from './point.entity'

export enum PointEventType {
    EARN = 'EARN',
    REDEEM = 'REDEEM',
}

@Entity({ name: 'point_event' })
export class PointEvent extends BaseTimeEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: number

    @Column({ name: 'type', type: 'varchar' })
    type: PointEventType

    @Column({ name: 'amount', type: 'integer' })
    amount: number

    @Column({ type: 'datetime', name: 'expried_at', nullable: true })
    expiredAt?: Date

    @ManyToOne(() => Point, (point) => point.pointEvents)
    point: Point

    private constructor() {
        super()
    }

    public static createEarnEvent(
        point: Point,
        amount: number,
        expiredAt?: Date
    ): PointEvent {
        const pointEvent = new PointEvent()

        pointEvent.point = point
        pointEvent.type = PointEventType.EARN
        pointEvent.amount = amount
        pointEvent.expiredAt = expiredAt

        return pointEvent
    }

    public static createRedeemEvent(point: Point, amount: number) {
        const pointEvent = new PointEvent()

        pointEvent.point = point
        pointEvent.type = PointEventType.REDEEM
        pointEvent.amount = -amount

        return pointEvent
    }
}
