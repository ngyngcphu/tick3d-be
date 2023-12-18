import { CategoryResult } from '@dtos/out';
import { Handler } from '@interfaces';
import { prisma } from '@repositories';

const get: Handler<CategoryResult> = async (__req, res) => {
    try {
        const cart = await prisma.category.findMany({
            select: { id: true, name: true }
        });

        return cart;
    } catch (e) {
        return res.badRequest();
    }
};

export const categoryHandler = {
    get
};
