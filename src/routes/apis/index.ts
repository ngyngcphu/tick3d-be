import { verifyToken } from 'src/hooks';
import { FastifyInstance } from 'fastify';
import { userPlugin } from './user.plugin';
import { CheckoutPlugin } from './checkout.plugin';
import { cartPlugin } from './cart.plugin';
import { homePlugin } from './home';

export async function apiPlugin(app: FastifyInstance) {
    app.addHook('onRequest', verifyToken);
    app.register(userPlugin, { prefix: '/user' });
    app.register(CheckoutPlugin, { prefix: '/checkout' });
    app.register(cartPlugin, { prefix: '/cart' });
    app.register(homePlugin, { prefix: '/home' });
}
