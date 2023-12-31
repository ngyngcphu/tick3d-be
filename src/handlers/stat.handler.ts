import { CategoryStatResultDto, JoinedUserStatResultDto, RevenueStatResultDto, UploadedUserModelStatResultDto } from '@dtos/out';
import { Handler } from '@interfaces';
import { prisma } from '@repositories';
import { JoinedUserStatQuerystringDto, RevenueStatQuerystringDto, UploadedUserModelStatQuerystringDto } from 'src/dtos/in/stat.dto';

const noByCategory: Handler<CategoryStatResultDto> = async () => {
    const cats = await prisma.defaultModel.groupBy({
        by: 'category_id',
        _count: true
    });

    return cats.map((cat) => ({
        count: cat._count,
        id: cat.category_id
    }));
};

const joinedUsers: Handler<JoinedUserStatResultDto, { Querystring: JoinedUserStatQuerystringDto }> = async (req) => {
    const { start: _start, end: _end, interval, unit } = req.query;
    const start = new Date(_start);
    const end = new Date(_end);

    const totalUsers = await prisma.user.count({
        where: {
            joinedAt: {
                lt: start
            }
        }
    });
    const newUsers = await prisma.user.findMany({
        select: {
            joinedAt: true
        },
        where: {
            joinedAt: {
                gte: start,
                lt: end
            }
        },
        orderBy: {
            joinedAt: 'asc'
        }
    });

    const intervalList: { start: Date; end: Date; old: number; new: number }[] = [];

    for (let i = start; i < end; ) {
        const old_i = new Date(i);
        const new_i = i;
        if (unit === 'day') {
            new_i.setDate(new_i.getDate() + interval);
        } else {
            new_i.setMonth(new_i.getMonth() + interval);
        }
        intervalList.push({ start: new Date(old_i), end: new Date(new_i), old: 0, new: 0 });
        i = new Date(new_i);
    }

    for (const user of newUsers) {
        const { joinedAt } = user;
        const interval = intervalList.find(({ start, end }) => start <= joinedAt && joinedAt < end)!;
        ++interval.new;
    }

    let oldUsers = totalUsers;
    for (const interval of intervalList) {
        interval.old = oldUsers;
        oldUsers = interval.old + interval.new;
    }

    return intervalList.map((interval) => ({
        start: interval.start.toDateString(),
        end: interval.end.toDateString(),
        old: interval.old,
        new: interval.new
    }));
};

const uploadedUserModelCount: Handler<UploadedUserModelStatResultDto, { Querystring: UploadedUserModelStatQuerystringDto }> = async (
    req
) => {
    const { start: _start, end: _end, interval, unit } = req.query;
    const start = new Date(_start);
    const end = new Date(_end);

    const newModels = await prisma.uploadedModel.findMany({
        select: {
            model: {
                select: {
                    uploadTime: true
                }
            }
        },
        where: {
            model: {
                uploadTime: {
                    gte: start,
                    lt: end
                }
            }
        },
        orderBy: {
            model: {
                uploadTime: 'asc'
            }
        }
    });

    const intervalList: { start: Date; end: Date; count: number }[] = [];

    for (let i = start; i < end; ) {
        const old_i = new Date(i);
        const new_i = i;
        if (unit === 'day') {
            new_i.setDate(new_i.getDate() + interval);
        } else {
            new_i.setMonth(new_i.getMonth() + interval);
        }
        intervalList.push({ start: new Date(old_i), end: new Date(new_i), count: 0 });
        i = new Date(new_i);
    }

    for (const model of newModels) {
        const {
            model: { uploadTime }
        } = model;
        const interval = intervalList.find(({ start, end }) => start <= uploadTime && uploadTime < end)!;
        ++interval.count;
    }

    return intervalList.map((interval) => ({
        start: interval.start.toDateString(),
        end: interval.end.toDateString(),
        count: interval.count
    }));
};

const revenue: Handler<RevenueStatResultDto, { Querystring: RevenueStatQuerystringDto }> = async (req) => {
    const { start: _start, end: _end, interval, unit } = req.query;
    const start = new Date(_start);
    const end = new Date(_end);

    const newOrders = await prisma.order.findMany({
        select: {
            total_price: true,
            creation_time: true
        },
        where: {
            creation_time: {
                lte: start,
                gt: end
            }
        },
        orderBy: {
            creation_time: 'asc'
        }
    });

    const intervalList: { start: Date; end: Date; total: number }[] = [];

    for (let i = start; i < end; ) {
        const old_i = new Date(i);
        const new_i = i;
        if (unit === 'day') {
            new_i.setDate(new_i.getDate() + interval);
        } else {
            new_i.setMonth(new_i.getMonth() + interval);
        }
        intervalList.push({ start: new Date(old_i), end: new Date(new_i), total: 0 });
        i = new Date(new_i);
    }

    for (const order of newOrders) {
        const { creation_time, total_price } = order;
        const interval = intervalList.find(({ start, end }) => start <= creation_time && creation_time < end)!;
        interval.total += total_price;
    }

    return intervalList.map((interval) => ({
        start: interval.start.toDateString(),
        end: interval.end.toDateString(),
        total: interval.total
    }));
};

export const statHandler = {
    noByCategory,
    joinedUsers,
    uploadedUserModelCount,
    revenue
};
