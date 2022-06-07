import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { BaseTimeEntity } from '../../common/domain/base.time.entity'
import { Point } from './point.entity'
import { PointEventRedeemDetail } from './point.event.redeem.detail.entity'

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

    @Column({ name: 'used_amount', type: 'integer' })
    usedAmount: number

    // @Column({ name: 'prev_balance', type: 'integer' })
    // prevBalance: number

    // @Column({ name: 'post_balance', type: 'integer' })
    // postBalance: number

    @Column({ type: 'datetime', name: 'expried_at', nullable: true })
    expiredAt?: Date

    @OneToMany(
        () => PointEventRedeemDetail,
        (pointEventRedeemDetail) => pointEventRedeemDetail.usedPointEvent,
        { cascade: true, eager: true }
    )
    usedRedeemDetails?: PointEventRedeemDetail[]

    @OneToMany(
        () => PointEventRedeemDetail,
        (pointEventRedeemDetail) => pointEventRedeemDetail.pointEvent,
        { cascade: true, eager: true }
    )
    redeemDetails?: PointEventRedeemDetail[]

    @ManyToOne(() => Point, (point) => point.pointEvents, {
        nullable: false,
    })
    @JoinColumn()
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
        pointEvent.usedAmount = 0
        pointEvent.expiredAt = expiredAt

        return pointEvent
    }

    public static createRedeemEvent(point: Point, amount: number): PointEvent {
        const pointEvent = new PointEvent()

        pointEvent.point = point
        pointEvent.type = PointEventType.REDEEM
        pointEvent.amount = -amount

        pointEvent.usedAmount = 0

        return pointEvent
    }

    public redeem(amount: number, pointEvent: PointEvent) {
        if (!this.thisIsEarnEvent()) throw new Error('Not earn event')

        if (this.availableAmount() < amount) throw new Error('Not enough point')

        this.increaseUsedAmount(amount)

        const pointEventRedeemDetail = new PointEventRedeemDetail(
            amount,
            pointEvent,
            this
        )

        if (!this.usedRedeemDetails) this.usedRedeemDetails = []
        this.usedRedeemDetails.push(pointEventRedeemDetail)

        // return pointEventRedeemDetail
    }

    public canRedeem() {
        return this.thisIsEarnEvent() && this.availableAmount() > 0
    }

    public availableAmount(): number {
        return this.amount + this.usedAmount
    }

    private increaseUsedAmount(amount: number) {
        this.usedAmount += -amount
    }

    public thisIsEarnEvent(): boolean {
        return this.type === PointEventType.EARN
    }

    private thisIsRedeemEvent(): boolean {
        return this.type === PointEventType.REDEEM
    }
}
