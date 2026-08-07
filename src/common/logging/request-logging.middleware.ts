import {
    Injectable,
    Logger,
    NestMiddleware,
} from '@nestjs/common';
import {
    NextFunction,
    Request,
    Response,
} from 'express';
import { RequestContextService } from '../../request-context';

@Injectable()
export class RequestLoggingMiddleware
    implements NestMiddleware {
    private readonly logger = new Logger(
        RequestLoggingMiddleware.name,
    );

    constructor(
        private readonly requestContext: RequestContextService,
    ) { }

    use(
        request: Request,
        response: Response,
        next: NextFunction,
    ): void {
        const startedAt = process.hrtime.bigint();

        let wasLogged = false;

        const logRequest = (aborted: boolean): void => {
            if (wasLogged) {
                return;
            }

            wasLogged = true;

            const durationMs = this.calculateDuration(
                startedAt,
            );

            const event = {
                event: aborted
                    ? 'http_request_aborted'
                    : 'http_request_completed',

                requestId:
                    this.requestContext.getRequestId(),

                method: request.method,
                path: request.path,
                statusCode: response.statusCode,
                durationMs,
            };

            if (aborted) {
                this.logger.warn(event);
                return;
            }

            this.logger.log(event);
        };

        response.once('finish', () => {
            logRequest(false);
        });

        response.once('close', () => {
            if (!response.writableFinished) {
                logRequest(true);
            }
        });

        next();
    }

    private calculateDuration(
        startedAt: bigint,
    ): number {
        const elapsedNanoseconds =
            process.hrtime.bigint() - startedAt;

        const elapsedMilliseconds =
            Number(elapsedNanoseconds) / 1_000_000;

        return Number(
            elapsedMilliseconds.toFixed(2),
        );
    }
}