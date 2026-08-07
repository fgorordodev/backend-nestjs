import { NestExpressApplication } from "@nestjs/platform-express";
import { RequestContextMiddleware } from "../../request-context";

export function configureRequestContext(
    app: NestExpressApplication,
): void {
    const middleware = app.get(
        RequestContextMiddleware,
    );

    app.use(middleware.use.bind(middleware));
}