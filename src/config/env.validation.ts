import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),

  PORT: Joi.number().port().default(3000),

  API_PREFIX: Joi.string().trim().default('api'),

  API_VERSION: Joi.string().pattern(/^\d+$/).default('1'),

  BODY_LIMIT: Joi.string()
    .pattern(/^\d+(kb|mb)$/i)
    .default('1mb'),

  CORS_ORIGINS: Joi.string().default('http://localhost:3000'),

  CORS_CREDENTIALS: Joi.boolean().default(false),

  TRUST_INCOMING_REQUEST_ID: Joi.boolean()
    .truthy('true')
    .falsy('false')
    .default(false),

  TRUST_PROXY: Joi.string().trim().allow('').default(''),

  RATE_LIMIT_TTL_MS: Joi.number().integer().positive().default(60_000),

  RATE_LIMIT_MAX: Joi.number().integer().positive().default(100),

  LOG_LEVEL: Joi.string()
    .valid('trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent')
    .optional(),

  APP_NAME: Joi.string().trim().default('backend-base'),

  APP_VERSION: Joi.string().trim().default('0.0.0'),
});
