import { hashSync } from 'bcrypt';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

const users = [
    {
        email: 'admin@gmail.com',
        password: 'admin1234',
        role: UserRole.ADMIN
    },
    {
        email: 'user@gmail.com',
        password: 'user5678',
        role: UserRole.USER
    }
];

async function generateSampleData() {
    const handleUsers = users.map((user) => {
        const hashPassword = hashSync(user.password, SALT_ROUNDS);
        return {
            email: user.email,
            password: hashPassword,
            role: user.role
        };
    });
    const sampleUser = await prisma.user.createMany({
        data: handleUsers
    });
    console.log(sampleUser);
    process.exit(0);
}

generateSampleData();
