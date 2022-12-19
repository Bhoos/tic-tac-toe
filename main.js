class TicTacToeNode {
  constructor(parent, state, position) {
    this.state = state;
    this.parent = parent;
    this.position = position;

    // Figure out the move number
    this.move = state.reduce((a, v) => v != 0 ? a + 1 : a, 0);
    this.me = state[position];
    this.plays = 0;
    this.wins = 0;
  }

  /**
   * Expand a node to produce all child nodes will all possible moves
   */
  expand() {
    const positions = validMoves(this.state);
    this.children = positions.map((pos) => {
      const newState = this.state.slice(0);
      newState[pos] = this.move % 2 === 0 ? '+' : 'o';
      return new TicTacToeNode(this, newState, pos);
    });
    return this.children;
  }

  /**
   * Select a node with highest mcts value
   * @returns 
   */
  selectNode() {
    let selectedNode = null;
    let selectedUCT = 0;

    for (const child of this.children) {
      let childUCT = child.calcUCT();
      if (selectedNode === null || childUCT > selectedUCT) {
        selectedNode = child;
        selectedUCT = childUCT;
      }
    }
    return selectedNode;
  }

  backpropagate(winner) {
    this.plays += 1;
    if (!winner) {
      this.wins += 0.5;
    } else if (this.me === winner) {
      this.wins += 1;
    } else {
      this.wins += 0;
    }

    this.parent.plays += 1;
  }

  calcUCT() {
    // the UCT value is considered infinity for the node that has not been explored.
    if (this.plays == 0) return Number.POSITIVE_INFINITY;

    const exploitation = this.wins / this.plays;
    const c = Math.sqrt(2);
    const exploration = c * Math.sqrt(Math.log2(this.parent.plays) / this.plays);

    return exploitation + exploration;
  }

  dump() {
    console.log(`Position: ${this.position}, Plays: ${this.plays}, Wins: ${this.wins}, Me: ${this.me}`);
  }

  simulate() {
    const state = this.state.slice();

    let move = this.move;
    while (move < 8) {
      move += 1;
      const positions = validMoves(state);
      // Get a random position to move to
      const idx = Math.floor(Math.random() * positions.length);
      const position = positions[idx];

      // Remove the used position
      positions.splice(idx, 1);

      // Get the player symbol
      const player = move % 2 == 0 ? '+' : 'o';
      state[position] = player;

      // Does this move win the game
      if (checkWin(state, position, player)) {
        return player;
      }
    }

    return null;
  }
}

/**
 * For the given state of the game, retrieve all the
 * valid moves
 */
function validMoves(state) {
  const positions = [];
  state.forEach((v, idx) => {
    if (v === 0) positions.push(idx);
  })
  return positions;
}

/**
 * For the given state of the game, check if placing the
 * player at the given position results in a win
 */
function checkWin(state, position, player) {
  const row = Math.floor(position / 3);
  const col = position % 3;

  // Check if the player made the column
  if (state[row*3] == player && state[row*3+1] == player && state[row*3+2] == player) {
    return true;
  }

  // Check if the player made the row
  if (state[col] == player && state[col + 3] == player && state[col + 6] == player) {
    return true;
  }

  // Check if the player made the diagonal
  if (row == col) {
    if (state[0] == player && state[4] == player && state[8] == player) {
      return true;
    }
  }

  // Check if the player made the other diagonal
  if (row == 2 - col) {
    if (state[2] == player && state[4] == player && state[6] == player) {
      return true;
    }
  }

  return false;
}

function main(initialState) {
  // how to play tic tac toe
  const ticTacToeState = [ 0 , 0 , '+',  
                          'o', 0 ,  0 ,  
                          '+', 0 , 0 ];

  // Create the root node to start with
  const rootNode = new TicTacToeNode(null, initialState, -1);

  // Expand the nodes and see if we get the win on the first move
  const nodes = rootNode.expand();
  for(const node of nodes) {
    if (checkWin(node.state, node.position, node.me)) {
      return node;
    }
  }
  
  // Run the simulation 10,000 times
  for (let i = 0; i < 10000; i += 1) {
    const node = rootNode.selectNode();
    const winner = node.simulate();
    node.backpropagate(winner);
  }

  // Dislpay the dump
  nodes.forEach(node => node.dump());

  // Find the node that has been explored the highest number of times
  nodes.sort((n1, n2) => n2.plays - n1.plays);
  return nodes[0];
}

const chosen = main(['+', 0, 0,   0, 'o', 0,   0, 0, 0]);

console.log(`Result: Position: ${chosen.position}, plays: ${chosen.plays}, wins: ${chosen.wins}`);
