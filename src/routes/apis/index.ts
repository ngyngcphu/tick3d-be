import { FastifyInstance } from 'fastify';
import { userPlugin } from './user.plugin';
import { CheckoutPlugin } from './checkout.plugin';
import { cartPlugin } from './cart.plugin';
import { userModelPlugin } from './userModel.plugin';
import { defaultModelPlugin } from './defaultModel.plugin';
import { homePlugin } from './home';
import { orderPlugin } from './order.plugin';

export async function apiPlugin(app: FastifyInstance) {
    app.register(userPlugin, { prefix: '/user' });
    app.register(CheckoutPlugin, { prefix: '/checkout' });
    app.register(cartPlugin, { prefix: '/cart' });
    app.register(defaultModelPlugin, { prefix: '/model' });
    app.register(userModelPlugin, { prefix: '/userModel' });
    app.register(homePlugin, { prefix: '/home' });
    app.register(orderPlugin, { prefix: '/order' });
}
