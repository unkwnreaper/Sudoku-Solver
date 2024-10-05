'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {

      const { puzzle, coordinate, value } = req.body;
      if (!puzzle || !coordinate || !value) {
        res.json({ error: "Required field(s) missing"});
        return;
      }

      if ( !/^[a-i][1-9]$/i.test(coordinate) ) {
        res.json({ error: "Invalid coordinate"});
        return;
      }

      if (!/^[1-9]$/.test(value)) {
        res.json({ error: "Invalid value"});
        return;
      }

      var isValid = solver.validate(puzzle);
      if (isValid) {
        res.json(isValid);
        return;
      }

      var rowNum={
        a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7, i: 8
      }
      const col = Number(coordinate[1]) - 1;
      const row = rowNum[coordinate[0].toLowerCase()];
      const val = Number(value);
      var conflict = [];

      if (solver.checkColPlacement(puzzle, row, col, val)) conflict.push("column");
      if (solver.checkRowPlacement(puzzle, row, col, val)) conflict.push("row");
      if (solver.checkRegionPlacement(puzzle, row, col, val)) conflict.push("region");
      
      if (conflict.length) {
        res.json({ valid: false, conflict: conflict });
        return;
      }
      else {
        res.json({ valid: true });
        return;
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      if (req.body.puzzle) {
        const puzzle = req.body.puzzle;
        var isValid = solver.validate(puzzle);
        if (isValid) {
          res.json(isValid);
          return;
        }
        else  res.json(solver.solve(puzzle));
      }
      else res.json({ error: 'Required field missing' });

    });
};
