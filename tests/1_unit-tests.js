const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
    var testPuzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';

    test('Logic handles a valid puzzle string of 81 characters', function(){
        assert.isNull(solver.validate(testPuzzle), 'should return null');
    });

    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function(){
        var invPuzzle = testPuzzle.replace('3', 'a');
        assert.deepEqual(solver.validate(invPuzzle), { error: 'Invalid characters in puzzle' }, 'should return error');
    });

    test('Logic handles a puzzle string that is not 81 characters in length', function(){
        var invPuzzle = testPuzzle + '4';
        assert.equal(solver.validate(invPuzzle).error, 'Expected puzzle to be 81 characters long', 'should return error');
        invPuzzle.slice(75);
        assert.equal(solver.validate(invPuzzle).error, 'Expected puzzle to be 81 characters long', 'should return error');
    });

    test('Logic handles a valid row placement', function(){
        assert.isFalse(solver.checkRowPlacement(testPuzzle, 0, 0, 7), 'should return false');
    });

    test('Logic handles an invalid row placement', function(){
        assert.isTrue(solver.checkRowPlacement(testPuzzle, 0, 0, 5), 'should return true');
    });

    test('Logic handles a valid column placement', function(){
        assert.isFalse(solver.checkColPlacement(testPuzzle, 0, 0, 7), 'should return false');
    });

    test('Logic handles an invalid column placement', function(){
        assert.isTrue(solver.checkColPlacement(testPuzzle, 0, 0, 6), 'should return true');
    });
    
    test('Logic handles a valid region (3x3 grid) placement', function(){
        assert.isFalse(solver.checkRegionPlacement(testPuzzle, 0, 0, 7), 'should return false');
    });

    test('Logic handles an invalid region (3x3 grid) placement', function(){
        assert.isTrue(solver.checkRegionPlacement(testPuzzle, 0, 0, 2), 'should return true');
    });

    test('Valid puzzle strings pass the solver', function(){
        assert.deepEqual(solver.solve(testPuzzle), { solution: '769235418851496372432178956174569283395842761628713549283657194516924837947381625'}, 'should return solution');
    });

    test('Invalid puzzle strings fail the solver', function(){
        var invPuzzle = testPuzzle.replace('3', '5');
        assert.deepEqual(solver.solve(invPuzzle), { error: 'Puzzle cannot be solved' }, 'should return error');
    });

    test('Solver returns the expected solution for an incomplete puzzle', function(){
        var invPuzzle = testPuzzle.replace('3', '.');
        assert.deepEqual(solver.solve(invPuzzle), { error: 'Puzzle cannot be solved' }, 'should return error');
    });

});
