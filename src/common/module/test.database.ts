import { TypeOrmModule } from '@nestjs/typeorm'

export const testDatabaseModule = TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    synchronize: true,
    entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
})
