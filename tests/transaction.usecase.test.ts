import { ITransactionRepository } from "@/interfaces";
import { TransactionUseCase } from "@/usecases";
import { TransactionType } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockTransactionRepo = {
  findAll: vi.fn().mockResolvedValue([]),
  findById: vi.fn(),
  findTransactionsByAccountId: vi.fn().mockResolvedValue([]),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
} as unknown as ITransactionRepository;

describe("TransactionUseCase", () => {
  let transactionUseCase: TransactionUseCase;

  beforeEach(() => {
    transactionUseCase = new TransactionUseCase(mockTransactionRepo);
    vi.clearAllMocks();
  });

  it("should return all transactions", async () => {
    const mockTransactions = [
      {
        id: "1",
        amount: 100,
        transactionType: TransactionType.INCOME,
        description: "Salary",
        accountId: "a1",
      },
      {
        id: "2",
        amount: 50,
        transactionType: TransactionType.EXPENSE,
        description: "Groceries",
        accountId: "a1",
      },
    ];
    mockTransactionRepo.findAll = vi.fn().mockResolvedValue(mockTransactions);

    const transactions = await transactionUseCase.findAll();

    expect(transactions).toEqual(mockTransactions);
    expect(mockTransactionRepo.findAll).toHaveBeenCalledOnce();
  });

  it("should find transaction by id", async () => {
    const mockTransaction = {
      id: "1",
      amount: 100,
      transactionType: TransactionType.INCOME,
      description: "Salary",
      accountId: "a1",
    };
    mockTransactionRepo.findById = vi.fn().mockResolvedValue(mockTransaction);

    const transaction = await transactionUseCase.findById("1");

    expect(transaction).toEqual(mockTransaction);
    expect(mockTransactionRepo.findById).toHaveBeenCalledWith("1");
  });

  it("should return null when transaction not found by id", async () => {
    mockTransactionRepo.findById = vi.fn().mockResolvedValue(null);

    const transaction = await transactionUseCase.findById("999");

    expect(transaction).toBeNull();
    expect(mockTransactionRepo.findById).toHaveBeenCalledWith("999");
  });

  it("should find transactions by account id", async () => {
    const mockTransactions = [
      {
        id: "1",
        amount: 100,
        transactionType: TransactionType.INCOME,
        description: "Salary",
        accountId: "a1",
      },
      {
        id: "2",
        amount: 50,
        transactionType: TransactionType.EXPENSE,
        description: "Groceries",
        accountId: "a1",
      },
    ];
    mockTransactionRepo.findTransactionsByAccountId = vi
      .fn()
      .mockResolvedValue(mockTransactions);

    const transactions = await transactionUseCase.findByAccount("a1");

    expect(transactions).toEqual(mockTransactions);
    expect(
      mockTransactionRepo.findTransactionsByAccountId
    ).toHaveBeenCalledWith("a1");
  });

  it("should create income transaction successfully", async () => {
    const mockCreatedTransaction = {
      id: "1",
      amount: 100,
      transactionType: TransactionType.INCOME,
      description: "Salary",
      date: new Date(),
      accountId: "a1",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockTransactionRepo.create = vi
      .fn()
      .mockResolvedValue(mockCreatedTransaction);

    const transaction = await transactionUseCase.create({
      amount: 100,
      transactionType: TransactionType.INCOME,
      description: "Salary",
      date: new Date(),
      accountId: "a1",
    });

    expect(transaction).toEqual(mockCreatedTransaction);
    expect(mockTransactionRepo.create).toHaveBeenCalledWith({
      amount: 100,
      transactionType: TransactionType.INCOME,
      description: "Salary",
      date: expect.any(Date),
      accountId: "a1",
    });
  });

  it("should create expense transaction successfully", async () => {
    const mockCreatedTransaction = {
      id: "1",
      amount: 50,
      transactionType: TransactionType.EXPENSE,
      description: "Groceries",
      date: new Date(),
      accountId: "a1",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockTransactionRepo.create = vi
      .fn()
      .mockResolvedValue(mockCreatedTransaction);

    const transaction = await transactionUseCase.create({
      amount: 50,
      transactionType: TransactionType.EXPENSE,
      description: "Groceries",
      date: new Date(),
      accountId: "a1",
    });

    expect(transaction).toEqual(mockCreatedTransaction);
    expect(mockTransactionRepo.create).toHaveBeenCalledWith({
      amount: 50,
      transactionType: TransactionType.EXPENSE,
      description: "Groceries",
      date: expect.any(Date),
      accountId: "a1",
    });
  });

  it("should throw error when amount is negative", async () => {
    await expect(
      transactionUseCase.create({
        amount: -100,
        transactionType: TransactionType.INCOME,
        description: "Salary",
        date: new Date(),
        accountId: "a1",
      })
    ).rejects.toThrow("Amount cannot be negative");
  });

  it("should throw error when amount is zero", async () => {
    await expect(
      transactionUseCase.create({
        amount: 0,
        transactionType: TransactionType.INCOME,
        description: "Salary",
        date: new Date(),
        accountId: "a1",
      })
    ).rejects.toThrow("Amount cannot be zero");
  });

  it("should update transaction successfully", async () => {
    const mockUpdatedTransaction = {
      id: "1",
      amount: 150,
      transactionType: TransactionType.INCOME,
      description: "Salary Updated",
      date: new Date(),
      accountId: "a1",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockTransactionRepo.findById = vi
      .fn()
      .mockResolvedValue(mockUpdatedTransaction);
    mockTransactionRepo.update = vi
      .fn()
      .mockResolvedValue(mockUpdatedTransaction);

    const transaction = await transactionUseCase.update("1", {
      amount: 150,
      description: "Salary Updated",
    });

    expect(transaction).toEqual(mockUpdatedTransaction);
    expect(mockTransactionRepo.update).toHaveBeenCalledWith("1", {
      amount: 150,
      description: "Salary Updated",
    });
  });

  it("should throw error when updating non-existent transaction", async () => {
    mockTransactionRepo.findById = vi.fn().mockResolvedValue(null);

    await expect(
      transactionUseCase.update("999", { amount: 150, description: "Updated" })
    ).rejects.toThrow("Transaction not found");
  });

  it("should throw error when updating with negative amount", async () => {
    const mockTransaction = {
      id: "1",
      amount: 100,
      transactionType: TransactionType.INCOME,
      description: "Salary",
      accountId: "a1",
    };
    mockTransactionRepo.findById = vi.fn().mockResolvedValue(mockTransaction);

    await expect(
      transactionUseCase.update("1", { amount: -100, description: "Updated" })
    ).rejects.toThrow("Amount cannot be negative");
  });

  it("should delete transaction successfully", async () => {
    const mockTransaction = {
      id: "1",
      amount: 100,
      transactionType: TransactionType.INCOME,
      description: "Salary",
      accountId: "a1",
    };
    mockTransactionRepo.findById = vi.fn().mockResolvedValue(mockTransaction);
    mockTransactionRepo.delete = vi.fn().mockResolvedValue(mockTransaction);

    const deletedTransaction = await transactionUseCase.delete("1");

    expect(deletedTransaction).toEqual(mockTransaction);
    expect(mockTransactionRepo.delete).toHaveBeenCalledWith("1");
  });

  it("should throw error when deleting non-existent transaction", async () => {
    mockTransactionRepo.findById = vi.fn().mockResolvedValue(null);

    await expect(transactionUseCase.delete("999")).rejects.toThrow(
      "Transaction not found"
    );
  });
});
