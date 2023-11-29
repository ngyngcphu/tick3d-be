import { hashSync } from 'bcrypt';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

const users = [
    {
        email: 'admin@gmail.com',
        password: 'admin1234',
        role: UserRole.MANAGER,
        tel: '0123456789',
        first_name: 'admin',
        last_name: 'good',
        verified: true
    },
    {
        email: 'customer@gmail.com',
        password: 'user5678',
        role: UserRole.CUSTOMER,
        tel: '9876543210',
        first_name: 'user',
        last_name: 'good'
    }
];

const categories: { name: string; id: string }[] = [
    {
        name: 'All things',
        id: 'clpf9dsqc000008kwc9d3f8tr'
    },
    {
        name: 'Fashion',
        id: 'clpf9hn1t000108kw2iw00323'
    },
    {
        name: 'Hobby',
        id: 'clpf9hr6s000208kw0mivblak'
    },
    {
        name: 'Learning',
        id: 'clpf9hvef000308kwc9kf718a'
    },
    {
        name: 'Tools',
        id: 'clpf9i0cq000408kwbzsi0op0'
    },
    {
        name: 'Toys & Games',
        id: 'clpf9i4t4000508kw6fy544uo'
    },
    {
        name: 'Art',
        id: 'clpf9i9hm000608kwefc9b03m'
    },
    {
        name: 'Household',
        id: 'clpf9id14000708kwdflm7dmn'
    }
];

const models = [
    {
        id: 'clpf912p4000008le4y510kce',
        categoryId: categories[0].id,
        likesNo: 10,
        image: 'http://localhost:3003/item_1.jpg',
        subImage1: 'http://localhost:3003/sub1_image1.jpg',
        subImage2: 'http://localhost:3003/sub1_image2.jpg',
        name: 'Pokeball 3D Model',
        discount: 0.15,
        price: 490000,
        description: 'Đây là mô hình 3D Pokeball, Pokeball là mô hình bán chạy, mang vẻ đẹp thế giới Pokemon.',
        numberBought: 77
    },
    {
        id: 'clpf91chg000108le8nmq4vyh',
        categoryId: categories[0].id,
        likesNo: 10,
        image: 'http://localhost:3003/item_2.jpg',
        subImage1: 'http://localhost:3003/sub2_image1.jpg',
        subImage2: 'http://localhost:3003/sub2_image2.jpg',
        name: 'Pikachu 3D Model',
        discount: 0.2,
        price: 59000,
        description: 'Đây là mô hình 3D Pikachu, Pikachu là biểu tượng của Pokemon hệ điện.',
        numberBought: 95
    },
    {
        id: 'clpf91hyj000208le1cjs2n36',
        categoryId: categories[0].id,
        likesNo: 10,
        image: 'http://localhost:3003/item_3.jpg',
        subImage1: 'http://localhost:3003/sub3_image1.jpg',
        subImage2: 'http://localhost:3003/sub3_image2.jpg',
        name: 'Squirtle 3D Model',
        discount: 0.25,
        price: 55000,
        description: 'Đây là mô hình 3D Squirtle, Squirtle là biểu tượng của Pokemon hệ nước.',
        numberBought: 86
    },
    {
        id: 'clpf91rz3000308lefog88vgy',
        categoryId: categories[0].id,
        likesNo: 10,
        image: 'http://localhost:3003/item_4.jpg',
        subImage1: 'http://localhost:3003/sub4_image1.jpg',
        subImage2: 'http://localhost:3003/sub4_image2.jpg',
        name: 'Bullbasur 3D Model',
        discount: 0.1,
        price: 49000,
        description: 'Đây là mô hình 3D Bulbasur, Bulbasur là biểu tượng của Pokemon hệ thực vật.',
        numberBought: 39
    }
];

async function handleUsers() {
    const _handleUsers = users.map((user) => {
        const hashPassword = hashSync(user.password, SALT_ROUNDS);
        return {
            email: user.email,
            password_sh: hashPassword,
            role: user.role,
            tel: user.tel,
            last_name: user.last_name,
            first_name: user.first_name,
            verified: user?.verified
        };
    });

    _handleUsers.forEach(async (user) => {
        const { role, id } =
            (await prisma.user.create({
                data: user
            })) || {};

        if (role === UserRole.CUSTOMER) {
            await prisma.customer.create({
                data: {
                    user_id: id
                }
            });
        } else {
            await prisma.manager.create({
                data: {
                    user_id: id
                }
            });
        }
    });
  
    return _handleUsers;
}

async function handleCategories() {
    return await prisma.category.createMany({
        data: categories
    });
}

async function handleModels() {
    return models.map((model) => {
        return {
            id: model.id,
            name: model.name,
            price: model.price,
            gcode: 'no code',
            description: model.description
        };
    });
}

async function handleDefaultModels() {
    return models.map((defaultModel) => {
        return {
            model_id: defaultModel.id,
            category_id: defaultModel.categoryId,
            likesNo: defaultModel.likesNo,
            imageUrl: defaultModel.image,
            subImageUrls: [defaultModel.subImage1, defaultModel.subImage2]
        };
    });
}

async function handlePromotions() {
    return models.map((model) => {
        return { model_id: model.id, discount: model.discount };
    });
}

async function generateSampleData() {
    const handleUsersResult = await handleUsers();
    const createUserRes = await Promise.all(
        handleUsersResult.map(async (user) => {
            const { role, id } =
                (await prisma.user.create({
                    data: user
                })) || {};

            if (role === UserRole.CUSTOMER) {
                await prisma.customer.create({
                    data: {
                        user_id: id
                    }
                });
            } else {
                await prisma.manager.create({
                    data: {
                        user_id: id
                    }
                });
            }
            return 1;
        })
    );

    console.log({ count: createUserRes.length });

    console.log(await handleCategories());

    const handleModelResult = await handleModels();
    console.log(await prisma.model.createMany({ data: handleModelResult }));

    const handleDefaultModelResult = await handleDefaultModels();
    console.log(await prisma.defaultModel.createMany({ data: handleDefaultModelResult }));

    const handlePromotionResult = await handlePromotions();
    console.log(await prisma.modelPromotion.createMany({ data: handlePromotionResult }));
}

generateSampleData();
