import { BadRequestException } from '@nestjs/common'

export enum BaseResponseStatus {
    OK = 'OK',
    ERROR = 'ERROR',
}

export class BaseResponse<T> {
    public readonly status: BaseResponseStatus
    public readonly message: string
    public readonly data: T

    constructor(status: BaseResponseStatus, message: string, data: T) {
        this.status = status
        this.message = message
        this.data = data
    }

    public static OK() {
        return new BaseResponse(BaseResponseStatus.OK, '', null)
    }

    public static OK_WITH<T>(data: T) {
        return new BaseResponse(BaseResponseStatus.OK, '', data)
    }

    public static ERROR() {
        return new BaseResponse(BaseResponseStatus.ERROR, '', null)
    }

    public static ERROR_WITH(message: string) {
        return new BaseResponse(BaseResponseStatus.ERROR, message, null)
    }
}
