const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    
    var testPuzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';

    suite('Solve Tests', () => {
        test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function (done) {
            chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({puzzle: testPuzzle})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { solution: '769235418851496372432178956174569283395842761628713549283657194516924837947381625'}, 'should respond with the solution');
                done();
            });
        });

        test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function (done) {
            chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({puzzle: ''})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: 'Required field missing' }, 'should respond with an error');
                done();
            });
        });

        test('Solve a puzzle with invalid characters: POST request to /api/solve', function (done) {
            var invPuzzle = testPuzzle.replace('3', 'a');
            chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({puzzle: invPuzzle})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' }, 'should respond with an error');
                done();
            });
        });

        test('Solve a puzzle with incorrect length: POST request to /api/solve', function (done) {
            var invPuzzle = testPuzzle + '4';
            chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({puzzle: invPuzzle})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' }, 'should respond with an error');
                done();
            });
        });

        test('Solve a puzzle that cannot be solved: POST request to /api/solve', function (done) {
            var invPuzzle = testPuzzle.replace('3', '.');
            chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({puzzle: invPuzzle})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: 'Puzzle cannot be solved' }, 'should respond with an error');
                done();
            });
        });

    });

    suite('Check Tests', () => {
        test('Check a puzzle placement with all fields: POST request to /api/check', function (done) {
            chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({puzzle: testPuzzle, coordinate: 'A1', value: '7'})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { valid: true }, 'should respond with valid object');
                done();
            });
        });

        test('Check a puzzle placement with single placement conflict: POST request to /api/check', function (done) {
            chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({puzzle: testPuzzle, coordinate: 'A1', value: '2'})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { valid: false, conflict: ['region'] }, 'should respond with region conflict');
                done();
            });
        });

        test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function (done) {
            chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({puzzle: testPuzzle, coordinate: 'A1', value: '1'})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { valid: false, conflict: ['column', 'row'] }, 'should respond with two conflicts');
                done();
            });
        });

        test('Check a puzzle placement with all placement conflicts: POST request to /api/check', function (done) {
            chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({puzzle: testPuzzle, coordinate: 'A1', value: '5'})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { valid: false, conflict: ['column', 'row', 'region'] }, 'should respond with all conflicts');
                done();
            });
        });

        test('Check a puzzle placement with missing required fields: POST request to /api/check', function (done) {
            chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({puzzle: testPuzzle, coordinate: 'A1'})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: 'Required field(s) missing'}, 'should respond with error');
                done();
            });
        });

        test('Check a puzzle placement with invalid characters: POST request to /api/check', function (done) {
            var invPuzzle = testPuzzle.replace('3', 'a');
            chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({puzzle: invPuzzle, coordinate: 'A1', value: '5'})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: 'Invalid characters in puzzle'}, 'should respond with error');
                done();
            });
        });

        test('Check a puzzle placement with incorrect length: POST request to /api/check', function (done) {
            var invPuzzle = testPuzzle + '4';
            chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({puzzle: invPuzzle, coordinate: 'A1', value: '5'})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' }, 'should respond with error');
                done();
            });
        });

        test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function (done) {
            chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({puzzle: testPuzzle, coordinate: 'J1', value: '5'})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: 'Invalid coordinate'}, 'should respond with error');
                done();
            });
        });

        test('Check a puzzle placement with invalid placement value: POST request to /api/check', function (done) {
            chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({puzzle: testPuzzle, coordinate: 'A1', value: '0'})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: 'Invalid value'}, 'should respond with error');
                done();
            });
        });

    });

});