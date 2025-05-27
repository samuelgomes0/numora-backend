import { IUser, IUserPayload } from "../interfaces";
import { UserRepository } from "../repositories";

class UserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<IUser[]> {
    return this.userRepository.findAll();
  }

  async findById(id: string): Promise<IUser | null> {
    return await this.userRepository.findById(id);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await this.userRepository.findByEmail(email);
  }

  async create(user: IUserPayload): Promise<IUser> {
    const { name, email, password } = user;

    const existingUser = await this.findByEmail(email);

    if (existingUser) {
      throw new Error("Email already in use");
    }

    const newUser = await this.userRepository.create({ name, email, password });

    return newUser;
  }

  async update(id: string, user: IUserPayload): Promise<IUser> {
    const updatedUser = await this.userRepository.update(id, user);
    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    if (!(await this.userExists(id))) throw new Error("User does not exists.");

    await this.userRepository.delete(id);
  }

  private async userExists(id: string): Promise<IUser | null> {
    return await this.findById(id);
  }
}

export default UserUseCase;
