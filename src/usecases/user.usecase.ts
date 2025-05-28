import {
  IUser,
  IUserCreatePayload,
  IUserRepository,
  IUserSummary,
  IUserUpdatePayload,
} from "@/interfaces";

class UserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  findAll(): Promise<IUserSummary[]> {
    return this.userRepository.findAll();
  }

  findById(id: string): Promise<IUser | null> {
    return this.userRepository.findById(id);
  }

  findByEmail(email: string): Promise<IUser | null> {
    return this.userRepository.findByEmail(email);
  }

  async create(user: IUserCreatePayload): Promise<IUser> {
    const existingUser = await this.findByEmail(user.email);

    if (existingUser) {
      throw new Error("Email already in use");
    }

    return this.userRepository.create(user);
  }

  update(id: string, user: IUserUpdatePayload): Promise<IUser> {
    return this.userRepository.update(id, user);
  }

  async delete(id: string): Promise<IUser | null> {
    const user = await this.findById(id);
    if (!user) {
      throw new Error("User does not exist.");
    }
    return this.userRepository.delete(id);
  }
}

export default UserUseCase;
