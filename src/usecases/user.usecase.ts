import {
  IUser,
  IUserCreatePayload,
  IUserRepository,
  IUserSummary,
  IUserUpdatePayload,
} from "@/interfaces";

class UserUseCase {
  private readonly userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async findAll(): Promise<IUserSummary[]> {
    return await this.userRepository.findAll();
  }

  async findById(id: string): Promise<IUser | null> {
    return await this.userRepository.findById(id);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await this.userRepository.findByEmail(email);
  }

  async create(data: IUserCreatePayload): Promise<IUser> {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) throw new Error("E-mail já está em uso.");

    return await this.userRepository.create(data);
  }

  async update(id: string, data: IUserUpdatePayload): Promise<IUser> {
    await this.findAndValidateUser(id);

    return await this.userRepository.update(id, data);
  }

  async delete(id: string): Promise<IUser> {
    await this.findAndValidateUser(id);

    return (await this.userRepository.delete(id)) as IUser;
  }

  private async findAndValidateUser(id: string): Promise<IUser> {
    const user = await this.userRepository.findById(id);

    if (!user) throw new Error("Usuário não encontrado.");

    return user;
  }
}

export default UserUseCase;
