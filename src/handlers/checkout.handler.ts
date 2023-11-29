import { envs } from '@configs';
import { CompletePayPalOrderDto, CreateOrderInputDto, CreatePayPalOrderDto } from '@dtos/in';
import { CompletePaypalDto, CreateOrderResultDto, PaypalDto } from '@dtos/out';
import { Handler } from '@interfaces';
import { prisma } from '@repositories';
import { paypalService } from '@services';
import { logger } from '@utils';

const createOrderInDatabase: Handler<CreateOrderResultDto, { Body: CreateOrderInputDto }> = async (req, res) => {
    const userId = req.userId;
    const newOrder = await prisma.order.create({
        data: { ...req.body, user_id: userId, isPaid: false },
        select: {
            id: true
        }
    });

    const cardModels = await prisma.cart.findMany({
        where: {
            user_id: userId
        }
    });

    await Promise.all(
        cardModels.map(async (cardModel) => {
            await createOrderItem(newOrder.id, cardModel);
        })
    );

    return res.send({ id: newOrder.id });
};

async function createOrderItem(
    orderId: string,
    cardModel: {
        user_id: string;
        model_id: string;
        quantity: number;
    }
) {
    const model = await prisma.model.findFirst({
        where: { id: cardModel.model_id }
    });
    if (!model) throw new Error('Model not found');

    const defaultModel = await prisma.defaultModel.findFirst({
        where: { model_id: model.id }
    });

    const imageUrl = defaultModel ? defaultModel.imageUrl : '';

    await prisma.item.create({
        data: {
            model_id: model.id,
            order_id: orderId,
            name: model.name,
            gcode: model.gcode,
            quantity: cardModel.quantity,
            imageUrl: imageUrl
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
        const accessToken = await getPayPalAccessToken();

        const order = await prisma.order.findFirst({
            where: { id: req.body.orderId },
            select: {
                total_price: true
            }
        });

        if (!order) return res.badRequest('Order not found');

        const orderDataJson = {
            intent: req.body.intent.toUpperCase(),
            purchase_units: [
                {
                    amount: {
                        currency_code: 'USD',
                        value: (order.total_price * VNDToDollarsRatio).toString()
                    }
                }
            ]
        };
        const data = JSON.stringify(orderDataJson);

        const createOrderResponse = await paypalService.createOrder(`Bearer ${accessToken}`, data);

        const digitalOrderId = createOrderResponse.id;

        await prisma.order.update({ where: { id: req.body.orderId }, data: { digital_order_id: digitalOrderId } });

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

        const orderId = req.body.paypalOrderId;

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
        res.internalServerError();
    }
};

export const checkoutHandler = {
    createOrder: createOrderInDatabase,
    createPayPalOrder,
    completePayPalOrder
};
