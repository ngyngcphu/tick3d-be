import { invoke, paypalServer } from './common';

export const paypalService = {
    getAccessToken: (auth: string) => {
        const data = 'grant_type=client_credentials';
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: auth
        };

        return invoke<PaypalAccessTokenResponse>(paypalServer.post('/v1/oauth2/token', data, { headers }));
    },
    createOrder: (auth: string, data: string) => {
        const headers = {
            'Content-Type': 'application/json',
            Authorization: auth
        };

        return invoke<DetailPaypalOrderResponse>(paypalServer.post('/v2/checkout/orders', data, { headers }));
    },
    getInfoOrder: (auth: string, orderId: string) => {
        const headers = {
            Authorization: auth
        };

        return invoke<DetailPaypalOrderResponse>(paypalServer.post(`/v2/checkout/orders/${orderId}`, { headers }));
    },
    addTrackingInformation: (auth: string, orderId: string, data: string) => {
        const headers = {
            'Content-Type': 'application/json',
            Authorization: auth
        };

        return invoke<DetailPaypalOrderResponse>(paypalServer.post(`/v2/checkout/orders/${orderId}/track`, data, { headers }));
    },
    completeOrder: (auth: string, orderId: string, orderIntent: string) => {
        const headers = {
            'Content-Type': 'application/json',
            Authorization: auth,
            Prefer: 'return=representation'
        };

        return invoke<DetailPaypalOrderResponse>(paypalServer.post(`/v2/checkout/orders/${orderId}/${orderIntent}`, {}, { headers }));
    }
};
