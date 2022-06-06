import {
    Column,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { PointEvent } from './point.event.entity'

@Entity({ name: 'point' })
@Index(['userId'], { unique: true })
export class Point {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: number

    @Column({ name: 'balance', type: 'integer' })
    balance: number

    @Column({ name: 'used_amount', type: 'integer' })
    totalUsedAmount: number

    @Column({ name: 'user_id', unique: true })
    userId: string

    @OneToMany(() => PointEvent, (pointEvent) => pointEvent.point, {
        cascade: true,
        eager: true,
    })
    pointEvents?: PointEvent[]

    private constructor(userId: string) {
        this.balance = 0
        this.totalUsedAmount = 0
        this.userId = userId
    }

    public static create(userId: string): Point {
        return new Point(userId)
    }

    public earn(amount: number, expiredAt?: Date) {
        const pointEvent = PointEvent.createEarnEvent(this, amount, expiredAt)
        this.addPointEvent(pointEvent)
        this.balanceIncreased(amount)
    }

    public canRedeem(amount: number): boolean {
        return this.balance >= amount
    }

    public redeem(amount: number) {
        if (!this.canRedeem(amount)) throw new Error('Not enough point')

        this.addPointEvent(PointEvent.createRedeemEvent(this, amount))
        this.balanceDecreased(amount)
    }

    private getAvaiableEarnPointEvent(): PointEvent[] {
        if (!this.pointEvents) return []
        return this.pointEvents.filter((item) => item.canRedeem())
    }

    private balanceIncreased(amount: number) {
        this.balance += amount
    }

    private balanceDecreased(amount: number) {
        this.balance -= amount
        this.totalUsedAmount += amount
    }

    private addPointEvent(pointEvent: PointEvent) {
        if (!this.pointEvents) this.pointEvents = []

        this.pointEvents.push(pointEvent)
    }
}
