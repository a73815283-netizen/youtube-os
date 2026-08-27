import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { requireAuthenticated } from '../auth/auth.middleware.js';
import { successResponse } from '../contracts/api.js';
import { MonetizationService } from './monetization-service.js';

const withdrawalSchema = z.object({
  amountUsdCents: z.number().int().positive(),
  destinationAddress: z.string().trim(),
  twoFactorConfirmed: z.boolean().default(false),
});

export function registerMonetizationRoutes(app: FastifyInstance, service = new MonetizationService()): void {
  app.get('/api/v1/monetization/status', async (request) => {
    const claims = requireAuthenticated(request);
    return successResponse(await service.status(claims.sub), request.correlationId);
  });
  app.get('/api/v1/monetization/withdrawals', async (request) => {
    const claims = requireAuthenticated(request);
    return successResponse({ withdrawals: service.history(claims.sub), auditEvents: service.audits(claims.sub) }, request.correlationId);
  });
  app.post<{ Body: unknown }>('/api/v1/monetization/withdrawals', async (request) => {
    const claims = requireAuthenticated(request);
    const input = withdrawalSchema.parse(request.body);
    return successResponse(await service.request({ ...input, userId: claims.sub }), request.correlationId);
  });
}
