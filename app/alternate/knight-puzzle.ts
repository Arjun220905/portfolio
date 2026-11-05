export const startSquare = 57; // b1
export const targetSquare = 30; // g5
export const initialPuzzle = { position: startSquare, moves: 0 };

export const squareName = (square: number) => `${'abcdefgh'[square % 8]}${8 - Math.floor(square / 8)}`;

export function isKnightMove(from: number, to: number) {
  if (![from, to].every(square => Number.isInteger(square) && square >= 0 && square < 64)) return false;
  const dx = Math.abs(from % 8 - to % 8);
  const dy = Math.abs(Math.floor(from / 8) - Math.floor(to / 8));
  return dx * dy === 2;
}

type PuzzleState = typeof initialPuzzle;
type PuzzleAction = { type: 'move'; to: number } | { type: 'reset' };

export function puzzleReducer(state: PuzzleState, action: PuzzleAction): PuzzleState {
  if (action.type === 'reset') return initialPuzzle;
  // Recheck against the latest state so queued or repeated clicks cannot count twice.
  if (state.position === targetSquare || !isKnightMove(state.position, action.to)) return state;
  return { position: action.to, moves: state.moves + 1 };
}
