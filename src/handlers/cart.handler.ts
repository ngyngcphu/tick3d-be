import { Handler } from '@interfaces';
import { AddCartInputDto } from '@dtos/in';
import { prisma } from '@repositories';
import { ADD_MODELS_FAILED } from '@constants';
import { GetCartResultDto } from 'src/dtos/out/getCart.dto';

const get: Handler<GetCartResultDto> = async (req, res) => {
    const user_id = req.userId;

    try {
        const cart = await prisma.cart.findMany({
            select: {
                model_id: true,
                model: {
                    select: {
                        id: true,
                        name: true,
                        price: true
                    }
                },
                quantity: true
            },
            where: {
                user_id
            }
        });

        return cart;
    } catch (e) {
        return res.badRequest();
    }
};

const add: Handler<string, { Body: AddCartInputDto }> = async (req, res) => {
    const user_id = req.userId;
    const { models } = req.body;

    try {
        await models.forEach((model) =>
            prisma.cart.upsert({
                create: {
                    model_id: model.id,
                    user_id: user_id,
                    quantity: model.quantity
                },
                update: {
                    quantity: model.quantity
                },
                where: {
                    user_id_model_id: {
                        model_id: model.id,
                        user_id: user_id
                    }
                }
            })
        );

        return 'Added successfully';
    } catch (e) {
        return res.badRequest(ADD_MODELS_FAILED);
    }
};

export const cartHandler = {
    get,
    add
};
