import { BaseTimeEntity } from '../../common/domain/base.time.entity'
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { PointEvent } from './point.event.entity'

@Entity()
export class PointEventRedeemDetail extends BaseTimeEntity {
    @PrimaryGeneratedColumn('uuid')
    readonly id: string

    @Column({ type: 'integer' })
    readonly amount: number

    @Column()
    readonly usedPointEventId: string

    @ManyToOne(() => PointEvent, { nullable: false })
    @JoinColumn()
    readonly usedPointEvent: PointEvent

    @Column()
    readonly pointEventId: string

    @ManyToOne(() => PointEvent, { nullable: false })
    @JoinColumn()
    readonly pointEvent: PointEvent

    constructor(
        amount: number,
        pointEvent: PointEvent,
        usedPointEvent: PointEvent
    ) {
        super()
        this.amount = -amount
        this.pointEvent = pointEvent
        this.usedPointEvent = usedPointEvent
    }
}
