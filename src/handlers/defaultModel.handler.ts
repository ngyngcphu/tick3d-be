import { DELETE_MODEL_FAILED, MODEL_NOT_FOUND, UPDATE_MODEL_FAILED } from '@constants';
import { UploadDefaultModelInputDto } from '@dtos/in';
import { DefaultModelListResultDto, DefaultModelResultDto } from '@dtos/out';
import { Handler } from '@interfaces';
import { prisma } from '@repositories';
import { UpdateDefaultModelInputDto } from 'src/dtos/in/updateDefaultModel.dto';

const getAll: Handler<DefaultModelListResultDto> = async () => {
    const defaultModels = await prisma.defaultModel.findMany({
        select: {
            model_id: true,
            model: {
                select: {
                    name: true,
                    price: true,
                    uploadTime: true,
                    gcode: true
                }
            },
            imageUrl: true,
            likesNo: true,
            category_id: true
        }
    });

    return defaultModels.map((model) => ({
        id: model.model_id,
        category_id: model.category_id,
        imageUrl: model.imageUrl,
        likesNo: model.likesNo,
        name: model.model.name,
        price: model.model.price,
        uploadTime: model.model.uploadTime.toISOString(),
        gcode: model.model.gcode
    }));
};

const get: Handler<DefaultModelResultDto, { Params: { id: string } }> = async (req, res) => {
    const { id } = req.params;

    const model = await prisma.defaultModel.findFirst({
        select: {
            model_id: true,
            model: {
                select: {
                    name: true,
                    price: true,
                    uploadTime: true,
                    gcode: true
                }
            },
            imageUrl: true,
            likesNo: true,
            category_id: true
        },
        where: {
            model_id: id
        }
    });

    if (model === null) {
        return res.notFound(MODEL_NOT_FOUND);
    }

    return {
        id: model.model_id,
        category_id: model.category_id,
        imageUrl: model.imageUrl,
        likesNo: model.likesNo,
        name: model.model.name,
        price: model.model.price,
        uploadTime: model.model.uploadTime.toISOString(),
        gcode: model.model.gcode
    };
};

const upload: Handler<DefaultModelListResultDto, { Body: UploadDefaultModelInputDto }> = async (req) => {
    const outputList: DefaultModelListResultDto = [];
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
                        price: input.price
                    }
                });
                const defaultModel = await prisma.defaultModel.create({
                    select: {
                        imageUrl: true,
                        category_id: true,
                        likesNo: true
                    },
                    data: {
                        category_id: input.category_id,
                        imageUrl: input.imageUrl,
                        likesNo: 0,
                        model_id: model.id
                    }
                });
                outputList.push({
                    ...model,
                    uploadTime: model.uploadTime.toISOString(),
                    ...defaultModel
                });
            })
        );
    } catch (e) {}

    return outputList;
};

const del: Handler<string, { Params: { id: string } }> = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.defaultModel.delete({
            where: {
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

const update: Handler<string, { Params: { id: string }; Body: UpdateDefaultModelInputDto }> = async (req, res) => {
    const { id } = req.params;
    const { gcode, name, price, category_id, imageUrl } = req.body;
    try {
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
        await prisma.defaultModel.update({
            data: {
                category_id,
                imageUrl
            },
            where: {
                model_id: id
            }
        });
    } catch (e) {
        return res.badRequest(UPDATE_MODEL_FAILED);
    }

    return 'Update succesfully';
};

export const defaultModelHandler = {
    get,
    getAll,
    upload,
    delete: del,
    update
};
