import { playGame, isGameComplete } from "./GamePlay.js";

const c = Math.sqrt(2);

export class TreeNode {
  constructor(row, col, gameState, turn, parent) {
    this.row = row;
    this.col = col;
    this.turn = turn;
    if (this.row === -1) {
      this.gameState = gameState;
    } else {
      this.gameState = gameState.slice(0);
      this.gameState[row] = gameState[row].slice(0);
      this.gameState[row][col] = turn % 2 === 0 ? 'x' : 'o';
    }
    
    this.children = [];
    this.parent = parent;
    this.win = 0;
    this.n = 0;

    [this.terminated, this.terminationValue] = isGameComplete(this.gameState, this.turn);
  }

  getUCB(T) {
    if (this.n === 0) return Number.POSITIVE_INFINITY;
    // if (this.terminated) {
    //   return 0;
    // }

    const k = (this.win / this.n) + c * Math.sqrt(Math.log2(T) / this.n);
    return k;
  }

  search(T) {
    if (this.children.length === 0) return this;

    // Select the first child node
    let selectedNode = this.children[0];
    let selectedUCB = selectedNode.getUCB(T);

    for (let i = 1; i < this.children.length; i += 1) {
      const n = this.children[i];
      const ucb = n.getUCB(T);
    
      if (ucb > selectedUCB) {
        selectedNode = n;
        selectedUCB = ucb;
      }
    }

    return selectedNode.search(T);
  }

  expand() {
    if (this.terminated) return this;

    let result = this;
    for (let row = 0; row < 3; row += 1) {
      for (let col = 0; col < 3; col += 1) {
        if (this.gameState[row][col] === '') {
          const childNode = new TreeNode(row, col, this.gameState, this.turn + 1, this);
          if (!childNode.terminated) {
            result = childNode;
          }
          this.children.push(childNode);
        }
      }
    }

    return result;
  }

  simulate() {
    if (this.terminated) {
      this.backPropogate(this.terminationValue);
    } else {
      const w = playGame(this.gameState, this.turn);
      this.backPropogate(w);
    }
  }

  backPropogate(w) {
    this.win += w;
    this.n += 1;

    if (this.parent) {
      this.parent.backPropogate(1 - w);
    }
  }
}
