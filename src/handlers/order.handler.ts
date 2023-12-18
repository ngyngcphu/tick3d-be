import { Handler } from '@interfaces';
import { OrderListResultDto, OrderResultDto } from '@dtos/out';
import { prisma } from '@repositories';
import { USER_NOT_FOUND, ORDER_NOT_FOUND } from '@constants';
import { UserRole } from '@prisma/client';

const getOrderById: Handler<OrderResultDto, { Params: { orderId: string } }> = async (req, res) => {
    const userId = req.userId;

    const user = await prisma.user.findFirst({
        select: {
            role: true
        },
        where: {
            id: userId
        }
    });

    if (!user) {
        return res.badRequest(USER_NOT_FOUND);
    }

    const order = await prisma.order.findFirst({
        select: {
            creation_time: true,
            digital_order_id: true,
            district: true,
            est_deli_time: true,
            extra_note: true,
            isPaid: true,
            shipping_fee: true,
            status: true,
            street: true,
            streetNo: true,
            total_price: true,
            ward: true
        },
        where: {
            id: req.params.orderId,
            user_id: user.role === UserRole.MANAGER ? undefined : userId
        }
    });

    if (!order) {
        return res.notFound(ORDER_NOT_FOUND);
    }

    return {
        creationTime: order.creation_time.toISOString(),
        digitalOrderId: order.digital_order_id || undefined,
        district: order.district,
        estimatedDeliveryTime: order.est_deli_time.toISOString(),
        id: req.params.orderId,
        isPaid: order.isPaid,
        shippingFee: order.shipping_fee,
        status: order.status,
        street: order.street,
        streetNo: order.streetNo,
        totalPrice: order.total_price,
        ward: order.ward,
        note: order.extra_note || undefined,
        userId
    };
};

const getOrders: Handler<OrderListResultDto> = async (req, res) => {
    const userId = req.userId;

    const user = await prisma.user.findFirst({
        select: {
            role: true
        },
        where: {
            id: userId
        }
    });

    if (!user) {
        return res.badRequest(USER_NOT_FOUND);
    }

    const orders = await prisma.order.findMany({
        select: {
            id: true,
            user_id: true,
            creation_time: true,
            digital_order_id: true,
            district: true,
            est_deli_time: true,
            extra_note: true,
            isPaid: true,
            shipping_fee: true,
            status: true,
            street: true,
            streetNo: true,
            total_price: true,
            ward: true
        },
        where: {
            user_id: user.role === UserRole.MANAGER ? undefined : userId
        }
    });

    return orders.map((order) => ({
        creationTime: order.creation_time.toISOString(),
        digitalOrderId: order.digital_order_id || undefined,
        district: order.district,
        estimatedDeliveryTime: order.est_deli_time.toISOString(),
        id: order.id,
        isPaid: order.isPaid,
        shippingFee: order.shipping_fee,
        status: order.status,
        street: order.street,
        streetNo: order.streetNo,
        totalPrice: order.total_price,
        ward: order.ward,
        note: order.extra_note || undefined,
        userId: order.user_id
    }));
};

export const ordersHandler = {
    getOrderById,
    getOrders
};
