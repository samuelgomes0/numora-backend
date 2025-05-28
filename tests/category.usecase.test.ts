import { ICategoryRepository } from "@/interfaces";
import { CategoryUseCase } from "@/usecases";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockCategoryRepo = {
  findAll: vi.fn().mockResolvedValue([]),
  findById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
} as unknown as ICategoryRepository;

describe("CategoryUseCase", () => {
  let categoryUseCase: CategoryUseCase;

  beforeEach(() => {
    categoryUseCase = new CategoryUseCase(mockCategoryRepo);
    vi.clearAllMocks();
  });

  it("should return all categories", async () => {
    await categoryUseCase.findAll();
    expect(mockCategoryRepo.findAll).toHaveBeenCalledOnce();
  });

  it("should create category", async () => {
    mockCategoryRepo.create = vi
      .fn()
      .mockResolvedValue({ id: "1", name: "Food" });

    const category = await categoryUseCase.create({
      accountId: "a1",
      name: "Food",
    });

    expect(category).toHaveProperty("id");
    expect(mockCategoryRepo.create).toHaveBeenCalledOnce();
  });
});
