import 'fastify';
import { UserRole } from '@prisma/client';

declare module 'fastify' {
    interface FastifyRequest {
        userId: string;
        role: UserRole;
    }
    interface FastifyInstance {
        start: () => Promise<void>;
        shutdown: () => Promise<void>;
    }
}
