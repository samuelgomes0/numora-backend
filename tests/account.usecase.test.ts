import { IAccountRepository } from "@/interfaces";
import { AccountUseCase } from "@/usecases";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockAccountRepo = {
  findAll: vi.fn().mockResolvedValue([]),
  findById: vi.fn(),
  findAccountsByUserId: vi.fn().mockResolvedValue([]),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
} as unknown as IAccountRepository;

describe("AccountUseCase", () => {
  let accountUseCase: AccountUseCase;

  beforeEach(() => {
    accountUseCase = new AccountUseCase(mockAccountRepo);
    vi.clearAllMocks();
  });

  it("should return all accounts", async () => {
    await accountUseCase.findAll();
    expect(mockAccountRepo.findAll).toHaveBeenCalledOnce();
  });

  it("should create account", async () => {
    mockAccountRepo.create = vi
      .fn()
      .mockResolvedValue({ id: "1", name: "Main", balance: 100, userId: "u1" });

    const account = await accountUseCase.create({ userId: "u1", name: "Main" });

    expect(account).toHaveProperty("id");
    expect(mockAccountRepo.create).toHaveBeenCalledOnce();
  });

  it("should throw error if account name already exists", async () => {
    mockAccountRepo.findAccountsByUserId = vi
      .fn()
      .mockResolvedValue([{ id: "1", name: "Main", balance: 100 }]);

    await expect(accountUseCase.create({ userId: "u1", name: "Main" })).rejects.toThrow(
      "Account name already exists for this user."
    );
  });
});
