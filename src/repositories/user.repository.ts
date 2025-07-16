import { prisma } from "@/database/prisma-client";
import {
  IUser,
  IUserCreatePayload,
  IUserRepository,
  IUserSummary,
  IUserUpdatePayload,
} from "@/interfaces";

// Para listagens públicas - apenas dados básicos
const userSummarySelect = {
  id: true,
  name: true,
  email: true,
};

// Para detalhes do usuário - dados essenciais sem informações sensíveis
const userDetailSelect = {
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
      select: userDetailSelect,
    });
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await prisma.user.findUnique({
      where: { email },
      select: userDetailSelect,
    });
  }

  async create(data: IUserCreatePayload): Promise<IUser> {
    return await prisma.user.create({
      data,
      select: userDetailSelect,
    });
  }

  async update(id: string, data: IUserUpdatePayload): Promise<IUser> {
    return await prisma.user.update({
      where: { id },
      data,
      select: userDetailSelect,
    });
  }

  async delete(id: string): Promise<IUser | null> {
    try {
      return await prisma.user.delete({
        where: { id },
        select: userDetailSelect,
      });
    } catch (error) {
      return null;
    }
  }
}

export default UserRepository;
