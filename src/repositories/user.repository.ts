import { prisma } from "@/database/prisma-client";
import {
  IUser,
  IUserCreatePayload,
  IUserRepository,
  IUserSummary,
  IUserUpdatePayload,
} from "@/interfaces";

const userSummarySelect = {
  id: true,
  name: true,
  email: true,
};

const userSelect = {
  id: true,
  name: true,
  email: true,
  accounts: {
    select: {
      id: true,
      name: true,
      balance: true,
    },
  },
};

class UserRepository implements IUserRepository {
  async findAll(): Promise<IUserSummary[]> {
    return await prisma.user.findMany({
      select: userSummarySelect,
    });
  }

  async findById(id: string): Promise<IUser | null> {
    return await prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await prisma.user.findUnique({
      where: { email },
      select: userSelect,
    });
  }

  async create(data: IUserCreatePayload): Promise<IUser> {
    return await prisma.user.create({
      data,
      select: userSelect,
    });
  }

  async update(id: string, data: IUserUpdatePayload): Promise<IUser> {
    return await prisma.user.update({
      where: { id },
      data,
      select: userSelect,
    });
  }

  async delete(id: string): Promise<IUser | null> {
    return await prisma.user.delete({
      where: { id },
      select: userSelect,
    });
  }
}

export default UserRepository;
