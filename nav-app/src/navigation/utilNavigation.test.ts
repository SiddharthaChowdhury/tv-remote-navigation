import utilNavigation from "./utilNavigation";

describe("testing util", () => {
  it("Should return proper result", () => {
    const x = utilNavigation.vsStringToNumberArr("1,3");
    expect(x).toEqual([1, 3]);
  });
});
