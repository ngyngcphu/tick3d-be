import { UPDATE_MODEL_FAILED, MODEL_NOT_FOUND, DELETE_MODEL_FAILED } from '@constants';
import { UploadUserModelInputDto, UpdateUserModelInputDto } from '@dtos/in';
import { UserModelListResultDto, UserModelResultDto } from '@dtos/out';
import { Handler } from '@interfaces';
import { UserRole } from '@prisma/client';
import { prisma } from '@repositories';
import { estimatePrice } from '@utils';
import { UserModelQueryStringDto } from '@dtos/in';

const getAll: Handler<UserModelListResultDto, { Querystring: UserModelQueryStringDto }> = async (req) => {
    const user_id = req.userId;

    const user = await prisma.user.findFirst({
        select: {
            role: true
        },
        where: {
            id: user_id
        }
    });

    try {
        const userModels = await prisma.uploadedModel.findMany({
            select: {
                model_id: true,
                model: {
                    select: {
                        name: true,
                        price: true,
                        uploadTime: true
                    }
                }
            },
            where: {
                user_id: user?.role === UserRole.CUSTOMER ? user_id : undefined,
                model: {
                    name: {
                        contains: req.query.keyword,
                        mode: 'insensitive'
                    },
                    uploadTime: {
                        gt: req.query.uploaded_after && new Date(req.query.uploaded_after),
                        lt: req.query.uploaded_before && new Date(req.query.uploaded_before)
                    }
                }
            },
            orderBy: {
                model: {
                    uploadTime: req.query.orderBy === 'uploadedTime' ? req.query.order || 'desc' : undefined,
                    price: req.query.orderBy === 'price' ? req.query.order || 'asc' : undefined,
                    name: req.query.orderBy === 'name' ? req.query.order || 'asc' : undefined
                }
            },
            skip: req.query.start,
            take: req.query.noItems
        });

        return userModels.map((model) => ({
            id: model.model_id,
            name: model.model.name,
            price: model.model.price,
            uploadTime: model.model.uploadTime.toISOString()
        }));
    } catch (e) {
        return [];
    }
};

const get: Handler<UserModelResultDto, { Params: { id: string } }> = async (req, res) => {
    const userId = req.userId;
    const { id } = req.params;

    const model = await prisma.uploadedModel.findFirst({
        select: {
            model_id: true,
            model: {
                select: {
                    name: true,
                    price: true,
                    uploadTime: true,
                    gcode: true
                }
            }
        },
        where: {
            model_id: id,
            user_id: userId
        }
    });

    if (model === null) {
        return res.notFound(MODEL_NOT_FOUND);
    }

    return {
        id: model.model_id,
        name: model.model.name,
        price: model.model.price,
        uploadTime: model.model.uploadTime.toISOString(),
        gcode: model.model.gcode
    };
};

const upload: Handler<UserModelListResultDto, { Body: UploadUserModelInputDto }> = async (req, res) => {
    const userId = req.userId;
    const outputList: UserModelListResultDto = [];
    const inputList = req.body;

    try {
        await Promise.all(
            inputList.map(async (input) => {
                const model = await prisma.model.create({
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        uploadTime: true
                    },
                    data: {
                        gcode: input.gcode,
                        name: input.name,
                        price: estimatePrice(input.gcode),
                        description: input.description || ''
                    }
                });
                await prisma.uploadedModel.create({
                    data: {
                        user_id: userId,
                        model_id: model.id
                    }
                });
                outputList.push({
                    ...model,
                    uploadTime: model.uploadTime.toISOString()
                });
            })
        );
    } catch (e) {
        return res.internalServerError('Failed to add some models');
    }

    return outputList;
};

const del: Handler<{ message: string }, { Params: { id: string } }> = async (req, res) => {
    const userId = req.userId;
    const { id } = req.params;

    try {
        await prisma.uploadedModel.delete({
            where: {
                user_id: userId,
                model_id: id
            }
        });
        await prisma.model.delete({
            where: {
                id
            }
        });
    } catch (e) {
        return res.internalServerError(DELETE_MODEL_FAILED);
    }

    return { message: 'Delete succesfully' };
};

const update: Handler<{ message: string }, { Params: { id: string }; Body: UpdateUserModelInputDto }> = async (req, res) => {
    const userId = req.userId;
    const { id } = req.params;
    const { gcode, name, price } = req.body;
    try {
        const userModel = await prisma.uploadedModel.findFirst({
            where: {
                user_id: userId,
                model_id: id
            }
        });
        if (userModel === null) {
            return res.notFound(MODEL_NOT_FOUND);
        }
        await prisma.model.update({
            data: {
                gcode,
                price,
                name
            },
            where: {
                id
            }
        });
    } catch (e) {
        return res.internalServerError(UPDATE_MODEL_FAILED);
    }

    return { message: 'Update succesfully' };
};

export const userModelHandler = {
    get,
    getAll,
    upload,
    delete: del,
    update
};
