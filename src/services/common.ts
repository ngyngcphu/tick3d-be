import { PAYPAL_ENDPOINT } from '@configs';
import axios, { AxiosError, AxiosResponse } from 'axios';

export const paypalServer = axios.create({
    baseURL: PAYPAL_ENDPOINT,
    withCredentials: true
});

export async function invoke<R = unknown, D = unknown>(call: Promise<AxiosResponse<R, D>>) {
    try {
        const response = await call;
        return response.data;
    } catch (err) {
        const e = err as AxiosError;
        const errPayload = e.response?.data ? (e.response.data as ResponseError) : e;
        throw errPayload;
    }
}
