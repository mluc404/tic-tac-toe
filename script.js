// Core Components:
// Gameboard: Stores the 3x3 grid as an array
// Players: Sepresent the 2 players (X and O mark)
// Game Controller: Manages the flow of the game (turns, win conditions,...)
// Display Contrller (later): Handles rendering to the DOM and user

// Key Concepts:
// The three main objects
// 1. Store the gameboard as an array inside a Gameboard object
// 2. The players are stored in objects
// 3. Another object to control the flow of the game
// Use Factory functions or constructors to create objects
// Use IFFE for single-instance objects
// Use Closures for encapsulation (hiding internal details)
// Minimize global variables by tucking logic inside objects

// Create gameboard object
function createGameboard() {
  let arr = new Array(9).fill("");
  let isMarkValid = false;

  let getBoard = () => arr;
  let placeMark = (position, mark) => {
    if (arr[position] === "") {
      arr[position] = mark;
      isMarkValid = true;
    } else {
      isMarkValid = false;
      alert(`This spot ${position} is already taken. Choose a differnt spot`);
    }
    return isMarkValid;
  };

  let reset = () => arr.fill("");

  return { getBoard, placeMark, reset };
}
let board = createGameboard();

// Create player object
function createPlayer(name, mark) {
  return { name, mark };
}
let playerX = createPlayer("Mike", "x");
let playerO = createPlayer("Elle", "o");

// Create Game Controller
// Track the current player, game state (active or over), and use the Gameboard object
// Include methods like playTurn(), checkWinner(), resetGame()
function gameController(board, playerX, playerO) {
  let currentPlayer = playerX;
  let turnCount = 0;
  let isGameOver = false;
  let winner = null;

  let winCondition = {
    con1: [0, 1, 2],
    con2: [3, 4, 5],
    con3: [6, 7, 8],
    con4: [0, 3, 6],
    con5: [1, 4, 7],
    con6: [2, 5, 8],
    con7: [0, 4, 8],
    con8: [2, 4, 6],
  };

  // Only run checkWinOrTie() when turnCount is at least 4
  // because there cant be a winner under 4 turns
  let checkWinOrTie = () => {
    for (let con in winCondition) {
      // Check if playerX wins
      let doesXwin = winCondition[con].every(
        (index) => board.getBoard()[index] === "x"
      );
      if (doesXwin) {
        winner = playerX;
        isGameOver = true;
        console.log(`Winner is x after ${turnCount} turns`);
        console.log("Location: ", winCondition[con]);
        console.log(board.getBoard());
        return;
      }
      // Check if playerO win
      let doesOwin = winCondition[con].every(
        (index) => board.getBoard()[index] === "o"
      );
      if (doesOwin) {
        winner = playerO;
        isGameOver = true;
        console.log(`Winner is o after ${turnCount} turns`);
        console.log("Location: ", winCondition[con]);
        console.log(board.getBoard());
        return;
      }
    }
    // After running the loop, and there's no winner, check if the array is full
    // If array is full, the game is a tie
    if (!board.getBoard().includes("")) {
      isGameOver = true;
      console.log("This game is a tie");
    }
  };

  // Function to play each turn
  // Check if game is over first
  // todo: need a better way to switch player, prevent invalid moves
  let playTurn = (n) => {
    // if (turnCount >= 4) checkWinOrTie(); // why checkWinOrTie doesn't work properly out here, but works fine inside the below if() ???
    // console.log(turnCount);
    // console.log(`is game over: ${isGameOver}`);
    // console.log(`winner: ${winner}`);
    if (!isGameOver && winner === null) {
      turnCount % 2 === 0
        ? (currentPlayer = playerX)
        : (currentPlayer = playerO);
      let isMoveValid = board.placeMark(n, currentPlayer.mark);
      if (turnCount >= 4) checkWinOrTie(); // why checkWinOrTie only works well inside this if() ???
      if (isMoveValid && !isGameOver) turnCount++; // check if the move is valid and game is not over before incrementing turnCount
    } else {
      console.log(`final count: ${turnCount}`);
      console.log(`is game over down here: ${isGameOver}`);
      console.log(`winner down here: ${winner.name}`);
      console.log("Yo game is alreay overr");
    }
  };

  let printBoard = () => board.getBoard();
  let resetGame = () => {
    board.reset();
    // Even tho these 4 below only change inside playTurn(), they are still affected and need to be resetted
    turnCount = 0;
    isGameOver = false;
    winner = null;
    currentPlayer = playerX;
  };

  // out here, turnCount should be 0, so no need to reset count
  return { playTurn, printBoard, resetGame };
}

let game = gameController(board, playerX, playerO);

// Test game
game.playTurn(4); // x
game.playTurn(5); // o
game.playTurn(7); // x
game.playTurn(2); // o
game.playTurn(0); // x
game.playTurn(1); // o
game.playTurn(6); // x
game.playTurn(8); // o Winner is o after 7 turns
console.log(game.printBoard());
// game.playTurn(3); // x

game.resetGame();
console.log("==========================================");
console.log(game.printBoard());

// Test game 2 works as expected
game.playTurn(0); // x
game.playTurn(3); // o
game.playTurn(1); // x
game.playTurn(6); // o
game.playTurn(2); // x Winner is x after 4 turns

console.log(game.printBoard());

// progress
// update 1: when a win or tie is decided, if a player makes another turn it wont count
// update 2: reset() includes game board, turnCount, isGameOver, winner, and currentPlayer. I tested it with a 2nd game and the game worked fine
// update 3: turnCount starts at 0 and first player is X
// existing issue 1: why checkWinOrTie() only works properly when it's inside "if (!isGameOver && winner === null) {...}". When it's inside, it tracks winner precisely. In the first game, winner is playerO after 7 turns. When I put checkWinOrTie() outside of "if (!isGameOver && winner === null) {...}" it takes 8 turns to find the winner.
// existing issue 2: how to make gameController into an IIFE as the return is an object with 3 methods: printBoard(), playTurn() and reset(). How can i make a game passing the board and players parameters like I am doing with factory function gameController?
// existing issue 3: what is a better way to decide player switching. my current method turnCount%2 is working properly but i want to find a better method
