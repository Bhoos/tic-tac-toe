import math, random



def get_valid_moves(state):
    """
    For the given state of the game, retrieve all the valid moves
    """
    
    return [x for x in range(len(state)) if state[x] == ""]


def check_win(state, position, player):
    """
    For the given state of the game, check if placing the player at the given position results in a win
    """
    
    row = math.floor(position / 3)     # the x axis from the grid
    col = position % 3      # the y axis of the game grid

    # Check if the player made the column
    if state[row * 3] == player and state[row * 3 + 1] == player and state[ row * 3 + 2] == player:
        return True

    # Check if the player made the row
    if state[col] == player and state[col + 3] == player and state[col + 6] == player:
        return True
    
    # Check if the player made the diagonal
    if row == col:
        if state[0] == player and state[4] == player and state[8] == player:
            return True
        
    # Check if the player made the other diagonal``
    if row == 2 - col:
        if state[2] == player and state[4] == player and state[6] == player:
            return True
    
    return False



class TicTacToeNode:
    
    def __init__(self, parent, state, position):
        self.state = state
        self.parent = parent
        self.position = position
        
        # Figure out the move number
        self.move = sum(x != "" for x in state)
        self.me = state[position]
        self.plays = 0
        self.wins = 0
    
    
    def expand_node(self):
        """
        Expand a node to produce all child nodes will all possible moves
        """
        
        positions = get_valid_moves(self.state)
        
        self.children = []
        for pos in positions:
            new_state = self.state.copy()
            new_state[pos] = '+' if self.move % 2 == 0 else 'o'
            self.children.append( TicTacToeNode(self, new_state, pos))
        
        return self.children
    
    
    def select_node(self):
        selected_node = None
        selected_UCT = -float('inf')
        
        for child in self.children:
            child_UCT = child.calc_UCT()
            if child_UCT > selected_UCT:
                selected_node = child
                selected_UCT = child_UCT
        
        return selected_node
    
    
    def backpropagate(self, winner):
        self.plays += 1
        
        if not winner:
            self.wins += 0.5
        
        elif self.me == winner:
            self.wins += 1
        
        else:
            self.wins += 0

        self.parent.plays += 1
    
    
    def calc_UCT(self):
        # The UCT value is considered infinity for the node that has not been explored.
        if self.plays == 0 : return float('inf')
        
        exploitation = self.wins / self.plays
        c = math.sqrt(2)
        exploration = c * math.sqrt(math.log2(self.parent.plays) / self.plays)
        
        return exploitation + exploration

    
    def dump_node(self):
        print(f"Position: {self.position}, Plays: {self.plays}, Wins: {self.wins}, Me: {self.me}")

    
    def simulate_node(self):
        cur_move = self.move
        
        while cur_move < 8:
            cur_state = self.state.copy()
            cur_move += 1
            positions = get_valid_moves(cur_state)
            
            # Get a random position to move to
            position = random.choice(positions)
            
            # Get the player symbol
            player = '+' if cur_move % 2 == 0 else 'o'
            cur_state[position] = player
            
            # Does this move win the game
            if check_win(cur_state, position, player):
                return player



def main(initial_state):
    # Create the root node to start with
    root_node = TicTacToeNode(None, initial_state.copy(), -1)
    
    # Expand the nodes and see if we get the win on the first move
    nodes = root_node.expand_node()
    for node in nodes:
        if check_win(node.state, node.position, node.me):
            return node
    
    # Run the simulation 10,000 times
    for i in range(10000):
        node = root_node.select_node()
        winner = node.simulate_node()
        node.backpropagate(winner)

    # Dislpay the dump
    [node.dump_node() for node in nodes]

    # Find the node that has been explored the highest number of times
    nodes.sort(key=lambda x: x.plays, reverse=True)
    return nodes[0]


chosen = main([ "", "", "o", 
                "", "+", "", 
                "+", "o", ""  ])

print(f"\nResult: Position: {chosen.position}, Plays: {chosen.plays}, Wins: {chosen.wins}")