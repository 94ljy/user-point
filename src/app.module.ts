import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PointModule } from './point/point.module'
import { BaseResponseInterceptor } from './common/controller/response.interceptor'

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
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: BaseResponseInterceptor,
        },
    ],
})
export class AppModule {}
