import { ITransactionRepository } from "@/interfaces";
import { TransactionUseCase } from "@/usecases";
import { TransactionType } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockTransactionRepo = {
  findAll: vi.fn().mockResolvedValue([]),
  findById: vi.fn(),
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
    await transactionUseCase.findAll();
    expect(mockTransactionRepo.findAll).toHaveBeenCalledOnce();
  });

  it("should create transaction", async () => {
    const payload = {
      amount: 100,
      transactionType: TransactionType.INCOME,
      description: "Salary",
      date: new Date(),
      accountId: "a1",
    };

    mockTransactionRepo.create = vi.fn().mockResolvedValue({
      id: "1",
      ...payload,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const transaction = await transactionUseCase.create(payload);

    expect(transaction).toHaveProperty("id");
    expect(mockTransactionRepo.create).toHaveBeenCalledOnce();
  });
});
