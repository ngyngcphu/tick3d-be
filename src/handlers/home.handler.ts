import { envs } from '@configs';
import { HomeSlideResultDto } from '@dtos/out';
import { Handler } from '@interfaces';

const getHomeSlides: Handler<HomeSlideResultDto> = async () => {
    const slides = [
        {
            src: `${envs.MINIO_URL}/tick3d/home/Slide_1.jpg`,
            alt: 'slide1'
        },
        {
            src: `${envs.MINIO_URL}/tick3d/home/Slide_2.jpg`,
            alt: 'slide2'
        },
        {
            src: `${envs.MINIO_URL}/tick3d/home/Slide_3.jpg`,
            alt: 'slide3'
        },
        {
            src: `${envs.MINIO_URL}/tick3d/home/Slide_4.jpg`,
            alt: 'slide4'
        }
    ];
    return slides;
};

export const homeHandler = {
    getHomeSlides: getHomeSlides
};
