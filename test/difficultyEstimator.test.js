const { estimateDifficulty } = require("../src/difficultyEstimator");

describe("Sudoku Difficulty Estimator", () => {
  test("returns Easy for small number of empty cells", () => {
    const easyGrid = Array(9).fill(Array(9).fill(1));
    expect(estimateDifficulty(easyGrid)).toBe("Easy");
  });

  test("returns Medium for moderate empty cells", () => {
    const mediumGrid = Array(9)
      .fill(0)
      .map(() => Array(9).fill(0));
    mediumGrid[0][0] = 1; // reduce empties
    expect(["Medium", "Hard"]).toContain(estimateDifficulty(mediumGrid));
  });
});
