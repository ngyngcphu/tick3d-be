import { DELETE_MODEL_FAILED, MODEL_NOT_FOUND, UPDATE_MODEL_FAILED, TOGGLE_LIKE_FAILED } from '@constants';
import { DefaultModelQueryStringDto, UploadDefaultModelInputDto } from '@dtos/in';
import { DefaultModelListResultDto, DefaultModelResultDto, ToggleLikeResultDto } from '@dtos/out';
import { Handler } from '@interfaces';
import { prisma } from '@repositories';
import { UpdateDefaultModelInputDto } from '@dtos/in';
import { logger } from '@utils';

const getAll: Handler<DefaultModelListResultDto, { Querystring: DefaultModelQueryStringDto }> = async (req) => {
    const isModelInCart = async (modelId: string) => {
        return (
            (await prisma.cart.count({
                where: {
                    model_id: modelId,
                    user_id: req.userId
                }
            })) !== 0
        );
    };

    const totalModels = await prisma.defaultModel.count({
        where: {
            likesNo: {
                gte: req.query.likes_ge
            },
            category_id: req.query.categoryId,
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
        }
    });

    try {
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
                subImageUrls: true,
                isDiscontinued: true
            },
            where: {
                likesNo: {
                    gte: req.query.likes_ge
                },
                category_id: req.query.categoryId,
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
            orderBy: [
                {
                    likesNo: req.query.orderBy === 'likesNo' ? req.query.order || 'desc' : undefined,
                    model:
                        req.query.orderBy !== 'likesNo'
                            ? {
                                  uploadTime: req.query.orderBy === 'uploadedTime' ? req.query.order || 'desc' : undefined,
                                  price: req.query.orderBy === 'price' ? req.query.order || 'asc' : undefined,
                                  name: req.query.orderBy === 'name' ? req.query.order || 'asc' : undefined,
                                  boughtAmount: req.query.orderBy === 'numberBought' ? req.query.order || 'desc' : undefined
                              }
                            : undefined
                },
                {
                    model_id: 'asc'
                }
            ],
            skip: req.query.start,
            take: req.query.noItems
        });

        return {
            total: totalModels,
            models: await Promise.all(
                defaultModels.map(async (model) => ({
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
                    discount: model.model.ModelPromotion?.discount,
                    isDiscontinued: model.isDiscontinued,
                    isModelInCart: await isModelInCart(model.model_id)
                }))
            )
        };
    } catch (e) {
        return {
            total: totalModels,
            models: []
        };
    }
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
            subImageUrls: true,
            isDiscontinued: true
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
        discount: model.model.ModelPromotion?.discount,
        isDiscontinued: model.isDiscontinued
    };
};

const upload: Handler<DefaultModelListResultDto['models'], { Body: UploadDefaultModelInputDto }> = async (req) => {
    const outputList: DefaultModelListResultDto['models'] = [];
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
                        },
                        isDiscontinued: true
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
                    category: defaultModel.Category.name,
                    isModelInCart: false
                });
            })
        );
    } catch (e) {}

    return outputList;
};

const del: Handler<{ message: string }, { Params: { id: string } }> = async (req, res) => {
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

    return { message: 'Delete successfully' };
};

const update: Handler<{ message: string }, { Params: { id: string }; Body: UpdateDefaultModelInputDto }> = async (req, res) => {
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

    return { message: 'Update successfully' };
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

const discontinue: Handler<{ message: string }, { Params: { id: string } }> = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.$transaction(async (prisma) => {
            await Promise.all([
                prisma.defaultModel.update({
                    data: {
                        isDiscontinued: true
                    },
                    where: {
                        model_id: id
                    }
                }),
                prisma.cart.deleteMany({
                    where: {
                        model_id: id
                    }
                })
            ]);
        });
    } catch (e) {
        logger.error('Discontinue model error:', e);
        return res.internalServerError('Model is discontinued failed');
    }

    return { message: 'Discontinue successfully' };
};

export const defaultModelHandler = {
    get,
    getAll,
    upload,
    delete: del,
    update,
    toggleLike,
    discontinue
};
