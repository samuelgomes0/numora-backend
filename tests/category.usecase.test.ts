import { ICategoryRepository } from "@/interfaces";
import { CategoryUseCase } from "@/usecases";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockCategoryRepo = {
  findAll: vi.fn().mockResolvedValue([]),
  findById: vi.fn(),
  findCategoriesByAccountId: vi.fn().mockResolvedValue([]),
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
    const mockCategories = [
      { id: "1", name: "Food", accountId: "a1" },
      { id: "2", name: "Transportation", accountId: "a1" },
    ];
    mockCategoryRepo.findAll = vi.fn().mockResolvedValue(mockCategories);

    const categories = await categoryUseCase.findAll();

    expect(categories).toEqual(mockCategories);
    expect(mockCategoryRepo.findAll).toHaveBeenCalledOnce();
  });

  it("should find category by id", async () => {
    const mockCategory = { id: "1", name: "Food", accountId: "a1" };
    mockCategoryRepo.findById = vi.fn().mockResolvedValue(mockCategory);

    const category = await categoryUseCase.findById("1");

    expect(category).toEqual(mockCategory);
    expect(mockCategoryRepo.findById).toHaveBeenCalledWith("1");
  });

  it("should return null when category not found by id", async () => {
    mockCategoryRepo.findById = vi.fn().mockResolvedValue(null);

    const category = await categoryUseCase.findById("999");

    expect(category).toBeNull();
    expect(mockCategoryRepo.findById).toHaveBeenCalledWith("999");
  });

  it("should find categories by account id", async () => {
    const mockCategories = [
      { id: "1", name: "Food", accountId: "a1" },
      { id: "2", name: "Transportation", accountId: "a1" },
    ];
    mockCategoryRepo.findCategoriesByAccountId = vi
      .fn()
      .mockResolvedValue(mockCategories);

    const categories = await categoryUseCase.findByAccount("a1");

    expect(categories).toEqual(mockCategories);
    expect(mockCategoryRepo.findCategoriesByAccountId).toHaveBeenCalledWith(
      "a1"
    );
  });

  it("should create category successfully", async () => {
    const mockCreatedCategory = { id: "1", name: "Food", accountId: "a1" };
    mockCategoryRepo.findCategoriesByAccountId = vi.fn().mockResolvedValue([]);
    mockCategoryRepo.create = vi.fn().mockResolvedValue(mockCreatedCategory);

    const category = await categoryUseCase.create({
      accountId: "a1",
      name: "Food",
    });

    expect(category).toEqual(mockCreatedCategory);
    expect(mockCategoryRepo.create).toHaveBeenCalledWith({
      accountId: "a1",
      name: "Food",
    });
  });

  it("should throw error if category name already exists for account", async () => {
    const existingCategories = [{ id: "1", name: "Food", accountId: "a1" }];
    mockCategoryRepo.findCategoriesByAccountId = vi
      .fn()
      .mockResolvedValue(existingCategories);

    await expect(
      categoryUseCase.create({ accountId: "a1", name: "Food" })
    ).rejects.toThrow("Category name already exists for this account.");
  });

  it("should update category successfully", async () => {
    const mockUpdatedCategory = {
      id: "1",
      name: "Food Updated",
      accountId: "a1",
    };
    mockCategoryRepo.findById = vi.fn().mockResolvedValue(mockUpdatedCategory);
    mockCategoryRepo.findCategoriesByAccountId = vi.fn().mockResolvedValue([]);
    mockCategoryRepo.update = vi.fn().mockResolvedValue(mockUpdatedCategory);

    const category = await categoryUseCase.update("1", {
      name: "Food Updated",
    });

    expect(category).toEqual(mockUpdatedCategory);
    expect(mockCategoryRepo.update).toHaveBeenCalledWith("1", {
      name: "Food Updated",
    });
  });

  it("should throw error when updating non-existent category", async () => {
    mockCategoryRepo.findById = vi.fn().mockResolvedValue(null);

    await expect(
      categoryUseCase.update("999", { name: "Updated" })
    ).rejects.toThrow("Category not found");
  });

  it("should throw error when updating with existing name for same account", async () => {
    const existingCategory = { id: "1", name: "Food", accountId: "a1" };
    const conflictingCategories = [
      { id: "2", name: "Food Updated", accountId: "a1" },
    ];
    mockCategoryRepo.findById = vi.fn().mockResolvedValue(existingCategory);
    mockCategoryRepo.findCategoriesByAccountId = vi
      .fn()
      .mockResolvedValue(conflictingCategories);

    await expect(
      categoryUseCase.update("1", { name: "Food Updated" })
    ).rejects.toThrow("Category name already exists for this account.");
  });

  it("should delete category successfully", async () => {
    const mockCategory = { id: "1", name: "Food", accountId: "a1" };
    mockCategoryRepo.findById = vi.fn().mockResolvedValue(mockCategory);
    mockCategoryRepo.delete = vi.fn().mockResolvedValue(mockCategory);

    const deletedCategory = await categoryUseCase.delete("1");

    expect(deletedCategory).toEqual(mockCategory);
    expect(mockCategoryRepo.delete).toHaveBeenCalledWith("1");
  });

  it("should throw error when deleting non-existent category", async () => {
    mockCategoryRepo.findById = vi.fn().mockResolvedValue(null);

    await expect(categoryUseCase.delete("999")).rejects.toThrow(
      "Category not found"
    );
  });
});
