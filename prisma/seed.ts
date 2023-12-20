import { hashSync } from 'bcrypt';
import { PrismaClient, UserRole } from '@prisma/client';
import { faker } from '@faker-js/faker';

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
        last_name: 'good',
        verified: true
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

const generateModel = () => {
    return {
        id: faker.string.uuid(),
        categoryId: faker.helpers.arrayElement(categories).id,
        image: faker.image.url(),
        subImage1: faker.image.url(),
        subImage2: faker.image.url(),
        name: faker.commerce.productName(),
        discount: faker.number.float({ min: 0, max: 0.5, precision: 0.01 }),
        price: faker.number.int({ min: 1000, max: 1000000 }),
        description: faker.lorem.paragraph(),
        numberBought: faker.number.int({ min: 0, max: 50 })
    };
};

const generateModels = (count: number) => {
    const models = [];
    for (let i = 0; i < count; i++) {
        models.push(generateModel());
    }
    return models;
};

const models = generateModels(100);

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

    console.log({ count: handleUsersResult.length });

    console.log(await handleCategories());

    const handleModelResult = await handleModels();
    console.log(await prisma.model.createMany({ data: handleModelResult }));

    const handleDefaultModelResult = await handleDefaultModels();
    console.log(await prisma.defaultModel.createMany({ data: handleDefaultModelResult }));

    const handlePromotionResult = await handlePromotions();
    console.log(await prisma.modelPromotion.createMany({ data: handlePromotionResult }));
}

generateSampleData();
