import { Handler } from '@interfaces';
import { AddCartInputDto, DelCartInputDto } from '@dtos/in';
import { prisma } from '@repositories';
import { ADD_CART_FAILED, DELETE_CART_FAILED } from '@constants';
import { GetCartResultDto } from '@dtos/out';

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
        await Promise.all(
            models.map((model) =>
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
            )
        );

        return 'Added successfully';
    } catch (e) {
        return res.badRequest(ADD_CART_FAILED);
    }
};

const del: Handler<string, { Body: DelCartInputDto }> = async (req, res) => {
    const user_id = req.userId;
    const { models } = req.body;

    try {
        await Promise.all(
            models.map((model_id) =>
                prisma.cart.delete({
                    where: {
                        user_id_model_id: {
                            model_id,
                            user_id
                        }
                    }
                })
            )
        );

        return 'Deleted successfully';
    } catch (e) {
        return res.badRequest(DELETE_CART_FAILED);
    }
};

const delAll: Handler<string> = async (req) => {
    const user_id = req.userId;

    await prisma.cart.deleteMany({
        where: {
            user_id
        }
    });

    return 'Reset cart successfully';
};

export const cartHandler = {
    get,
    add,
    del,
    delAll
};
