import { DELETE_MODEL_FAILED, MODEL_NOT_FOUND, UPDATE_MODEL_FAILED, TOGGLE_LIKE_FAILED } from '@constants';
import { SearchDefaultModelParamsDto, UploadDefaultModelInputDto } from '@dtos/in';
import { DefaultModelListResultDto, DefaultModelResultDto, ToggleLikeResultDto } from '@dtos/out';
import { Handler } from '@interfaces';
import { prisma } from '@repositories';
import { UpdateDefaultModelInputDto } from '@dtos/in';
import { SearchDefaultModelResultDto } from 'src/dtos/out/searchModel.dto';

const getAll: Handler<DefaultModelListResultDto> = async () => {
    const defaultModels = await prisma.defaultModel.findMany({
        select: {
            model_id: true,
            model: {
                select: {
                    name: true,
                    price: true,
                    uploadTime: true,
                    ModelPromotion: {
                        select: {
                            discount: true
                        }
                    },
                    description: true,
                    boughtAmount: true
                }
            },
            imageUrl: true,
            likesNo: true,
            category_id: true,
            Category: {
                select: {
                    name: true
                }
            },
            subImageUrls: true
        }
    });

    return defaultModels.map((model) => ({
        id: model.model_id,
        category_id: model.category_id,
        category: model.Category.name,
        imageUrl: model.imageUrl,
        likesNo: model.likesNo,
        name: model.model.name,
        price: model.model.price,
        uploadTime: model.model.uploadTime.toISOString(),
        description: model.model.description,
        numberBought: model.model.boughtAmount,
        subImages: model.subImageUrls,
        discount: model.model.ModelPromotion?.discount
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
                    gcode: true,
                    description: true,
                    boughtAmount: true,
                    ModelPromotion: {
                        select: {
                            discount: true
                        }
                    }
                }
            },
            imageUrl: true,
            likesNo: true,
            category_id: true,
            Category: {
                select: {
                    name: true
                }
            },
            subImageUrls: true
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
        category: model.Category.name,
        imageUrl: model.imageUrl,
        likesNo: model.likesNo,
        name: model.model.name,
        price: model.model.price,
        uploadTime: model.model.uploadTime.toISOString(),
        gcode: model.model.gcode,
        description: model.model.description,
        numberBought: model.model.boughtAmount,
        subImages: model.subImageUrls,
        discount: model.model.ModelPromotion?.discount
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
                        price: input.price,
                        description: input.description || '',
                        ModelPromotion: {
                            create: {
                                discount: input.discount
                            }
                        }
                    }
                });
                const defaultModel = await prisma.defaultModel.create({
                    select: {
                        imageUrl: true,
                        category_id: true,
                        likesNo: true,
                        Category: {
                            select: {
                                name: true
                            }
                        }
                    },
                    data: {
                        category_id: input.category_id,
                        imageUrl: input.imageUrl,
                        likesNo: 0,
                        model_id: model.id,
                        subImageUrls: input.subImageUrls
                    }
                });
                outputList.push({
                    ...model,
                    uploadTime: model.uploadTime.toISOString(),
                    ...defaultModel,
                    numberBought: 0,
                    description: input.description || '',
                    discount: input.discount,
                    subImages: input.subImageUrls || [],
                    category_id: input.category_id,
                    category: defaultModel.Category.name
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
        return res.internalServerError(DELETE_MODEL_FAILED);
    }

    return 'Delete successfully';
};

const update: Handler<string, { Params: { id: string }; Body: UpdateDefaultModelInputDto }> = async (req, res) => {
    const { id } = req.params;
    const { gcode, name, price, category_id, imageUrl, discount, description, subImageUrls } = req.body;
    try {
        await prisma.defaultModel.update({
            data: {
                imageUrl,
                subImageUrls,
                model: {
                    update: {
                        gcode,
                        price,
                        name,
                        ModelPromotion: {
                            update: {
                                discount
                            }
                        },
                        description
                    }
                },
                Category: {
                    connect: {
                        id: category_id
                    }
                }
            },
            where: {
                model_id: id
            }
        });
    } catch (e) {
        return res.internalServerError(UPDATE_MODEL_FAILED);
    }

    return 'Update successfully';
};

const toggleLike: Handler<ToggleLikeResultDto, { Params: { id: string } }> = async (req, res) => {
    const { userId: user_id } = req;
    const { id: model_id } = req.params;

    try {
        const like = await prisma.like.findFirst({
            where: {
                user_id,
                model_id
            }
        });

        if (like) {
            await prisma.like.delete({
                where: {
                    user_id_model_id: {
                        user_id,
                        model_id
                    }
                }
            });

            await prisma.defaultModel.update({
                data: {
                    likesNo: {
                        decrement: 1
                    }
                },
                where: {
                    model_id
                }
            });

            return {
                userId: user_id,
                modelId: model_id,
                liked: false
            };
        }

        await prisma.like.create({
            data: {
                model_id,
                user_id
            }
        });

        await prisma.defaultModel.update({
            data: {
                likesNo: {
                    increment: 1
                }
            },
            where: {
                model_id
            }
        });

        return {
            userId: user_id,
            modelId: model_id,
            liked: true
        };
    } catch (e) {
        return res.internalServerError(TOGGLE_LIKE_FAILED);
    }
};

const search: Handler<SearchDefaultModelResultDto, { Params: SearchDefaultModelParamsDto }> = async (req) => {
    const keyword = req.params.keyword;
    const simpleDefaultModelList = await prisma.model.findMany({
        where: { name: { contains: keyword } },
        select: {
            id: true,
            name: true
        }
    });

    return simpleDefaultModelList;
};

export const defaultModelHandler = {
    get,
    getAll,
    upload,
    delete: del,
    update,
    toggleLike,
    search
};
