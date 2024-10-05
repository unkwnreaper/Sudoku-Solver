class SudokuSolver {

  validate(puzzleString) {
    if (puzzleString.length != 81) return { error: 'Expected puzzle to be 81 characters long' };
    const regexCheck = /^[1-9.]+$/;
    if (!regexCheck.test(puzzleString)) return { error: 'Invalid characters in puzzle' };
    for (let row = 0, index = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++, index++) {
        if (puzzleString[index] != '.') {
          var val = Number(puzzleString[index]);
          if (this.checkRowPlacement(puzzleString, row, col, val) || this.checkColPlacement(puzzleString, row, col, val) || this.checkRegionPlacement(puzzleString, row, col, val)) {
            return { error: 'Puzzle cannot be solved' };
          }
        }
      }
    }
    return null;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    for (let col = 0; col < 9; col++) {
      if (col != column && Number(puzzleString[col + row * 9]) === value ) return true;
    }
    return false;
  }

  checkColPlacement(puzzleString, row, column, value) {
    for (let rw = 0; rw < 9; rw++) {
      if (rw != row && Number(puzzleString[column + rw * 9]) === value ) return true;
    }
    return false;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let r_start = Math.floor(row / 3) * 3;
    let r_end = r_start + 3;

    let c_start = Math.floor(column / 3) * 3;
    let c_end = c_start + 3;

    for (let i = r_start; i < r_end; i++) {
        for (let j = c_start; j < c_end; j++) {
            if (i !== row && j !== column && puzzleString[i * 9 + j] === `${value}`) {
                return true;
            }
        }
    }
    return false;
  }

  solve(puzzleString) {
    var puzzle = [...puzzleString];

    const puzzleArray = [];
    var solveHash = [];
    for (let row = 0, index = 0; row < 9; row++) {
      puzzleArray[row] = [];
      for (let col = 0; col < 9; col++, index++) {
        puzzleArray[row][col] = [];
        if (puzzle[index] === '.') {
          for (let val = 1; val < 10; val++) {
            if (!this.checkRowPlacement(puzzle, row, col, val) && !this.checkColPlacement(puzzle, row, col, val) && !this.checkRegionPlacement(puzzle, row, col, val))
              puzzleArray[row][col].push(val);
          }
          solveHash[index] = puzzleArray[row][col].length;
          if (solveHash[index] === 1)  puzzle[index] = `${puzzleArray[row][col][0]}`;
        }
        else {
          puzzleArray[row][col].push(Number(puzzleString[index]));
          solveHash[index] = 1;
        }
      }
    }

    while(solveHash.reduce((sum, num) => sum + num, 0) > 81) {
      for (let row = 0, index = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++, index++) {
          for (let pos = 0; pos < puzzleArray[row][col].length && puzzle[index] === '.'; pos++) {
            var val = puzzleArray[row][col][pos];
            if (this.checkRowPlacement(puzzle, row, col, val) || this.checkColPlacement(puzzle, row, col, val) || this.checkRegionPlacement(puzzle, row, col, val)) {
              puzzleArray[row][col].splice(pos, 1);
              solveHash[index] = solveHash[index] - 1;
              if (solveHash[index] == 1)  puzzle[index] = `${puzzleArray[row][col][0]}`;
              row = 0, index = 0, col = 0, pos = 0;
            }
          }
        }
      }
      if (solveHash.reduce((sum, num) => sum + num, 0) > 81) {
        return { error: 'Puzzle cannot be solved' };
      }
    }

    return { solution: puzzle.join('')};
  }
}

module.exports = SudokuSolver;

