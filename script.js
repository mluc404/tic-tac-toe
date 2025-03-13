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
      alert(`This spot ${position} is already taken. Choose a differnt move`);
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
  let isGameOver = false;
  let winner = null;

  let winCondition = {
    win1: [0, 1, 2],
    win2: [3, 4, 5],
  };

  let checkWinTie = () => {
    let currentBoard = board.getBoard();

    // winCondition.win1.every()

    if (currentBoard[0] === "X" && currentBoard[1] === "X") {
      winner = playerX;
      isGameOver = true;
      alert(`winner is ${playerX.name}`);
    } else {
      if (!currentBoard.includes("")) {
        isGameOver = true;
        alert("Game over. Its a tie");
      }
    }
  };

  let playTurn = (n) => {
    if (!isGameOver && winner === null) {
      turnCount % 2 === 0
        ? (currentPlayer = playerX)
        : (currentPlayer = playerO);
      board.placeMark(n, currentPlayer.mark);
      checkWinTie();
      turnCount++;
    }
  };

  let printBoard = () => board.getBoard();

  let resetGame = () => board.reset();

  return { playTurn, printBoard, resetGame };
}

let game = gameController(board, playerX, playerO);

// console.log(game.printBoard());

// for (let i = 0; i < 9; i++) {
//   game.playTurn(i);
// }

game.playTurn(6); // X
game.playTurn(4); // O
game.playTurn(3); // X
game.playTurn(2); // O
game.playTurn(0);
game.playTurn(8);
game.playTurn(7);
game.playTurn(1);
// game.playTurn(5);
// game.playTurn(1);

// console.log(game.printBoard());

// game.resetGame();
// console.log(game.printBoard());

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

let arr = ["x", "o", "x", "", "o", "o", "", "o", "o"];
console.log(arr);

// Only run findWinner() when countTurn is at least 4
// because there cant be a winner under 4 turns
function checkWinOrTie() {
  for (let con in winCondition) {
    let doesXwin = winCondition[con].every((index) => arr[index] === "x");
    if (doesXwin) {
      console.log("Winner is x");
      console.log("Location: ", winCondition[con]);
      return;
    }
    let doesOwin = winCondition[con].every((index) => arr[index] === "o");
    if (doesOwin) {
      console.log("Winner is o");
      console.log("Location: ", winCondition[con]);
      return;
    }
  }
  // After running the loop, and there's no winner, check if the board is full
  // If board is full, the game is a tie
  if (!arr.includes("")) {
    console.log("This game is a tie");
  }
}

checkWinOrTie();
