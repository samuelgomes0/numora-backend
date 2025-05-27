import { prisma } from "../database/prisma-client";
import { IUser, IUserPayload, IUserRepository } from "../interfaces";

const userSelect = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
};
class UserRepository implements IUserRepository {
  findAll(): Promise<IUser[]> {
    return prisma.user.findMany({
      select: userSelect,
    });
  }

  findById(id: string): Promise<IUser | null> {
    return prisma.user.findUnique({
      where: { id },
      select: { ...userSelect, accounts: true },
    });
  }

  findByEmail(email: string): Promise<IUser | null> {
    return prisma.user.findUnique({
      where: { email },
      select: {
        ...userSelect,
        accounts: true,
      },
    });
  }

  create(user: IUserPayload): Promise<IUser> {
    return prisma.user.create({
      data: user,
    });
  }

  update(id: string, user: IUserPayload): Promise<IUser> {
    return prisma.user.update({
      where: { id },
      data: user,
    });
  }

  delete(id: string): boolean {
    prisma.user.delete({ where: { id } });
    return true;
  }
}

export default UserRepository;
