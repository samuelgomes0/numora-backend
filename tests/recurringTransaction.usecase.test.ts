import { IRecurringTransactionRepository } from "@/interfaces";
import { RecurringTransactionUseCase } from "@/usecases";
import { TransactionType } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockRecurringTransactionRepo = {
  findAll: vi.fn().mockResolvedValue([]),
  findById: vi.fn(),
  findRecurringTransactionsByAccountId: vi.fn().mockResolvedValue([]),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
} as unknown as IRecurringTransactionRepository;

describe("RecurringTransactionUseCase", () => {
  let recurringTransactionUseCase: RecurringTransactionUseCase;

  beforeEach(() => {
    recurringTransactionUseCase = new RecurringTransactionUseCase(
      mockRecurringTransactionRepo
    );
    vi.clearAllMocks();
  });

  it("should return all recurring transactions", async () => {
    const mockRecurringTransactions = [
      {
        id: "1",
        amount: 100,
        transactionType: TransactionType.INCOME,
        description: "Salary",
        accountId: "a1",
        frequency: "MONTHLY",
      },
      {
        id: "2",
        amount: 50,
        transactionType: TransactionType.EXPENSE,
        description: "Netflix",
        accountId: "a1",
        frequency: "MONTHLY",
      },
    ];
    mockRecurringTransactionRepo.findAll = vi
      .fn()
      .mockResolvedValue(mockRecurringTransactions);

    const recurringTransactions = await recurringTransactionUseCase.findAll();

    expect(recurringTransactions).toEqual(mockRecurringTransactions);
    expect(mockRecurringTransactionRepo.findAll).toHaveBeenCalledOnce();
  });

  it("should find recurring transaction by id", async () => {
    const mockRecurringTransaction = {
      id: "1",
      amount: 100,
      transactionType: TransactionType.INCOME,
      description: "Salary",
      accountId: "a1",
      frequency: "MONTHLY",
    };
    mockRecurringTransactionRepo.findById = vi
      .fn()
      .mockResolvedValue(mockRecurringTransaction);

    const recurringTransaction = await recurringTransactionUseCase.findById(
      "1"
    );

    expect(recurringTransaction).toEqual(mockRecurringTransaction);
    expect(mockRecurringTransactionRepo.findById).toHaveBeenCalledWith("1");
  });

  it("should return null when recurring transaction not found by id", async () => {
    mockRecurringTransactionRepo.findById = vi.fn().mockResolvedValue(null);

    const recurringTransaction = await recurringTransactionUseCase.findById(
      "999"
    );

    expect(recurringTransaction).toBeNull();
    expect(mockRecurringTransactionRepo.findById).toHaveBeenCalledWith("999");
  });

  it("should find recurring transactions by account id", async () => {
    const mockRecurringTransactions = [
      {
        id: "1",
        amount: 100,
        transactionType: TransactionType.INCOME,
        description: "Salary",
        accountId: "a1",
        frequency: "MONTHLY",
      },
      {
        id: "2",
        amount: 50,
        transactionType: TransactionType.EXPENSE,
        description: "Netflix",
        accountId: "a1",
        frequency: "MONTHLY",
      },
    ];
    mockRecurringTransactionRepo.findRecurringTransactionsByAccountId = vi
      .fn()
      .mockResolvedValue(mockRecurringTransactions);

    const recurringTransactions =
      await recurringTransactionUseCase.findByAccount("a1");

    expect(recurringTransactions).toEqual(mockRecurringTransactions);
    expect(
      mockRecurringTransactionRepo.findRecurringTransactionsByAccountId
    ).toHaveBeenCalledWith("a1");
  });

  it("should create recurring transaction successfully", async () => {
    const mockCreatedRecurringTransaction = {
      id: "1",
      amount: 100,
      transactionType: TransactionType.INCOME,
      description: "Salary",
      accountId: "a1",
      frequency: "MONTHLY",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockRecurringTransactionRepo.findRecurringTransactionsByAccountId = vi
      .fn()
      .mockResolvedValue([]);
    mockRecurringTransactionRepo.create = vi
      .fn()
      .mockResolvedValue(mockCreatedRecurringTransaction);

    const recurringTransaction = await recurringTransactionUseCase.create({
      amount: 100,
      transactionType: TransactionType.INCOME,
      description: "Salary",
      accountId: "a1",
      frequency: "MONTHLY",
    });

    expect(recurringTransaction).toEqual(mockCreatedRecurringTransaction);
    expect(mockRecurringTransactionRepo.create).toHaveBeenCalledWith({
      amount: 100,
      transactionType: TransactionType.INCOME,
      description: "Salary",
      accountId: "a1",
      frequency: "MONTHLY",
    });
  });

  it("should throw error if recurring transaction description already exists for account", async () => {
    const existingRecurringTransactions = [
      {
        id: "1",
        amount: 100,
        transactionType: TransactionType.INCOME,
        description: "Salary",
        accountId: "a1",
        frequency: "MONTHLY",
      },
    ];
    mockRecurringTransactionRepo.findRecurringTransactionsByAccountId = vi
      .fn()
      .mockResolvedValue(existingRecurringTransactions);

    await expect(
      recurringTransactionUseCase.create({
        amount: 150,
        transactionType: TransactionType.INCOME,
        description: "Salary",
        accountId: "a1",
        frequency: "MONTHLY",
      })
    ).rejects.toThrow(
      "Recurring transaction description already exists for this account."
    );
  });

  it("should update recurring transaction successfully", async () => {
    const mockUpdatedRecurringTransaction = {
      id: "1",
      amount: 150,
      transactionType: TransactionType.INCOME,
      description: "Salary Updated",
      accountId: "a1",
      frequency: "MONTHLY",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockRecurringTransactionRepo.findById = vi
      .fn()
      .mockResolvedValue(mockUpdatedRecurringTransaction);
    mockRecurringTransactionRepo.findRecurringTransactionsByAccountId = vi
      .fn()
      .mockResolvedValue([]);
    mockRecurringTransactionRepo.update = vi
      .fn()
      .mockResolvedValue(mockUpdatedRecurringTransaction);

    const recurringTransaction = await recurringTransactionUseCase.update("1", {
      amount: 150,
      description: "Salary Updated",
    });

    expect(recurringTransaction).toEqual(mockUpdatedRecurringTransaction);
    expect(mockRecurringTransactionRepo.update).toHaveBeenCalledWith("1", {
      amount: 150,
      description: "Salary Updated",
    });
  });

  it("should throw error when updating non-existent recurring transaction", async () => {
    mockRecurringTransactionRepo.findById = vi.fn().mockResolvedValue(null);

    await expect(
      recurringTransactionUseCase.update("999", {
        amount: 150,
        description: "Updated",
      })
    ).rejects.toThrow("Recurring transaction not found");
  });

  it("should throw error when updating with existing description for same account", async () => {
    const existingRecurringTransaction = {
      id: "1",
      amount: 100,
      transactionType: TransactionType.INCOME,
      description: "Salary",
      accountId: "a1",
      frequency: "MONTHLY",
    };
    const conflictingRecurringTransactions = [
      {
        id: "2",
        amount: 150,
        transactionType: TransactionType.INCOME,
        description: "Salary Updated",
        accountId: "a1",
        frequency: "MONTHLY",
      },
    ];
    mockRecurringTransactionRepo.findById = vi
      .fn()
      .mockResolvedValue(existingRecurringTransaction);
    mockRecurringTransactionRepo.findRecurringTransactionsByAccountId = vi
      .fn()
      .mockResolvedValue(conflictingRecurringTransactions);

    await expect(
      recurringTransactionUseCase.update("1", {
        amount: 150,
        description: "Salary Updated",
      })
    ).rejects.toThrow(
      "Recurring transaction description already exists for this account."
    );
  });

  it("should delete recurring transaction successfully", async () => {
    const mockRecurringTransaction = {
      id: "1",
      amount: 100,
      transactionType: TransactionType.INCOME,
      description: "Salary",
      accountId: "a1",
      frequency: "MONTHLY",
    };
    mockRecurringTransactionRepo.findById = vi
      .fn()
      .mockResolvedValue(mockRecurringTransaction);
    mockRecurringTransactionRepo.delete = vi
      .fn()
      .mockResolvedValue(mockRecurringTransaction);

    const deletedRecurringTransaction =
      await recurringTransactionUseCase.delete("1");

    expect(deletedRecurringTransaction).toEqual(mockRecurringTransaction);
    expect(mockRecurringTransactionRepo.delete).toHaveBeenCalledWith("1");
  });

  it("should throw error when deleting non-existent recurring transaction", async () => {
    mockRecurringTransactionRepo.findById = vi.fn().mockResolvedValue(null);

    await expect(recurringTransactionUseCase.delete("999")).rejects.toThrow(
      "Recurring transaction not found"
    );
  });

  it("should throw error when amount is negative", async () => {
    await expect(
      recurringTransactionUseCase.create({
        amount: -100,
        transactionType: TransactionType.INCOME,
        description: "Salary",
        accountId: "a1",
        frequency: "MONTHLY",
      })
    ).rejects.toThrow("Amount cannot be negative");
  });

  it("should throw error when amount is zero", async () => {
    await expect(
      recurringTransactionUseCase.create({
        amount: 0,
        transactionType: TransactionType.INCOME,
        description: "Salary",
        accountId: "a1",
        frequency: "MONTHLY",
      })
    ).rejects.toThrow("Amount cannot be zero");
  });

  it("should throw error when updating with negative amount", async () => {
    const mockRecurringTransaction = {
      id: "1",
      amount: 100,
      transactionType: TransactionType.INCOME,
      description: "Salary",
      accountId: "a1",
      frequency: "MONTHLY",
    };
    mockRecurringTransactionRepo.findById = vi
      .fn()
      .mockResolvedValue(mockRecurringTransaction);

    await expect(
      recurringTransactionUseCase.update("1", {
        amount: -100,
        description: "Updated",
      })
    ).rejects.toThrow("Amount cannot be negative");
  });
});
