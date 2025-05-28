import { prisma } from "@/database/prisma-client";
import {
  IUser,
  IUserCreatePayload,
  IUserRepository,
  IUserSummary,
  IUserUpdatePayload,
} from "@/interfaces";

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
};

const privateUserSelect = {
  ...publicUserSelect,
  accounts: {
    select: {
      id: true,
      name: true,
      balance: true,
    },
  },
};

class UserRepository implements IUserRepository {
  findAll(): Promise<IUserSummary[]> {
    return prisma.user.findMany({
      select: publicUserSelect,
    });
  }

  findById(id: string): Promise<IUser | null> {
    return prisma.user.findUnique({
      where: { id },
      select: privateUserSelect,
    });
  }

  findByEmail(email: string): Promise<IUser | null> {
    return prisma.user.findUnique({
      where: { email },
      select: privateUserSelect,
    });
  }

  create(user: IUserCreatePayload): Promise<IUser> {
    return prisma.user.create({
      data: user,
      select: publicUserSelect,
    });
  }

  update(id: string, user: IUserUpdatePayload): Promise<IUser> {
    return prisma.user.update({
      where: { id },
      data: user,
      select: publicUserSelect,
    });
  }

  delete(id: string): Promise<IUser | null> {
    return prisma.user.delete({
      where: { id },
      select: publicUserSelect,
    });
  }
}

export default UserRepository;
