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

  let getBoard = () => arr;
  let placeMark = (position, mark) => {
    if (arr[position] === "") arr[position] = mark;
    else
      alert(`This spot ${position} is already taken. Choose a differnt spot`);
    return arr;
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
    if (!isGameOver && winner === null) {
      turnCount % 2 === 0
        ? (currentPlayer = playerO)
        : (currentPlayer = playerX);
      board.placeMark(n, currentPlayer.mark);
      if (turnCount >= 4) checkWinOrTie();
      turnCount++;
    } else {
      console.log(`turn count here: ${turnCount}`);
      console.log("Yo game is alreay overrrrrrrrrrrr");
    }
  };

  let printBoard = () => board.getBoard();
  let resetGame = () => board.reset();

  // out here, turnCount should be 0, so no need to reset count
  return { playTurn, printBoard, resetGame };
}

let game = gameController(board, playerX, playerO);

// Test game
game.playTurn(4); // x
game.playTurn(6); // o
game.playTurn(7); // x
game.playTurn(2); // o
game.playTurn(0); // x
game.playTurn(1); // o
game.playTurn(5); // x
game.playTurn(8); // o
game.playTurn(3); // x
// Winner is x after 9 turns
console.log(game.printBoard());

game.resetGame();
console.log(game.printBoard());
