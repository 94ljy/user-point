import { CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm'

export class BaseEntity {
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date

    @CreateDateColumn({ name: 'updated_at' })
    updatedAt: Date
}
