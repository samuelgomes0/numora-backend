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
    const mockUsers = [
      {
        id: "1",
        name: "John",
        email: "john@example.com",
        createdAt: new Date(),
      },
      {
        id: "2",
        name: "Jane",
        email: "jane@example.com",
        createdAt: new Date(),
      },
    ];
    mockUserRepo.findAll = vi.fn().mockResolvedValue(mockUsers);

    const users = await userUseCase.findAll();

    expect(users).toEqual(mockUsers);
    expect(mockUserRepo.findAll).toHaveBeenCalledOnce();
  });

  it("should find user by id", async () => {
    const mockUser = {
      id: "1",
      name: "John",
      email: "john@example.com",
      createdAt: new Date(),
    };
    mockUserRepo.findById = vi.fn().mockResolvedValue(mockUser);

    const user = await userUseCase.findById("1");

    expect(user).toEqual(mockUser);
    expect(mockUserRepo.findById).toHaveBeenCalledWith("1");
  });

  it("should return null when user not found by id", async () => {
    mockUserRepo.findById = vi.fn().mockResolvedValue(null);

    const user = await userUseCase.findById("999");

    expect(user).toBeNull();
    expect(mockUserRepo.findById).toHaveBeenCalledWith("999");
  });

  it("should create user successfully", async () => {
    const mockCreatedUser = {
      id: "1",
      name: "John",
      email: "john@example.com",
      createdAt: new Date(),
    };
    mockUserRepo.findByEmail = vi.fn().mockResolvedValue(null);
    mockUserRepo.create = vi.fn().mockResolvedValue(mockCreatedUser);

    const user = await userUseCase.create({
      name: "John",
      email: "john@example.com",
      password: "123456",
    });

    expect(user).toEqual(mockCreatedUser);
    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith("john@example.com");
    expect(mockUserRepo.create).toHaveBeenCalledOnce();
  });

  it("should throw error if email already exists", async () => {
    const existingUser = {
      id: "1",
      name: "John",
      email: "john@example.com",
      createdAt: new Date(),
    };
    mockUserRepo.findByEmail = vi.fn().mockResolvedValue(existingUser);

    await expect(
      userUseCase.create({
        name: "John",
        email: "john@example.com",
        password: "123456",
      })
    ).rejects.toThrow("Email already in use");
  });

  it("should update user successfully", async () => {
    const mockUpdatedUser = {
      id: "1",
      name: "John Updated",
      email: "john.updated@example.com",
      createdAt: new Date(),
    };
    mockUserRepo.findById = vi.fn().mockResolvedValue(mockUpdatedUser);
    mockUserRepo.findByEmail = vi.fn().mockResolvedValue(null);
    mockUserRepo.update = vi.fn().mockResolvedValue(mockUpdatedUser);

    const user = await userUseCase.update("1", {
      name: "John Updated",
      email: "john.updated@example.com",
    });

    expect(user).toEqual(mockUpdatedUser);
    expect(mockUserRepo.update).toHaveBeenCalledWith("1", {
      name: "John Updated",
      email: "john.updated@example.com",
    });
  });

  it("should throw error when updating non-existent user", async () => {
    mockUserRepo.findById = vi.fn().mockResolvedValue(null);

    await expect(
      userUseCase.update("999", {
        name: "John Updated",
        email: "john.updated@example.com",
      })
    ).rejects.toThrow("User not found");
  });

  it("should throw error when updating with existing email", async () => {
    const existingUser = {
      id: "2",
      name: "Jane",
      email: "jane@example.com",
      createdAt: new Date(),
    };
    mockUserRepo.findById = vi.fn().mockResolvedValue(existingUser);
    mockUserRepo.findByEmail = vi.fn().mockResolvedValue(existingUser);

    await expect(
      userUseCase.update("1", {
        name: "John",
        email: "jane@example.com",
      })
    ).rejects.toThrow("Email already in use");
  });

  it("should delete user successfully", async () => {
    const mockUser = {
      id: "1",
      name: "John",
      email: "john@example.com",
      createdAt: new Date(),
    };
    mockUserRepo.findById = vi.fn().mockResolvedValue(mockUser);
    mockUserRepo.delete = vi.fn().mockResolvedValue(mockUser);

    const deletedUser = await userUseCase.delete("1");

    expect(deletedUser).toEqual(mockUser);
    expect(mockUserRepo.delete).toHaveBeenCalledWith("1");
  });

  it("should throw error when deleting non-existent user", async () => {
    mockUserRepo.findById = vi.fn().mockResolvedValue(null);

    await expect(userUseCase.delete("999")).rejects.toThrow("User not found");
  });
});
