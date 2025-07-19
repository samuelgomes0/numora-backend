import { IGoalRepository } from "@/interfaces";
import { GoalUseCase } from "@/usecases";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGoalRepo = {
  findAll: vi.fn().mockResolvedValue([]),
  findById: vi.fn(),
  findGoalsByAccountId: vi.fn().mockResolvedValue([]),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
} as unknown as IGoalRepository;

describe("GoalUseCase", () => {
  let goalUseCase: GoalUseCase;

  beforeEach(() => {
    goalUseCase = new GoalUseCase(mockGoalRepo);
    vi.clearAllMocks();
  });

  it("should return all goals", async () => {
    const mockGoals = [
      {
        id: "1",
        name: "Vacation",
        targetAmount: 5000,
        currentAmount: 1000,
        accountId: "a1",
      },
      {
        id: "2",
        name: "New Car",
        targetAmount: 25000,
        currentAmount: 5000,
        accountId: "a1",
      },
    ];
    mockGoalRepo.findAll = vi.fn().mockResolvedValue(mockGoals);

    const goals = await goalUseCase.findAll();

    expect(goals).toEqual(mockGoals);
    expect(mockGoalRepo.findAll).toHaveBeenCalledOnce();
  });

  it("should find goal by id", async () => {
    const mockGoal = {
      id: "1",
      name: "Vacation",
      targetAmount: 5000,
      currentAmount: 1000,
      accountId: "a1",
    };
    mockGoalRepo.findById = vi.fn().mockResolvedValue(mockGoal);

    const goal = await goalUseCase.findById("1");

    expect(goal).toEqual(mockGoal);
    expect(mockGoalRepo.findById).toHaveBeenCalledWith("1");
  });

  it("should return null when goal not found by id", async () => {
    mockGoalRepo.findById = vi.fn().mockResolvedValue(null);

    const goal = await goalUseCase.findById("999");

    expect(goal).toBeNull();
    expect(mockGoalRepo.findById).toHaveBeenCalledWith("999");
  });

  it("should find goals by account id", async () => {
    const mockGoals = [
      {
        id: "1",
        name: "Vacation",
        targetAmount: 5000,
        currentAmount: 1000,
        accountId: "a1",
      },
      {
        id: "2",
        name: "New Car",
        targetAmount: 25000,
        currentAmount: 5000,
        accountId: "a1",
      },
    ];
    mockGoalRepo.findGoalsByAccountId = vi.fn().mockResolvedValue(mockGoals);

    const goals = await goalUseCase.findByAccount("a1");

    expect(goals).toEqual(mockGoals);
    expect(mockGoalRepo.findGoalsByAccountId).toHaveBeenCalledWith("a1");
  });

  it("should create goal successfully", async () => {
    const mockCreatedGoal = {
      id: "1",
      name: "Vacation",
      targetAmount: 5000,
      currentAmount: 0,
      accountId: "a1",
    };
    mockGoalRepo.findGoalsByAccountId = vi.fn().mockResolvedValue([]);
    mockGoalRepo.create = vi.fn().mockResolvedValue(mockCreatedGoal);

    const goal = await goalUseCase.create({
      accountId: "a1",
      name: "Vacation",
      targetAmount: 5000,
    });

    expect(goal).toEqual(mockCreatedGoal);
    expect(mockGoalRepo.create).toHaveBeenCalledWith({
      accountId: "a1",
      name: "Vacation",
      targetAmount: 5000,
    });
  });

  it("should throw error if goal name already exists for account", async () => {
    const existingGoals = [
      {
        id: "1",
        name: "Vacation",
        targetAmount: 5000,
        currentAmount: 1000,
        accountId: "a1",
      },
    ];
    mockGoalRepo.findGoalsByAccountId = vi
      .fn()
      .mockResolvedValue(existingGoals);

    await expect(
      goalUseCase.create({
        accountId: "a1",
        name: "Vacation",
        targetAmount: 6000,
      })
    ).rejects.toThrow("Goal name already exists for this account.");
  });

  it("should update goal successfully", async () => {
    const mockUpdatedGoal = {
      id: "1",
      name: "Vacation Updated",
      targetAmount: 6000,
      currentAmount: 1000,
      accountId: "a1",
    };
    mockGoalRepo.findById = vi.fn().mockResolvedValue(mockUpdatedGoal);
    mockGoalRepo.findGoalsByAccountId = vi.fn().mockResolvedValue([]);
    mockGoalRepo.update = vi.fn().mockResolvedValue(mockUpdatedGoal);

    const goal = await goalUseCase.update("1", {
      name: "Vacation Updated",
      targetAmount: 6000,
    });

    expect(goal).toEqual(mockUpdatedGoal);
    expect(mockGoalRepo.update).toHaveBeenCalledWith("1", {
      name: "Vacation Updated",
      targetAmount: 6000,
    });
  });

  it("should throw error when updating non-existent goal", async () => {
    mockGoalRepo.findById = vi.fn().mockResolvedValue(null);

    await expect(
      goalUseCase.update("999", { name: "Updated" })
    ).rejects.toThrow("Goal not found");
  });

  it("should throw error when updating with existing name for same account", async () => {
    const existingGoal = {
      id: "1",
      name: "Vacation",
      targetAmount: 5000,
      currentAmount: 1000,
      accountId: "a1",
    };
    const conflictingGoals = [
      {
        id: "2",
        name: "Vacation Updated",
        targetAmount: 6000,
        currentAmount: 2000,
        accountId: "a1",
      },
    ];
    mockGoalRepo.findById = vi.fn().mockResolvedValue(existingGoal);
    mockGoalRepo.findGoalsByAccountId = vi
      .fn()
      .mockResolvedValue(conflictingGoals);

    await expect(
      goalUseCase.update("1", { name: "Vacation Updated", targetAmount: 6000 })
    ).rejects.toThrow("Goal name already exists for this account.");
  });

  it("should delete goal successfully", async () => {
    const mockGoal = {
      id: "1",
      name: "Vacation",
      targetAmount: 5000,
      currentAmount: 1000,
      accountId: "a1",
    };
    mockGoalRepo.findById = vi.fn().mockResolvedValue(mockGoal);
    mockGoalRepo.delete = vi.fn().mockResolvedValue(mockGoal);

    const deletedGoal = await goalUseCase.delete("1");

    expect(deletedGoal).toEqual(mockGoal);
    expect(mockGoalRepo.delete).toHaveBeenCalledWith("1");
  });

  it("should throw error when deleting non-existent goal", async () => {
    mockGoalRepo.findById = vi.fn().mockResolvedValue(null);

    await expect(goalUseCase.delete("999")).rejects.toThrow("Goal not found");
  });

  it("should update goal progress successfully", async () => {
    const mockGoal = {
      id: "1",
      name: "Vacation",
      targetAmount: 5000,
      currentAmount: 1000,
      accountId: "a1",
    };
    const updatedGoal = {
      id: "1",
      name: "Vacation",
      targetAmount: 5000,
      currentAmount: 1500,
      accountId: "a1",
    };
    mockGoalRepo.findById = vi.fn().mockResolvedValue(mockGoal);
    mockGoalRepo.update = vi.fn().mockResolvedValue(updatedGoal);

    const goal = await goalUseCase.updateProgress("1", 500);

    expect(goal).toEqual(updatedGoal);
    expect(mockGoalRepo.update).toHaveBeenCalledWith("1", {
      currentAmount: 1500,
    });
  });

  it("should throw error when updating progress for non-existent goal", async () => {
    mockGoalRepo.findById = vi.fn().mockResolvedValue(null);

    await expect(goalUseCase.updateProgress("999", 500)).rejects.toThrow(
      "Goal not found"
    );
  });

  it("should throw error when progress amount is negative", async () => {
    const mockGoal = {
      id: "1",
      name: "Vacation",
      targetAmount: 5000,
      currentAmount: 1000,
      accountId: "a1",
    };
    mockGoalRepo.findById = vi.fn().mockResolvedValue(mockGoal);

    await expect(goalUseCase.updateProgress("1", -500)).rejects.toThrow(
      "Progress amount cannot be negative"
    );
  });
});
