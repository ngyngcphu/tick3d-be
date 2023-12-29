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
                model: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        DefaultModel: {
                            select: {
                                imageUrl: true
                            }
                        },
                        ModelPromotion: {
                            select: {
                                discount: true
                            }
                        }
                    }
                },
                quantity: true
            },
            where: {
                user_id
            }
        });

        return {
            total: cart.reduce((acc, { quantity }) => quantity + acc, 0),
            cart: cart.map((item) => ({
                discount: item.model.ModelPromotion?.discount,
                image: item.model.DefaultModel?.imageUrl,
                id: item.model.id,
                name: item.model.name,
                price: item.model.price,
                quantity: item.quantity
            }))
        };
    } catch (e) {
        return res.badRequest();
    }
};

const add: Handler<{ message: string }, { Body: AddCartInputDto }> = async (req, res) => {
    const user_id = req.userId;
    const { models } = req.body;

    try {
        await prisma.$transaction(async () => {
            const discontinuedModels = await prisma.defaultModel.findMany({
                where: {
                    model_id: {
                        in: models.map((model) => model.id)
                    },
                    isDiscontinued: true
                },
                select: {
                    model: { select: { name: true } }
                }
            });

            if (discontinuedModels.length > 0) {
                const discontinuedModelNames = discontinuedModels.map((model) => model.model.name).join(', ');
                throw new Error(`Cannot add discontinued models: ${discontinuedModelNames}`);
            }

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
        });
        return res.send({ message: 'Added successfully' });
    } catch (e) {
        console.error('Error adding to cart:', e);

        if (e.message.includes('Cannot add discontinued models')) {
            return res.badRequest(e.message);
        }

        return res.badRequest(ADD_CART_FAILED);
    }
};

const del: Handler<{ message: string }, { Body: DelCartInputDto }> = async (req, res) => {
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

        return { message: 'Deleted successfully' };
    } catch (e) {
        return res.badRequest(DELETE_CART_FAILED);
    }
};

const delAll: Handler<{ message: string }> = async (req) => {
    const user_id = req.userId;

    await prisma.cart.deleteMany({
        where: {
            user_id
        }
    });

    return { message: 'Reset cart successfully' };
};

export const cartHandler = {
    get,
    add,
    del,
    delAll
};
