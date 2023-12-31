import { USER_NOT_FOUND } from '@constants';
import { prisma } from '@repositories';
import { UserDto } from '@dtos/out';
import { Handler } from '@interfaces';

const getUserById: Handler<UserDto> = async (req, res) => {
    const userId = req.userId;
    const user = await prisma.user.findUnique({
        select: {
            id: true,
            email: true,
            role: true,
            first_name: true,
            last_name: true
        },
        where: { id: userId }
    });
    if (user === null) return res.badRequest(USER_NOT_FOUND);
    return {
        id: user.id,
        email: user.email,
        role: user.role,
        VnFormatName: user.last_name + ' ' + user.first_name
    };
};

export const usersHandler = {
    getUserById
};
