import { UPDATE_MODEL_FAILED, MODEL_NOT_FOUND, DELETE_MODEL_FAILED } from '@constants';
import { UploadUserModelInputDto } from '@dtos/in';
import { UserModelListResultDto, UserModelResultDto } from '@dtos/out';
import { Handler } from '@interfaces';
import { UserRole } from '@prisma/client';
import { prisma } from '@repositories';
import { UpdateUserModelInputDto } from 'src/dtos/in/updateUserModel.dto';
import { estimatePrice } from 'src/utils/estimatePrice';

const getAll: Handler<UserModelListResultDto> = async (req) => {
    const user_id = req.userId;

    const user = await prisma.user.findFirst({
        select: {
            role: true
        },
        where: {
            id: user_id
        }
    });

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
            user_id: user?.role === UserRole.CUSTOMER ? user_id : undefined
        }
    });

    return userModels.map((model) => ({
        id: model.model_id,
        name: model.model.name,
        price: model.model.price,
        uploadTime: model.model.uploadTime.toISOString()
    }));
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
        return res.badRequest('Failed to add some models');
    }

    return outputList;
};

const del: Handler<string, { Params: { id: string } }> = async (req, res) => {
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
        return res.badRequest(DELETE_MODEL_FAILED);
    }

    return 'Delete succesfully';
};

const update: Handler<string, { Params: { id: string }; Body: UpdateUserModelInputDto }> = async (req, res) => {
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
        return res.badRequest(UPDATE_MODEL_FAILED);
    }

    return 'Update succesfully';
};

export const userModelHandler = {
    get,
    getAll,
    upload,
    delete: del,
    update
};
