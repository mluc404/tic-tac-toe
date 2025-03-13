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
    return arr;
  };

  let reset = () => arr.fill("");

  return { getBoard, placeMark, reset };
}

// Create player object
function createPlayer(name, mark) {
  return { name, mark };
}

let board = createGameboard();
let playerX = createPlayer("Mike", "X");
let playerO = createPlayer("Elle", "O");

// Create Game Controller
// Track the current player, game state (active or over), and use the Gameboard object
// Include methods like playTurn(), checkWinner(), resetGame()

function gameController(board, playerX, playerO) {
  let currentPlayer = playerX;
  let turnCount = 0;
  let playTurn = (n) => {
    turnCount % 2 === 0 ? (currentPlayer = playerX) : (currentPlayer = playerO);
    turnCount++;
    board.placeMark(n, currentPlayer.mark);
  };

  let printBoard = () => board.getBoard();

  return { playTurn, printBoard };
}

let game = gameController(board, playerX, playerO);

console.log(game.printBoard());
game.playTurn(6);
game.playTurn(4);
game.playTurn(1);
game.playTurn(2);
game.playTurn(0);
game.playTurn(3);

console.log(game.printBoard());
