import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PointModule } from './point/point.module'

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: ':memory:',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
            logging: true,
        }),
        PointModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
