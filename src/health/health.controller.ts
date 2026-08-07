import {
  Controller,
  Get,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
} from '@nestjs/terminus';
import {
  ApiExcludeController,
} from '@nestjs/swagger';

import {
  ApplicationHealthIndicator,
} from './application-health.indicator';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@ApiExcludeController()
@Controller({
  path: 'health',
  version: VERSION_NEUTRAL,
})
export class HealthController {
  constructor(
    private readonly health:
      HealthCheckService,
    private readonly application:
      ApplicationHealthIndicator,
  ) { }

  @Get('live')
  @HealthCheck()
  liveness(): Promise<HealthCheckResult> {
    return this.health.check([
      () =>
        this.application.isHealthy(
          'application',
        ),
    ]);
  }

  @Get('ready')
  @HealthCheck()
  readiness(): Promise<HealthCheckResult> {
    return this.health.check([
      () =>
        this.application.isHealthy(
          'application',
        ),
    ]);
  }
}