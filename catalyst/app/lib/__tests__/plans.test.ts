import { TIERS, COMPARISON_ROWS, getPlanByKey, getPlanCategories } from "../plans";

describe("plans lib", () => {
  it("should export subscription tiers", () => {
    expect(TIERS).toBeDefined();
    expect(TIERS.length).toBe(5);
    const keys = TIERS.map((t) => t.tierKey);
    expect(keys).toEqual(["free", "basic", "plus", "pro", "ultra"]);
  });

  it("should retrieve plan by tierKey", () => {
    const freePlan = getPlanByKey("free");
    expect(freePlan).toBeDefined();
    expect(freePlan?.name).toBe("Free");

    const proPlan = getPlanByKey("PRO");
    expect(proPlan).toBeDefined();
    expect(proPlan?.alias).toBe("Pulsar");

    const invalidPlan = getPlanByKey("nonexistent");
    expect(invalidPlan).toBeUndefined();
  });

  it("should export comparison categories and feature rows", () => {
    const categories = getPlanCategories();
    expect(categories).toContain("Usage Limits");
    expect(categories).toContain("AI Models");
    expect(categories).toContain("Features");
    expect(categories).toContain("Support");

    COMPARISON_ROWS.forEach((row) => {
      expect(row.values.length).toBe(TIERS.length);
    });
  });
});
