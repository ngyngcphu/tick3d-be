import { verifyToken } from 'src/hooks';
import { FastifyInstance } from 'fastify';
import { userPlugin } from './user.plugin';
import { cartPlugin } from './cart.plugin';

export async function apiPlugin(app: FastifyInstance) {
    app.addHook('onRequest', verifyToken);
    app.register(userPlugin, { prefix: '/user' });
    app.register(cartPlugin, { prefix: '/cart' });
}
