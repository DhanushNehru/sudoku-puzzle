function estimateDifficulty(grid) {
  // Count empty cells (0 represents blank)
  const empties = grid.flat().filter((cell) => cell === 0).length;

  // Simple heuristic for difficulty
  if (empties <= 35) return "Easy";
  if (empties <= 50) return "Medium";
  return "Hard";
}

module.exports = { estimateDifficulty };
