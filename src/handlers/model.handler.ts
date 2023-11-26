import { ModelResultDto } from '@dtos/out';
import { Handler } from '@interfaces';
import { prisma } from '@repositories';
import { logger } from '@utils';

const get: Handler<ModelResultDto[]> = async (__req, res) => {
    try {
        const defaultModels = await prisma.defaultModel.findMany();

        if (!defaultModels) return [];

        const modelsWithPromotion: {
            discount?: number;
            model_id: string;
            category_id: string;
            likesNo: number;
            imageUrl: string;
            subImageUrls: string[];
        }[] = await Promise.all(
            defaultModels.map(async (model) => {
                const promotion = await prisma.modelPromotion.findFirst({ where: { model_id: model.model_id } });
                if (promotion) return { ...model, discount: promotion.discount };
                else return model;
            })
        );

        const returnModel: {
            id: string;
            price: number;
            discount?: number;
            likesNo: number;
            image: string;
            subImages: string[];
            numberBought: number;
            description: string;
        }[] = await Promise.all(
            modelsWithPromotion.map(async (model) => {
                const modelInfo = (await prisma.model.findFirst({ where: { id: model.model_id } })) as {
                    id: string;
                    name: string;
                    price: number;
                    gcode: string;
                    uploadTime: Date;
                    description: string;
                    boughtAmount: number;
                };
                if (modelInfo)
                    return {
                        id: model.model_id,
                        image: model.imageUrl,
                        subImages: model.subImageUrls,
                        name: modelInfo.name,
                        discount: model.discount,
                        price: modelInfo.price,
                        description: modelInfo.description,
                        numberBought: modelInfo.boughtAmount,
                        likesNo: model.likesNo
                    };
                else throw Error('Default model not have correspond model');
            })
        );
        logger.error(returnModel);
        return res.send(returnModel);
    } catch (e) {
        return res.badRequest();
    }
};

export const modelHandler = {
    get
};
