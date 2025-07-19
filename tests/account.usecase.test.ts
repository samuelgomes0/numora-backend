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
    const mockAccounts = [
      { id: "1", name: "Main", balance: 100, userId: "u1" },
      { id: "2", name: "Savings", balance: 500, userId: "u1" },
    ];
    mockAccountRepo.findAll = vi.fn().mockResolvedValue(mockAccounts);

    const accounts = await accountUseCase.findAll();

    expect(accounts).toEqual(mockAccounts);
    expect(mockAccountRepo.findAll).toHaveBeenCalledOnce();
  });

  it("should find account by id", async () => {
    const mockAccount = { id: "1", name: "Main", balance: 100, userId: "u1" };
    mockAccountRepo.findById = vi.fn().mockResolvedValue(mockAccount);

    const account = await accountUseCase.findById("1");

    expect(account).toEqual(mockAccount);
    expect(mockAccountRepo.findById).toHaveBeenCalledWith("1");
  });

  it("should return null when account not found by id", async () => {
    mockAccountRepo.findById = vi.fn().mockResolvedValue(null);

    const account = await accountUseCase.findById("999");

    expect(account).toBeNull();
    expect(mockAccountRepo.findById).toHaveBeenCalledWith("999");
  });

  it("should find accounts by user id", async () => {
    const mockAccounts = [
      { id: "1", name: "Main", balance: 100, userId: "u1" },
      { id: "2", name: "Savings", balance: 500, userId: "u1" },
    ];
    mockAccountRepo.findAccountsByUserId = vi
      .fn()
      .mockResolvedValue(mockAccounts);

    const accounts = await accountUseCase.findByUser("u1");

    expect(accounts).toEqual(mockAccounts);
    expect(mockAccountRepo.findAccountsByUserId).toHaveBeenCalledWith("u1");
  });

  it("should create account successfully", async () => {
    const mockCreatedAccount = {
      id: "1",
      name: "Main",
      balance: 0,
      userId: "u1",
    };
    mockAccountRepo.findAccountsByUserId = vi.fn().mockResolvedValue([]);
    mockAccountRepo.create = vi.fn().mockResolvedValue(mockCreatedAccount);

    const account = await accountUseCase.create({ userId: "u1", name: "Main" });

    expect(account).toEqual(mockCreatedAccount);
    expect(mockAccountRepo.create).toHaveBeenCalledWith({
      userId: "u1",
      name: "Main",
    });
  });

  it("should throw error if account name already exists for user", async () => {
    const existingAccounts = [
      { id: "1", name: "Main", balance: 100, userId: "u1" },
    ];
    mockAccountRepo.findAccountsByUserId = vi
      .fn()
      .mockResolvedValue(existingAccounts);

    await expect(
      accountUseCase.create({ userId: "u1", name: "Main" })
    ).rejects.toThrow("Account name already exists for this user.");
  });

  it("should update account successfully", async () => {
    const mockUpdatedAccount = {
      id: "1",
      name: "Main Updated",
      balance: 200,
      userId: "u1",
    };
    mockAccountRepo.findById = vi.fn().mockResolvedValue(mockUpdatedAccount);
    mockAccountRepo.findAccountsByUserId = vi.fn().mockResolvedValue([]);
    mockAccountRepo.update = vi.fn().mockResolvedValue(mockUpdatedAccount);

    const account = await accountUseCase.update("1", { name: "Main Updated" });

    expect(account).toEqual(mockUpdatedAccount);
    expect(mockAccountRepo.update).toHaveBeenCalledWith("1", {
      name: "Main Updated",
    });
  });

  it("should throw error when updating non-existent account", async () => {
    mockAccountRepo.findById = vi.fn().mockResolvedValue(null);

    await expect(
      accountUseCase.update("999", { name: "Updated" })
    ).rejects.toThrow("Account not found");
  });

  it("should throw error when updating with existing name for same user", async () => {
    const existingAccount = {
      id: "1",
      name: "Main",
      balance: 100,
      userId: "u1",
    };
    const conflictingAccounts = [
      { id: "2", name: "Main Updated", balance: 200, userId: "u1" },
    ];
    mockAccountRepo.findById = vi.fn().mockResolvedValue(existingAccount);
    mockAccountRepo.findAccountsByUserId = vi
      .fn()
      .mockResolvedValue(conflictingAccounts);

    await expect(
      accountUseCase.update("1", { name: "Main Updated" })
    ).rejects.toThrow("Account name already exists for this user.");
  });

  it("should delete account successfully", async () => {
    const mockAccount = { id: "1", name: "Main", balance: 100, userId: "u1" };
    mockAccountRepo.findById = vi.fn().mockResolvedValue(mockAccount);
    mockAccountRepo.delete = vi.fn().mockResolvedValue(mockAccount);

    const deletedAccount = await accountUseCase.delete("1");

    expect(deletedAccount).toEqual(mockAccount);
    expect(mockAccountRepo.delete).toHaveBeenCalledWith("1");
  });

  it("should throw error when deleting non-existent account", async () => {
    mockAccountRepo.findById = vi.fn().mockResolvedValue(null);

    await expect(accountUseCase.delete("999")).rejects.toThrow(
      "Account not found"
    );
  });

  it("should get account balance", async () => {
    const mockAccount = { id: "1", name: "Main", balance: 100, userId: "u1" };
    mockAccountRepo.findById = vi.fn().mockResolvedValue(mockAccount);

    const balance = await accountUseCase.getBalance("1");

    expect(balance).toBe(100);
    expect(mockAccountRepo.findById).toHaveBeenCalledWith("1");
  });

  it("should return null balance for non-existent account", async () => {
    mockAccountRepo.findById = vi.fn().mockResolvedValue(null);

    const balance = await accountUseCase.getBalance("999");

    expect(balance).toBeNull();
    expect(mockAccountRepo.findById).toHaveBeenCalledWith("999");
  });
});
