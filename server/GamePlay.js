function convertState(state, turn) {
  const availablePositions = [];
  let myPositions = 0;
  let yourPositions = 0;

  const me = turn % 2 === 0 ? 'x' : 'o';

  for (let row = 0; row < 3; row += 1) {
    for(let col = 0; col < 3; col += 1) {
      const k = state[row][col];
      if (k === '') {
        availablePositions.push({ row, col });
      } else if (k === me) {
        myPositions |= toBit(row, col);
      } else {
        yourPositions |= toBit(row, col);
      }
    }
  }

  return {
    availablePositions,
    myPositions,
    yourPositions,
  }
}

export function isGameComplete(state, turn) {
  const {
    availablePositions,
    yourPositions,
    myPositions
  } = convertState(state, turn);

  if (isWinner(myPositions)) {
    return [true, 1];
  }
  if (isWinner(yourPositions)) {
    return [true, 0];
  }
  if (availablePositions.length === 0) {
    return [true, 0.5];
  }

  return [false, 0];
}

export function playGame(state, turn) {
  let {
    availablePositions,
    yourPositions,
    myPositions
  } = convertState(state, turn);

  while (availablePositions.length) {
    turn += 1;

    const k = Math.floor(Math.random() * availablePositions.length);
    const pos = availablePositions.splice(k, 1)[0];

    if (turn % 2 === 0) {
      myPositions |= toBit(pos.row, pos.col);
      if (isWinner(myPositions)) return 1;
    } else {
      yourPositions |= toBit(pos.row, pos.col);
      if (isWinner(yourPositions)) return 0;
    }
  }

  // Return draw value
  return 0.5;
}

function toBit(row, col) {
  return 1 << ((row * 3) + col);
}
      
function isWinner(bitValue) {
  return (
    ((bitValue & 0b000000111) === 0b000000111) ||
    ((bitValue & 0b000111000) === 0b000111000) || 
    ((bitValue & 0b111000000) === 0b111000000) ||
    ((bitValue & 0b100100100) === 0b100100100) ||
    ((bitValue & 0b010010010) === 0b010010010) ||
    ((bitValue & 0b001001001) === 0b001001001) || 
    ((bitValue & 0b100010001) === 0b100010001) ||
    ((bitValue & 0b001010100) === 0b001010100)
  );
}