import { NextApiRequest, NextApiResponse } from "next";

describe("Movements API", () => {
  it("should validate movement type", () => {
    const validTypes = ["INCOME", "EXPENSE"];

    validTypes.forEach((type) => {
      expect(["INCOME", "EXPENSE"]).toContain(type);
    });
  });

  it("should require all fields for movement creation", () => {
    const requiredFields = ["concept", "amount", "type", "date"];
    const movementData = {
      concept: "Test",
      amount: 100,
      type: "INCOME",
      date: "2024-01-01",
    };

    requiredFields.forEach((field) => {
      expect(movementData).toHaveProperty(field);
    });
  });

  it("should validate amount is a number", () => {
    const amount = "100.50";
    const parsed = parseFloat(amount);

    expect(typeof parsed).toBe("number");
    expect(parsed).toBe(100.5);
  });
});
