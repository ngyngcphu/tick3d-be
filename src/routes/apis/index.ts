import { verifyToken } from 'src/hooks';
import { FastifyInstance } from 'fastify';
import { userPlugin } from './user.plugin';
import { CheckoutPlugin } from './paypal.plugin';

export async function apiPlugin(app: FastifyInstance) {
    app.addHook('onRequest', verifyToken);
    app.register(userPlugin, { prefix: '/user' });
    app.register(CheckoutPlugin, { prefix: '/checkout' });
}
