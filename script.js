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
    let isMarkValid = false;
    if (arr[position] === "") {
      arr[position] = mark;
      isMarkValid = true;
    } else {
      isMarkValid = false;
      // alert(`This spot ${position} is already taken. Choose a differnt spot`);
    }
    return isMarkValid;
  };

  let reset = () => arr.fill("");

  return { getBoard, placeMark, reset };
}
let board = createGameboard();
let board2 = createGameboard();
board2.placeMark(0, "k");
// board2.placeMark(0, "m");

// console.log("testing board only <<<<<<<<<<<<");
// console.log(board2.getBoard());
// console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");

// Create player object
function createPlayer(name, mark) {
  return { name, mark };
}
let playerX = createPlayer("Mike", "x");
let playerO = createPlayer("Elle", "o");

/////////////////////////////////////////////////////////////
// Create Game Controller IIFE
// Track the current player, game state (active or over), and use the Gameboard object
// Include methods like playTurn(), checkWinner(), resetGame()
let gameController = function (board, playerX, playerO) {
  let players = [playerX, playerO];
  let currentPlayer = null;
  let turnCount = 0;
  let isMoveValid = null;
  let isGameOver = false;
  let winner = null;

  let turnOutcome = null;

  let winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // Only run checkWinOrTie() when turnCount is at least 4
  // because there cant be a winner under 4 turns
  let checkWinOrTie = () => {
    let currentBoard = board.getBoard();
    for (condition of winConditions) {
      // Check if playerX wins
      let doesXwin = condition.every((index) => currentBoard[index] === "x");
      if (doesXwin) {
        winner = playerX;
        isGameOver = true;
        // alert("Game Over");

        console.log(`Winner is x after ${turnCount} turns`);
        console.log("Location: ", condition);
        console.log(currentBoard);
        return `Winner is x after ${turnCount} turns`;
      }
      // Check if playerO win
      let doesOwin = condition.every((index) => currentBoard[index] === "o");
      if (doesOwin) {
        winner = playerO;
        isGameOver = true;
        // alert("Game Over");

        console.log(`Winner is o after ${turnCount} turns`);
        console.log("Location: ", condition);
        console.log(currentBoard);
        return `Winner is o after ${turnCount} turns`;
      }
    }
    // After running the loop, and there's no winner, check if the array is full
    // If array is full, the game is a tie
    if (!currentBoard.includes("")) {
      isGameOver = true;
      console.log("This game is a tie");
      // alert("Game Over");
      return "This game is a tie";
    } else {
      return "Game is still in progress";
    }
  };

  // Function to play each turn
  // Check if game is over first
  // Flow: Decide current player - Place their mark - Check win/tie - Increment turns if valid
  let playTurn = (n) => {
    // if (turnCount >= 4) checkWinOrTie(); // why checkWinOrTie doesn't work properly out here, but works fine inside the below if() ???
    // console.log("turn count herer:", turnCount);

    if (!isGameOver && winner === null) {
      currentPlayer = players[turnCount % 2]; // playerX if turnCount is even, playerO if odd
      isMoveValid = board.placeMark(n, currentPlayer.mark);
      // isMoveValid will interact with DOM later to tell player if their move is invalid
      if (turnCount >= 4) {
        let checkResult = checkWinOrTie(); // checkResult is for DOM later if needed
      } // why checkWinOrTie only works well inside this if() ???
      if (isMoveValid && !isGameOver) turnCount++; // check if the move is valid and game is not over before incrementing turnCount
    } else {
      // handle when player makes a turn after game over
      // will add more later when I know what to do for DOM
      console.log(`final count: ${turnCount}`);
      console.log(`is game over down here: ${isGameOver}`);
      if (winner) {
        console.log(`winner down here: ${winner.name}`);
      }
      console.log("Yo game is alreay overr");
    }

    return [board.getBoard(), turnOutcome, isMoveValid]; // placeholder for now. will decide with DOM later
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

  let getGameStatus = () => [isGameOver, winner];

  // out here, turnCount should be 0, so no need to reset count
  return { playTurn, printBoard, getGameStatus, resetGame };
};

let game = gameController(board, playerX, playerO);

// Test game
game.playTurn(4); // x
game.playTurn(5); // o
game.playTurn(7); // x
game.playTurn(2); // o
game.playTurn(0); // x
game.playTurn(1); // o
game.playTurn(6); // x
// game.playTurn(8); // o Winner is o after 7 turns
// console.log(game.printBoard());
// game.playTurn(3); // x

game.resetGame();
// console.log("==========================================");
// console.log(game.printBoard());

// Test game 2 works as expected
game.playTurn(0); // x
game.playTurn(3); // o
game.playTurn(1); // x
game.playTurn(6); // o
// game.playTurn(2); // x Winner is x after 4 turns

// console.log(game.printBoard());
game.resetGame();

// Test game 3 results in a tie as expected
// console.log("=============================");
// console.log(game.printBoard());
game.playTurn(7);
game.playTurn(6);
game.playTurn(8);
game.playTurn(5);
game.playTurn(4);
game.playTurn(1);
game.playTurn(2);
game.playTurn(0);
// game.playTurn(3);
// This game is tie
// console.log(game.printBoard());
// game.playTurn(3);
// Test game 4 where someone tries the same spot twice mid-game and reset mid game
// console.log("=============================");
// console.log("Test game 4");
game.resetGame();
// console.log(game.printBoard());
game.playTurn(7);
game.playTurn(6);
game.playTurn(8);
game.playTurn(8);
game.playTurn(87);
game.resetGame();
// console.log("=============================");
// console.log(game.printBoard());
game.playTurn(0);
game.playTurn(1);
game.playTurn(2);
game.playTurn(3);
game.playTurn(4);
game.playTurn(5);
game.playTurn(6);
// console.log(game.getGameStatus());
// console.log(game.playTurn()[0]);
game.resetGame();

// OBJECT TO HANDLE DISPLAY
let displayController = function (game) {
  let displayDiv = document.querySelector(".cellGrid");
  let cells = document.querySelectorAll(".cell");
  let resetBtn = document.querySelector(".resetBtn");
  let dialog = document.querySelector("dialog");
  let endGameMsg = dialog.querySelector(".message");
  let closeDialogBtn = dialog.querySelector(".closeDialog");

  // Handle displaying mark on cell when clicked
  let arr = game.printBoard();
  cells.forEach((cell) => {
    cell.addEventListener("click", (e) => {
      let index = e.target.id[5]; // get the last character of cell id which is an integer
      let isValidMove = game.playTurn(index)[2]; //
      // alert red border when click on an occupied cell
      if (!isValidMove) {
        e.target.style.border = "red solid 4px";
        // e.target.style.transform = "scale(1.2)";
        setTimeout(() => {
          e.target.style.border = "rgb(75, 75, 75) solid 2px";
          // e.target.style.transform = "scale(1)";
        }, 500);
      }
      e.target.textContent = arr[index];

      // handle cell bg color
      if (isValidMove && cell.textContent === "o") {
        cell.style.backgroundColor = "#a8f0bc";
      }
      if (isValidMove && cell.textContent === "x") {
        cell.style.backgroundColor = "pink";
      }

      // Handle dialog message when game over
      let gameSatus = game.getGameStatus();
      let checkGameOver = gameSatus[0];
      console.log(`game status ${gameSatus}`);
      if (checkGameOver) {
        endGameMsg.textContent = gameSatus;
        dialog.showModal();
        console.log(endGameMsg.textContent);
      }
    });
  });

  // Handle reset button
  resetBtn.addEventListener("click", (e) => {
    game.resetGame();
    cells.forEach((cell) => {
      cell.textContent = "";
      cell.style.backgroundColor = "";
    });
    console.log(game.printBoard());
  });

  // close dialog button
  closeDialogBtn.addEventListener("click", () => {
    dialog.close();
  });

  let renderBoard = () => {
    return game.printBoard();
  };

  return { renderBoard };
};

// Test display
let displayObj = displayController(game);

// cells[0].textContent = "ha";

// Friday March 14th
// make gameController into IIFE
// test all invalid cases
// move to DOM
// dev log 1:
// 1. moved isMarkValid inside placeMark since no other methods involves it
// 2. changed winConditions into an array of arrays
// 3. added return values for checkWinOrTie()
// 4. improved player switching code readability
// 5. improved efficiency in checkWinOrTie() by calling board.getBoard() once at the start of the function
// 6. tested Edge cases
// 7. added getGameSatus() inside game to querry isGameOver and winner for the DOM
// 8. WHAT SHOUDL playTurn() RETURN FOR DOM?
// dev log 2:
// start display obj
// figured out how to match each cell with each mark on the board array
// visually alert when player clicks on an occupied cell
// distint colors for cells with x and o marks
// added a reset game button
// todo: add a dialog that pops up when game over

// Thursday March 13
// update 1: when a win or tie is decided, if a player makes another turn it wont count
// update 2: reset() includes game board, turnCount, isGameOver, winner, and currentPlayer. I tested it with a 2nd game and the game worked fine
// update 3: turnCount starts at 0 and first player is X
// existing issue 1: why checkWinOrTie() only works properly when it's inside "if (!isGameOver && winner === null) {...}". When it's inside, it tracks winner precisely. In the first game, winner is playerO after 7 turns. When I put checkWinOrTie() outside of "if (!isGameOver && winner === null) {...}" it takes 8 turns to find the winner.
// existing issue 2: how to make gameController into an IIFE as the return is an object with 3 methods: printBoard(), playTurn() and reset(). How can i make a game passing the board and players parameters like I am doing with factory function gameController?
// existing issue 3: what is a better way to decide player switching. my current method turnCount%2 is working properly but i want to find a better method
