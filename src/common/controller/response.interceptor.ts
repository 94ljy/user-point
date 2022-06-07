import { ExecutionContext, NestInterceptor } from '@nestjs/common'
import { catchError, map, throwError } from 'rxjs'
import { BaseResponse } from './base.response'

export class BaseResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next) {
        return next
            .handle()
            .pipe(
                catchError((err) =>
                    throwError(() => BaseResponse.ERROR_WITH(err.message))
                )
            )
    }
}
