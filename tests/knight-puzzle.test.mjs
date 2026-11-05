import test from 'node:test';
import assert from 'node:assert/strict';
import { initialPuzzle, isKnightMove, puzzleReducer, squareName, startSquare, targetSquare } from '../app/alternate/knight-puzzle.ts';

const offsets = [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]];

test('every board square exposes exactly the legal knight destinations', () => {
  let edges = 0;
  for (let from = 0; from < 64; from++) {
    const row = Math.floor(from / 8), col = from % 8;
    const expected = new Set(offsets.map(([dx, dy]) => [col + dx, row + dy])
      .filter(([x, y]) => x >= 0 && x < 8 && y >= 0 && y < 8).map(([x, y]) => y * 8 + x));
    for (let to = 0; to < 64; to++) {
      assert.equal(isKnightMove(from, to), expected.has(to), `${squareName(from)} → ${squareName(to)}`);
      if (isKnightMove(from, to)) edges++;
    }
  }
  assert.equal(edges, 336);
});

test('rejects invalid coordinates and moves without changing the state', () => {
  for (const value of [-1, 64, 1.5, NaN, Infinity]) {
    assert.equal(isKnightMove(startSquare, value), false);
    assert.equal(isKnightMove(value, startSquare), false);
    assert.strictEqual(puzzleReducer(initialPuzzle, { type: 'move', to: value }), initialPuzzle);
  }
  assert.strictEqual(puzzleReducer(initialPuzzle, { type: 'move', to: 56 }), initialPuzzle);
});

test('the target is reachable in exactly three moves and not fewer', () => {
  let frontier = new Set([startSquare]);
  for (let depth = 0; depth <= 3; depth++) {
    assert.equal(frontier.has(targetSquare), depth === 3);
    frontier = new Set([...frontier].flatMap(from => Array.from({ length: 64 }, (_, i) => i).filter(to => isKnightMove(from, to))));
  }
});

test('winning sequence, repeated-click guard, finished-state lock, and reset', () => {
  let state = puzzleReducer(initialPuzzle, { type: 'move', to: 51 }); // d2
  assert.deepEqual(state, { position: 51, moves: 1 });
  assert.strictEqual(puzzleReducer(state, { type: 'move', to: 51 }), state);
  state = puzzleReducer(state, { type: 'move', to: 36 }); // e4
  state = puzzleReducer(state, { type: 'move', to: targetSquare });
  assert.deepEqual(state, { position: targetSquare, moves: 3 });
  assert.strictEqual(puzzleReducer(state, { type: 'move', to: 36 }), state);
  assert.deepEqual(puzzleReducer(state, { type: 'reset' }), initialPuzzle);
});

test('a longer legal route retains its actual move count', () => {
  const state = [40, startSquare, 51, 36, targetSquare].reduce((current, to) => puzzleReducer(current, { type: 'move', to }), initialPuzzle);
  assert.deepEqual(state, { position: targetSquare, moves: 5 });
  assert.equal(squareName(startSquare), 'b1');
  assert.equal(squareName(targetSquare), 'g5');
});
