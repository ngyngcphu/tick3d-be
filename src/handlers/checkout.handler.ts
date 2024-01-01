import { envs } from '@configs';
import { CompletePayPalOrderDto, CreateOrderInputDto, CreatePayPalOrderDto } from '@dtos/in';
import { CompletePaypalDto, CreateOrderResultDto, PaypalDto } from '@dtos/out';
import { Handler } from '@interfaces';
import { prisma } from '@repositories';
import { paypalService } from '@services';
import { estimatedDeliveryTime, logger, estimateShippingFee } from '@utils';

const createOrderInDatabase: Handler<CreateOrderResultDto, { Body: CreateOrderInputDto }> = async (req, res) => {
    try {
        const userId = req.userId;
        const orderInfo = req.body;
        const newOrder = await prisma.$transaction(async () => {
            const cartModels = await prisma.cart.findMany({
                select: {
                    user_id: true,
                    model_id: true,
                    quantity: true,
                    model: {
                        select: {
                            price: true,
                            ModelPromotion: {
                                select: {
                                    discount: true
                                }
                            }
                        }
                    }
                },
                where: {
                    user_id: userId
                }
            });

            const order = await prisma.order.create({
                data: {
                    user_id: userId,
                    total_price: cartModels
                        .map((model) => model.model.price * model.quantity * (1 - (model.model.ModelPromotion?.discount || 0)))
                        .reduce((acc, cur) => acc + cur, 0),
                    shipping_fee: estimateShippingFee(orderInfo),
                    est_deli_time: estimatedDeliveryTime(orderInfo),
                    district: orderInfo.district,
                    ward: orderInfo.ward,
                    street: orderInfo.street,
                    streetNo: orderInfo.streetNo,
                    extra_note: orderInfo.extra_note,
                    isPaid: false
                },
                select: {
                    id: true
                }
            });

            await Promise.all(
                cartModels.map(async (cartModel) => {
                    await createOrderItem(order.id, cartModel);
                })
            );

            return order;
        });

        await prisma.cart.deleteMany({
            where: {
                user_id: userId
            }
        });

        return res.send({ id: newOrder.id });
    } catch (error) {
        res.internalServerError('Failed to create the order. Please try again later.');
        throw error;
    }
};

async function createOrderItem(
    orderId: string,
    cartModel: {
        user_id: string;
        model_id: string;
        quantity: number;
    }
) {
    const model = await prisma.model.findFirst({
        where: { id: cartModel.model_id }
    });
    if (!model) throw new Error('Model not found');

    const defaultModel = await prisma.defaultModel.findFirst({
        where: { model_id: model.id }
    });
    if (defaultModel?.isDiscontinued) throw new Error('Default model discontinued');

    const imageUrl = defaultModel ? defaultModel.imageUrl : '';

    await prisma.item.create({
        data: {
            model_id: model.id,
            order_id: orderId,
            name: model.name,
            gcode: model.gcode,
            quantity: cartModel.quantity,
            imageUrl
        }
    });
}

const VNDToDollarsRatio = 0.000041;

async function getPayPalAccessToken() {
    const auth = `${envs.PAYPAL_CLIENT_ID}:${envs.PAYPAL_CLIENT_SECRET}`;
    const tokenResponse = await paypalService.getAccessToken(`Basic ${Buffer.from(auth).toString('base64')}`);
    return tokenResponse.access_token;
}

const createPayPalOrder: Handler<PaypalDto, { Body: CreatePayPalOrderDto }> = async (req, res) => {
    try {
        const userId = req.userId;
        const orderInfo = req.body.orderInfo;

        const digitalOrderId = await prisma.$transaction(async () => {
            const cartModels = await prisma.cart.findMany({
                select: {
                    user_id: true,
                    model_id: true,
                    quantity: true,
                    model: {
                        select: {
                            price: true,
                            ModelPromotion: {
                                select: {
                                    discount: true
                                }
                            }
                        }
                    }
                },
                where: {
                    user_id: userId
                }
            });

            const order = await prisma.order.create({
                data: {
                    user_id: userId,
                    total_price: cartModels
                        .map((model) => model.model.price * model.quantity * (1 - (model.model.ModelPromotion?.discount || 0)))
                        .reduce((acc, cur) => acc + cur, 0),
                    shipping_fee: estimateShippingFee(orderInfo),
                    est_deli_time: estimatedDeliveryTime(orderInfo),
                    district: orderInfo.district,
                    ward: orderInfo.ward,
                    street: orderInfo.street,
                    streetNo: orderInfo.streetNo,
                    extra_note: orderInfo.extra_note,
                    isPaid: false
                },
                select: {
                    id: true,
                    total_price: true
                }
            });

            await Promise.all(
                cartModels.map(async (cartModel) => {
                    await createOrderItem(order.id, cartModel);
                })
            );

            const accessToken = await getPayPalAccessToken();

            const orderDataJson = {
                intent: req.body.intent.toUpperCase(),
                purchase_units: [
                    {
                        amount: {
                            currency_code: 'USD',
                            value: (order.total_price * VNDToDollarsRatio).toFixed(2)
                        }
                    }
                ]
            };
            const data = JSON.stringify(orderDataJson);

            const createOrderResponse = await paypalService.createOrder(`Bearer ${accessToken}`, data);

            const digitalOrderId = createOrderResponse.id;

            const { digital_order_id } = await prisma.order.update({ where: { id: order.id }, data: { digital_order_id: digitalOrderId } });

            return digital_order_id;
        });
        await prisma.cart.deleteMany({
            where: {
                user_id: userId
            }
        });

        return res.send({ id: digitalOrderId });
    } catch (err) {
        logger.error(err);
        res.internalServerError();
    }
};

async function increaseModelBoughtAmount(orderId: string) {
    const items = await prisma.item.findMany({
        where: {
            order_id: orderId
        }
    });

    await Promise.all(
        items.map(async (item) => {
            await prisma.model.update({
                where: { id: item.model_id },
                data: {
                    boughtAmount: { increment: item.quantity }
                }
            });
        })
    );
}

const completePayPalOrder: Handler<CompletePaypalDto, { Body: CompletePayPalOrderDto }> = async (req, res) => {
    try {
        const accessToken = await getPayPalAccessToken();

        const digitalOrderId = req.body.paypalOrderId;

        const orders = await prisma.order.findMany({
            where: {
                digital_order_id: digitalOrderId
            }
        });

        const orderId = orders[0].id;

        const completeOrderResponse = await paypalService.completeOrder(
            `Bearer ${accessToken}`,
            req.body.paypalOrderId,
            req.body.intent.toLowerCase()
        );

        const amountMoney = Number(
            completeOrderResponse.purchase_units ? completeOrderResponse.purchase_units[0].payments.captures[0].amount.value : 0
        );

        await prisma.order.update({
            where: { id: orderId },
            data: {
                isPaid: true
            }
        });

        await increaseModelBoughtAmount(orderId);

        return res.send({ id: completeOrderResponse.id, amountMoney });
    } catch (err) {
        logger.error(err);
        await prisma.order.deleteMany({
            where: {
                digital_order_id: req.body.paypalOrderId
            }
        });
        res.internalServerError();
    }
};

export const checkoutHandler = {
    createOrder: createOrderInDatabase,
    createPayPalOrder,
    completePayPalOrder
};
