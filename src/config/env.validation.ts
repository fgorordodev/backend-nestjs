import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'test', 'production')
        .default('development'),

    PORT: Joi.number()
        .port()
        .default(3000),

    API_PREFIX: Joi.string()
        .trim()
        .default('api'),

    API_VERSION: Joi.string()
        .pattern(/^\d+$/)
        .default('1'),


    BODY_LIMIT: Joi.string()
        .pattern(/^\d+(kb|mb)$/i)
        .default('1mb'),

    CORS_ORIGINS: Joi.string()
        .default('http://localhost:3000'),

    CORS_CREDENTIALS: Joi.boolean()
        .default(false),

    TRUST_INCOMING_REQUEST_ID: Joi.boolean()
        .truthy('true')
        .falsy('false')
        .default(false),
});