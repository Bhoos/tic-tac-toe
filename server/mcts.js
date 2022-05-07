import { TreeNode } from './TreeNode.js';

const simulations = 10000;

export function mcts(state, turn) {
  const rootNode = new TreeNode(-1, -1, state, turn - 1, null);
  rootNode.expand();
  
  for (let i = 0; i < simulations; i += 1) {
    const selectedNode = rootNode.search(i).expand();
    selectedNode.simulate();
  }

  let selectedNode = null;
  rootNode.children.forEach(node => {
    console.log('Win = ', node.win, 'Simul', node.n);
    if (selectedNode === null || node.n > selectedNode.n) {
      selectedNode = node;
    }
  });

  return {
    row: selectedNode.row,
    col: selectedNode.col,
  };
}
