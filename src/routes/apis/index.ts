import { FastifyInstance } from 'fastify';
import { userPlugin } from './user.plugin';
import { cartPlugin } from './cart.plugin';
import { userModelPlugin } from './userModel.plugin';
import { defaultModelPlugin } from './defaultModel.plugin';

export async function apiPlugin(app: FastifyInstance) {
    app.register(userPlugin, { prefix: '/user' });
    app.register(cartPlugin, { prefix: '/cart' });
    app.register(defaultModelPlugin, { prefix: '/defaultModel' });
    app.register(userModelPlugin, { prefix: '/userModel' });
}
