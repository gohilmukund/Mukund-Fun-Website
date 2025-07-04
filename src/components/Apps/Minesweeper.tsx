
import React, { useCallback, useEffect, useRef, useState } from 'react';

type Cell = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
};

const ROWS = 9;
const COLS = 9;
const MINES = 10;

const createEmptyGrid = (): Cell[][] =>
  Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      adjacentMines: 0,
    }))
  );

function placeMines(grid: Cell[][], firstClick: [number, number]) {
  let minesPlaced = 0;
  while (minesPlaced < MINES) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if ((r === firstClick[0] && c === firstClick[1]) || grid[r][c].isMine) continue;
    grid[r][c].isMine = true;
    minesPlaced++;
  }
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (!grid[r][c].isMine) {
        grid[r][c].adjacentMines = countAdjacentMines(grid, r, c);
      }
    }
  }
}

function countAdjacentMines(grid: Cell[][], row: number, col: number): number {
  let count = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && grid[nr][nc].isMine) count++;
    }
  }
  return count;
}

const Minesweeper: React.FC = () => {
  const [grid, setGrid] = useState<Cell[][]>(() => createEmptyGrid());
  const [flagsPlaced, setFlagsPlaced] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [firstClick, setFirstClick] = useState(true);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [win, setWin] = useState(false);
  const [commentary, setCommentary] = useState("Let's play! Click a square.");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer effect
  useEffect(() => {
    if (timerActive && !gameOver && !win) {
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerActive, gameOver, win]);

  // Win check
  useEffect(() => {
    if (gameOver) return;
    let revealed = 0;
    let correctlyFlagged = 0;
    grid.forEach(row => row.forEach(cell => {
      if (cell.isRevealed && !cell.isMine) revealed++;
      if (cell.isFlagged && cell.isMine) correctlyFlagged++;
    }));
    const totalNonMine = ROWS * COLS - MINES;
    if (revealed === totalNonMine || (correctlyFlagged === MINES && flagsPlaced === MINES)) {
      setWin(true);
      setGameOver(true);
      setCommentary('You win! 😎');
    }
  }, [grid, flagsPlaced, gameOver]);

  const resetGame = useCallback(() => {
    setGrid(createEmptyGrid());
    setFlagsPlaced(0);
    setGameOver(false);
    setFirstClick(true);
    setTimer(0);
    setTimerActive(false);
    setWin(false);
    setCommentary("Let's play! Click a square.");
  }, []);

  const revealCell = (r: number, c: number, gridCopy: Cell[][]): void => {
    const cell = gridCopy[r][c];
    if (cell.isRevealed || cell.isFlagged) return;
    cell.isRevealed = true;
    if (cell.adjacentMines === 0 && !cell.isMine) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
            revealCell(nr, nc, gridCopy);
          }
        }
      }
    }
  };

  const handleCellClick = (r: number, c: number) => {
    if (gameOver || win) return;
    let newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    if (firstClick) {
      placeMines(newGrid, [r, c]);
      setFirstClick(false);
      setTimerActive(true);
    }
    const cell = newGrid[r][c];
    if (cell.isFlagged || cell.isRevealed) return;
    if (cell.isMine) {
      cell.isRevealed = true;
      setGameOver(true);
      setTimerActive(false);
      setCommentary('Game over! 💥');
      // Reveal all mines
      newGrid.forEach(row => row.forEach(cell => { if (cell.isMine) cell.isRevealed = true; }));
      setGrid(newGrid);
      return;
    }
    revealCell(r, c, newGrid);
    setGrid(newGrid);
  };

  const handleCellRightClick = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || win || firstClick) return;
    let newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    const cell = newGrid[r][c];
    if (cell.isRevealed) return;
    cell.isFlagged = !cell.isFlagged;
    setFlagsPlaced(f => f + (cell.isFlagged ? 1 : -1));
    setGrid(newGrid);
  };

  // AI Hint (stub, replace with Gemini integration if needed)
  const getAiHint = async () => {
    if (gameOver || firstClick) { setCommentary('Click a square first!'); return; }
    setCommentary('Thinking...');
    // TODO: Integrate Gemini API for real hints
    setTimeout(() => setCommentary('Try revealing a cell with few adjacent mines!'), 1000);
  };

  return (
    <div className="minesweeper95" style={{ padding: 12, minWidth: 220 }}>
      <h2 style={{ margin: 0 }}>GemSweeper</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '8px 0' }}>
        <span className="minesweeper-flag-count">🚩 {MINES - flagsPlaced}</span>
        <span className="minesweeper-timer">⏱️ {timer}</span>
        <button className="minesweeper-reset-button" onClick={resetGame} style={{ fontSize: 18, marginLeft: 8 }}>
          {gameOver ? (win ? '😎' : '😵') : '🙂'}
        </button>
        <button className="minesweeper-hint-button" onClick={getAiHint} style={{ marginLeft: 8 }}>💡 Hint</button>
      </div>
      <div className="minesweeper-commentary" style={{ minHeight: 24, marginBottom: 8 }}>{commentary}</div>
      <div
        id="minesweeper-board"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, 20px)`,
          gridTemplateRows: `repeat(${ROWS}, 20px)`,
          gap: 1,
          background: '#bdbdbd',
          border: '2px solid #808080',
          width: COLS * 20,
          userSelect: 'none',
        }}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className={`minesweeper-cell${cell.isRevealed ? ' revealed' : ''}${cell.isFlagged ? ' flagged' : ''}${cell.isMine && cell.isRevealed && gameOver && !win ? ' exploded' : ''}`}
              style={{
                width: 20,
                height: 20,
                background: cell.isRevealed ? '#e0e0e0' : '#c0c0c0',
                border: '1px solid #808080',
                textAlign: 'center',
                lineHeight: '20px',
                fontSize: 14,
                cursor: gameOver || win ? 'default' : 'pointer',
                color: cell.isMine && cell.isRevealed ? 'red' : cell.adjacentMines === 1 ? 'blue' : cell.adjacentMines === 2 ? 'green' : cell.adjacentMines > 2 ? 'maroon' : 'black',
                fontWeight: cell.isMine && cell.isRevealed ? 'bold' : undefined,
                userSelect: 'none',
              }}
              onClick={() => handleCellClick(r, c)}
              onContextMenu={e => handleCellRightClick(e, r, c)}
            >
              {cell.isFlagged ? '🚩' : cell.isRevealed ? (cell.isMine ? (gameOver && !win ? '💥' : '💣') : cell.adjacentMines > 0 ? cell.adjacentMines : '') : ''}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Minesweeper;
