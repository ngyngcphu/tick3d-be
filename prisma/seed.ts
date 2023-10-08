import { hashSync } from 'bcrypt';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

const users = [
    {
        accountName: 'admin',
        password: 'admin1234',
        role: UserRole.MANAGER,
        tel: '0123456789',
        profileName: 'admin'
    },
    {
        accountName: 'customer',
        password: 'user5678',
        role: UserRole.CUSTOMER,
        tel: '9876543210',
        profileName: 'user'
    }
];

async function generateSampleData() {
    const handleUsers = users.map((user) => {
        const hashPassword = hashSync(user.password, SALT_ROUNDS);
        return {
            account_name: user.accountName,
            password_sh: hashPassword,
            role: user.role,
            tel: user.tel,
            profile_name: user.profileName
        };
    });
    const sampleUser = await prisma.user.createMany({
        data: handleUsers
    });
    console.log(sampleUser);
    process.exit(0);
}

generateSampleData();
