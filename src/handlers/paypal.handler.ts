import { envs } from '@configs';
import { CompletePayPalOrderDto, CreatePayPalOrderDto } from '@dtos/in';
import { CompletePaypalDto, PaypalDto } from '@dtos/out';
import { Handler } from '@interfaces';
import { paypalService } from '@services';
import { logger } from '@utils';

async function getPayPalAccessToken() {
    const auth = `${envs.PAYPAL_CLIENT_ID}:${envs.PAYPAL_CLIENT_SECRET}`;
    const tokenResponse = await paypalService.getAccessToken(`Basic ${Buffer.from(auth).toString('base64')}`);
    return tokenResponse.access_token;
}

const createPayPalOrder: Handler<PaypalDto, { Body: CreatePayPalOrderDto }> = async (req, res) => {
    try {
        const accessToken = await getPayPalAccessToken();

        const VNDToDollarsRatio = 0.000041;

        const orderDataJson = {
            intent: req.body.intent.toUpperCase(),
            purchase_units: [
                {
                    amount: {
                        currency_code: 'USD',
                        value: (req.body.total_price * VNDToDollarsRatio).toString()
                    }
                }
            ]
        };
        const data = JSON.stringify(orderDataJson);

        const createOrderResponse = await paypalService.createOrder(`Bearer ${accessToken}`, data);

        const orderId = createOrderResponse.id;

        return res.send({ id: orderId });
    } catch (err) {
        logger.error(err);
        res.internalServerError();
    }
};

const completePayPalOrder: Handler<CompletePaypalDto, { Body: CompletePayPalOrderDto }> = async (req, res) => {
    try {
        const accessToken = await getPayPalAccessToken();

        const completeOrderResponse = await paypalService.completeOrder(
            `Bearer ${accessToken}`,
            req.body.orderId,
            req.body.intent.toLowerCase()
        );

        const amountMoney = Number(
            completeOrderResponse.purchase_units ? completeOrderResponse.purchase_units[0].payments.captures[0].amount.value : 0
        );

        return res.send({ id: completeOrderResponse.id, amountMoney });
    } catch (err) {
        logger.error(err);
        res.internalServerError();
    }
};

export const coinHandler = {
    createPayPalOrder,
    completePayPalOrder
};
