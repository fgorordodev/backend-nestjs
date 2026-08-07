import { randomUUID } from 'node:crypto';

import {
    Inject,
    Injectable,
    NestMiddleware,
} from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import {
    NextFunction,
    Request,
    Response,
} from 'express';


import {
    REQUEST_ID_HEADER,
    UUID_PATTERN,
} from './request-context.constants';
import { RequestContextService } from './request-context.service';
import appConfig from '../config/app.config';

@Injectable()
export class RequestContextMiddleware
    implements NestMiddleware {
    constructor(
        private readonly requestContext: RequestContextService,

        @Inject(appConfig.KEY)
        private readonly config: ConfigType<typeof appConfig>,
    ) { }

    use(
        request: Request,
        response: Response,
        next: NextFunction,
    ): void {
        const incomingRequestId = request.get(
            REQUEST_ID_HEADER,
        );

        const requestId =
            this.canTrustIncomingRequestId(incomingRequestId)
                ? incomingRequestId
                : randomUUID();

        response.setHeader(
            REQUEST_ID_HEADER,
            requestId,
        );

        this.requestContext.run(
            { requestId },
            () => next(),
        );
    }

    private canTrustIncomingRequestId(
        requestId: string | undefined,
    ): requestId is string {
        return (
            this.config.trustIncomingRequestId &&
            typeof requestId === 'string' &&
            UUID_PATTERN.test(requestId)
        );
    }
}