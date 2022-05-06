import { useRef, useState } from 'react'
import './App.css'

const BOT_PORT = 7777;
const url = `http://localhost:${BOT_PORT}/play`;

type GameChars = 'x' | 'o' | '';

type CellProps = {
  row: number,
  col: number,
  turn: number,
  state: GameState,
  updateState: (row: number, col: number, char: GameChars) => void,
  highlight: boolean,
  disabled: boolean,
}

type GameState = Array<Array<GameChars>>;

const displayCharacters = {
  '': '',
  x: '❌', 
  o: '⭕'
};

const playerCharacters: Array<'x' | 'o'> = ['x', 'o'];

function Cell({ row, col, turn, state, disabled, updateState, highlight }: CellProps) {
  const handleClick = () => {
    if (disabled) return;
    updateState(row, col, getTurnChar(turn));
  }

  return (
    <div className="Cell" onClick={handleClick}>
      <span className={`CellContent${highlight?" Win":""}`}>{displayCharacters[state[row][col]]}</span>
    </div>
  );
}

function App() {
  const [gameState, setGameState] = useState<GameState>([
    ["", "", ""], 
    ["", "", ""], 
    ["", "", ""]
  ]);

  const turnRef = useRef(0);
  const turn = getTurn(gameState);
  turnRef.current = turn;

  const updateState = (row: number, col: number, char: 'x' | 'o' | '') => {
    setGameState((state) => {
      const newState = state.slice(0);
      newState[row] = newState[row].slice(0);
      newState[row][col] = char;
      return newState;
    });
  }
  
  const playBot = async () => {
    // Save bot turn to make sure that it's still the same turn
    // to play for
    const botTurn = turn;
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        turn,
        state: gameState,
      }),
    });
    const resp = await response.json();
    console.log('Response', resp);
    const {row, col} = resp;
    if (botTurn !== turnRef.current) {
      console.log('Turn already played');
      return;
    }

    if (gameState[row][col] !== '') {
      console.log('Invalid move');
      return;
    }

    updateState(row, col, getTurnChar(botTurn));
  }

  
  const [winner, solution] = findSolution(gameState);
  const completed = Boolean(winner || turn >= 9);
  return (
    <div className="App">
      <div className="Board">
        {gameState.map((row, r) => (
          <div className="Row" key={r}>
          {row.map((cell, c) => {
            const highlight = Boolean(solution && solution[r][c]);
            const disabled = Boolean(cell || completed);
            return (
              <Cell highlight={highlight} key={c} row={r} col={c} state={gameState} updateState={updateState} turn={turn} disabled={disabled} />
            )
          })}
          </div>
        ))}
      </div>
      <div className="Status">
        <span>{winner ? `${displayCharacters[winner]} WON` : getTurnInfo(turn)}</span>
      </div>
      <button disabled={completed} className="Button" onClick={playBot}>BOT</button>
      <span className="ButtonInfo">{url}</span>
    </div>
  )
}

function getTurnInfo(turn: number) {
  if (turn < 9) {
    return getDisplayChar(turn) + ' TURN'
  } else {
    return 'DRAW';
  }
}

function getTurn(gameState: Array<Array<string>>) {
  let turn = 0;
  for (let r = 0; r < 3; r += 1) {
    for (let c = 0; c < 3; c += 1) {
      if (gameState[r][c] !== '') turn += 1;
    }
  }
  return turn;
}

const solutions = [
  [[1, 1, 1], [0, 0, 0], [0, 0, 0]],
  [[0, 0, 0], [1, 1, 1], [0, 0, 0]],
  [[0, 0, 0], [0, 0, 0], [1, 1, 1]],

  [[1, 0, 0], [1, 0, 0], [1, 0, 0]],
  [[0, 1, 0], [0, 1, 0], [0, 1, 0]],
  [[0, 0, 1], [0, 0, 1], [0, 0, 1]],

  [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
  [[0, 0, 1], [0, 1, 0], [1, 0, 0]],
];

function findSolution(gameState: GameState): [
  'x' | 'o' | '', (number[][] | null)
] {
  for (let i = 0; i < solutions.length; i += 1) {
    const solution = solutions[i];

    let prev: null | 'x' | 'o' | '' = null;
    let found = 0;
    for (let r = 0; r < solution.length; r += 1) {
      const row = solution[r];
      for (let c = 0; c < row.length; c += 1) {
        const flag = row[c];
        if (!flag) continue;
        const cell = gameState[r][c];
        if (!cell) break;
        if (!prev || prev === cell) {
          prev = cell;
          found += 1;
        } else {
          break;
        }
      }
    }
    if (prev !== null && found === 3) return [prev, solution];
  }
  return ["", null];
}

function getTurnChar(turn: number): 'x' | 'o' | '' {
  return playerCharacters[turn % 2];
}

function getDisplayChar(turn: number) {
  return displayCharacters[getTurnChar(turn)];
}

export default App
