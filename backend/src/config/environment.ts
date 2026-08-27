import { z } from 'zod';

const optionalUrl = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z.string().url().optional(),
);

const optionalNonEmpty = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z.string().min(1).optional(),
);

const defaultDatabaseUrl = 'postgresql://localhost:5432/youtube_os';

const environmentSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(3100),
    HOST: z.string().min(1).default('0.0.0.0'),
    DATABASE_URL: z.preprocess(
      (value) => (value === '' || value === undefined ? defaultDatabaseUrl : value),
      z
        .string()
        .min(1)
        .refine((value) => /^postgres(?:ql)?:\/\//.test(value), 'DATABASE_URL must use PostgreSQL'),
    ),
    CORS_ORIGIN: z.string().min(1).default('http://localhost:5174'),
    REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().max(120_000).default(10_000),
    JWT_SECRET: z.string().min(32).optional(),
    JWT_EXPIRES_IN: z.string().regex(/^\d+[smhd]$/).default('7d'),
    JWT_REFRESH_EXPIRES_IN: z.string().regex(/^\d+[smhd]$/).default('30d'),
    AUTH_BOOTSTRAP_ADMIN_EMAIL: z.string().email().default('admin@youtubeos.local'),
    AUTH_BOOTSTRAP_ADMIN_PASSWORD: z.string().min(12).optional(),
    REDIS_URL: optionalUrl,
    CACHE_WARMING_ENABLED: z.coerce.boolean().default(true),
    CACHE_WARMING_INTERVAL_SECONDS: z.coerce.number().int().min(60).max(3_600).refine((value) => value % 60 === 0, 'CACHE_WARMING_INTERVAL_SECONDS must be a whole number of minutes').default(900),
    CACHE_WARMING_MAX_ITEMS: z.coerce.number().int().min(1).max(1_000).default(100),
    CACHE_WARMING_RETRY_ATTEMPTS: z.coerce.number().int().min(1).max(5).default(3),
    GLOBAL_ECOSYSTEM_BASE_URL: optionalUrl,
    GLOBAL_ECOSYSTEM_CLIENT_ID: optionalNonEmpty,
    GLOBAL_ECOSYSTEM_CLIENT_SECRET: optionalNonEmpty,
    GLOBAL_ECOSYSTEM_TIMEOUT_MS: z.coerce.number().int().positive().max(60_000).default(5_000),
    GLOBAL_ECOSYSTEM_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(2),
    YOUTUBE_API_KEY: optionalNonEmpty,
    YOUTUBE_CLIENT_ID: optionalNonEmpty,
    YOUTUBE_CLIENT_SECRET: optionalNonEmpty,
    YOUTUBE_ACCESS_TOKEN: optionalNonEmpty,
    YOUTUBE_REFRESH_TOKEN: optionalNonEmpty,
    TRANSLATION_PROVIDER: z.enum(['mock', 'openai', 'google']).default('mock'),
    TRANSLATION_CACHE_TTL_SECONDS: z.coerce.number().int().min(60).max(604_800).default(86_400),
    OPENAI_API_KEY: optionalNonEmpty,
    OPENAI_TRANSLATION_MODEL: z.string().min(1).default('gpt-4o-mini'),
    GOOGLE_TRANSLATE_API_KEY: optionalNonEmpty,
    MONETIZATION_MODE: z.enum(['sandbox', 'production']).default('sandbox'),
    CIRCLE_API_KEY: optionalNonEmpty,
    CIRCLE_ENTITY_SECRET: optionalNonEmpty,
    KYC_AML_API_KEY: optionalNonEmpty,
  })
  .superRefine((config, context) => {
    const hasClientId = Boolean(config.GLOBAL_ECOSYSTEM_CLIENT_ID);
    const hasClientSecret = Boolean(config.GLOBAL_ECOSYSTEM_CLIENT_SECRET);

    if (hasClientId !== hasClientSecret) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['GLOBAL_ECOSYSTEM_CLIENT_ID'],
        message: 'Global Ecosystem client ID and secret must be configured together',
      });
    }
    if (config.NODE_ENV === 'production' && !config.JWT_SECRET) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['JWT_SECRET'],
        message: 'JWT_SECRET is required in production',
      });
    }
    if (config.NODE_ENV === 'production' && !config.AUTH_BOOTSTRAP_ADMIN_PASSWORD) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['AUTH_BOOTSTRAP_ADMIN_PASSWORD'],
        message: 'AUTH_BOOTSTRAP_ADMIN_PASSWORD is required in production',
      });
    }
    const hasYoutubeClientId = Boolean(config.YOUTUBE_CLIENT_ID);
    const hasYoutubeClientSecret = Boolean(config.YOUTUBE_CLIENT_SECRET);
    const hasYoutubeToken = Boolean(config.YOUTUBE_ACCESS_TOKEN);
    const hasYoutubeRefreshToken = Boolean(config.YOUTUBE_REFRESH_TOKEN);
    if (hasYoutubeClientId !== hasYoutubeClientSecret) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['YOUTUBE_CLIENT_ID'],
        message: 'YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET must be configured together',
      });
    }
    if (hasYoutubeToken && !hasYoutubeClientId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['YOUTUBE_CLIENT_ID'],
        message: 'YOUTUBE_CLIENT_ID is required when YOUTUBE_ACCESS_TOKEN is configured',
      });
    }
    if (hasYoutubeRefreshToken !== hasYoutubeClientId && hasYoutubeRefreshToken) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['YOUTUBE_REFRESH_TOKEN'],
        message: 'YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET are required when YOUTUBE_REFRESH_TOKEN is configured',
      });
    }

    if (config.TRANSLATION_PROVIDER === 'openai' && !config.OPENAI_API_KEY) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['OPENAI_API_KEY'],
        message: 'OPENAI_API_KEY is required when TRANSLATION_PROVIDER=openai',
      });
    }

    if (config.TRANSLATION_PROVIDER === 'google' && !config.GOOGLE_TRANSLATE_API_KEY) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['GOOGLE_TRANSLATE_API_KEY'],
        message: 'GOOGLE_TRANSLATE_API_KEY is required when TRANSLATION_PROVIDER=google',
      });
    }
    if (config.MONETIZATION_MODE === 'production' && (!config.CIRCLE_API_KEY || !config.CIRCLE_ENTITY_SECRET || !config.KYC_AML_API_KEY)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['MONETIZATION_MODE'],
        message: 'Production monetization requires Circle and KYC/AML credentials.',
      });
    }
  });

export type EnvironmentConfig = z.infer<typeof environmentSchema>;

export class EnvironmentValidationError extends Error {
  constructor(readonly issues: z.ZodIssue[]) {
    super(issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; '));
    this.name = 'EnvironmentValidationError';
  }
}

export function getJwtSecret(config: EnvironmentConfig): string {
  return config.JWT_SECRET ?? 'development-only-jwt-secret-must-be-replaced';
}

export function getBootstrapAdminCredentials(config: EnvironmentConfig): { email: string; password: string } {
  return {
    email: config.AUTH_BOOTSTRAP_ADMIN_EMAIL,
    password: config.AUTH_BOOTSTRAP_ADMIN_PASSWORD ?? 'ChangeMeAdminPassword!',
  };
}

export function loadEnvironment(
  source: Record<string, string | undefined> = process.env,
): EnvironmentConfig {
  const result = environmentSchema.safeParse(source);
  if (!result.success) {
    throw new EnvironmentValidationError(result.error.issues);
  }
  return result.data;
}

export function isGlobalEcosystemConfigured(config: EnvironmentConfig): boolean {
  return Boolean(
    config.GLOBAL_ECOSYSTEM_BASE_URL &&
      config.GLOBAL_ECOSYSTEM_CLIENT_ID &&
      config.GLOBAL_ECOSYSTEM_CLIENT_SECRET,
  );
}
