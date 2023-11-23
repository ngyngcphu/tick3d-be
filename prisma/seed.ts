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

async function generateSampleData() {
    const handleUsers = users.map((user) => {
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
    const sampleUser = await prisma.user.createMany({
        data: handleUsers
    });
    console.log(sampleUser);
    process.exit(0);
}

generateSampleData();
