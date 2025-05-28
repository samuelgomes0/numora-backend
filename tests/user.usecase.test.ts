import { IUserRepository } from "@/interfaces";
import { UserUseCase } from "@/usecases";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockUserRepo = {
  findAll: vi.fn().mockResolvedValue([]),
  findById: vi.fn(),
  findByEmail: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
} as unknown as IUserRepository;

describe("UserUseCase", () => {
  let userUseCase: UserUseCase;

  beforeEach(() => {
    userUseCase = new UserUseCase(mockUserRepo);
    vi.clearAllMocks();
  });

  it("should return all users", async () => {
    await userUseCase.findAll();
    expect(mockUserRepo.findAll).toHaveBeenCalledOnce();
  });

  it("should create user", async () => {
    mockUserRepo.findByEmail = vi.fn().mockResolvedValue(null);
    mockUserRepo.create = vi.fn().mockResolvedValue({
      id: "1",
      name: "John",
      email: "john@example.com",
      createdAt: new Date(),
    });

    const user = await userUseCase.create({
      name: "John",
      email: "john@example.com",
      password: "123456",
    });

    expect(user).toHaveProperty("id");
    expect(mockUserRepo.create).toHaveBeenCalledOnce();
  });

  it("should throw error if email already exists", async () => {
    mockUserRepo.findByEmail = vi.fn().mockResolvedValue({
      id: "1",
      name: "John",
      email: "john@example.com",
      createdAt: new Date(),
    });

    await expect(
      userUseCase.create({
        name: "John",
        email: "john@example.com",
        password: "123456",
      })
    ).rejects.toThrow("Email already in use");
  });
});
