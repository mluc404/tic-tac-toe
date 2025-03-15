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

/////////////////////////////////////////////////////////////
// Create Game Controller IIFE
// Track the current player, game state (active or over), and use the Gameboard object
// Include methods like playTurn(), checkWinner(), resetGame()
let gameController = function (board, playerX, playerO) {
  let players = [playerX, playerO];
  let currentPlayer = playerX;
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

        console.log(`Winner is x after ${turnCount} turns`);
        console.log("Location: ", condition);
        console.log(currentBoard);
        return `X won after ${turnCount + 1} turns!`;
      }
      // Check if playerO win
      let doesOwin = condition.every((index) => currentBoard[index] === "o");
      if (doesOwin) {
        winner = playerO;
        isGameOver = true;

        console.log(`Winner is O after ${turnCount} turns`);
        console.log("Location: ", condition);
        console.log(currentBoard);
        return `O won after ${turnCount + 1} turns!`;
      }
    }
    // After running the loop, and there's no winner, check if the array is full
    // If array is full, the game is a tie
    if (!currentBoard.includes("")) {
      isGameOver = true;
      console.log("This game is a tie");
      // alert("Game Over");
      return "This game is a tie!";
    }
  };

  // Function to play each turn
  // Check if game is over first
  // Flow: Decide current player - Place their mark - Check win/tie - Increment turns if valid
  let playTurn = (n) => {
    if (!isGameOver && winner === null) {
      currentPlayer = players[turnCount % 2]; // playerX if turnCount is even, playerO if odd
      isMoveValid = board.placeMark(n, currentPlayer.mark);
      if (turnCount >= 4) {
        turnOutcome = checkWinOrTie(); // checkResult is for DOM later if needed
      }
      if (isMoveValid && !isGameOver) turnCount++; // check if the move is valid and game is not over before incrementing turnCount
    } else {
      // handle when player makes a turn after game over
      // will add more later if necessary
      if (winner) {
        // console.log(`winner: ${winner.name}`);
      }
      // console.log("Yo game is alreay overrr");
    }

    return [turnOutcome, isMoveValid]; // return variables to use with DOM
  };

  let printBoard = () => board.getBoard();
  let resetGame = () => {
    board.reset();
    // Even tho these 4 below only change inside playTurn(), they are still affected and need to be reset
    turnCount = 0;
    isGameOver = false;
    winner = null;
    currentPlayer = playerX;
  };

  let getGameStatus = () => [isGameOver, turnOutcome, winner, currentPlayer];

  // out here, turnCount should be 0, so no need to reset count
  return { playTurn, printBoard, getGameStatus, resetGame };
};

let game = gameController(board, playerX, playerO);

// OBJECT TO HANDLE DISPLAY
let displayController = function (game) {
  let cells = document.querySelectorAll(".cell");
  let resetBtn = document.querySelector(".resetBtn");
  let messageonTop = document.querySelector(".messageOnTop");

  // Handle displaying mark on cell when clicked
  cells.forEach((cell) => {
    cell.addEventListener("click", (e) => {
      let index = e.target.id[5]; // get the last character of cell id which is an integer
      let isValidMove = game.playTurn(index)[1]; //

      // Alert red border when user clicks on an occupied cell
      if (!isValidMove) {
        e.target.style.border = "#f73166 solid 4px";
        setTimeout(() => {
          e.target.style.border = "none";
        }, 500);
      } else {
        e.target.textContent = game.printBoard()[index]; // only display mark if move is valid
      }
      // Set 2 distinct cell colors for x and o
      if (isValidMove && cell.textContent === "o") {
        cell.style.backgroundColor = "#8adea0";
      }
      if (isValidMove && cell.textContent === "x") {
        cell.style.backgroundColor = "#eba0ba";
      }

      // Handle message when game over
      let gameSatus = game.getGameStatus();
      let checkGameOver = gameSatus[0];
      if (checkGameOver) {
        messageonTop.textContent = gameSatus[1];
      }
    });
  });

  // Handle reset button
  resetBtn.addEventListener("click", (e) => {
    messageonTop.textContent = "";
    game.resetGame();
    cells.forEach((cell) => {
      cell.textContent = "";
      cell.style.backgroundColor = "";
    });
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
// 8. WHAT SHOULD playTurn() RETURN FOR DOM?

// dev log 2:
// start display obj
// figured out how to match each cell with each mark on the board array
// visually alert when player clicks on an occupied cell
// distint colors for cells with x and o marks
// added a reset game button
// todo: add a dialog that pops up when game over

// dev log 3:
// style: update UI, improve UX and code efficiency
// made sure design is responsive on both desktop and mobile
// use game.printBoard()[index] inside cells listener to make sure with each click we fetch the latest board
// only update e.target.textContent = game.printBoard()[index] when move is valid
// instead of dialog, display game over message directly on top of the grid//
// todo:
// cells lack ARIA labels or roles
// highlight winning cells

// Thursday March 13
// update 1: when a win or tie is decided, if a player makes another turn it wont count
// update 2: reset() includes game board, turnCount, isGameOver, winner, and currentPlayer. I tested it with a 2nd game and the game worked fine
// update 3: turnCount starts at 0 and first player is X
// existing issue 1: why checkWinOrTie() only works properly when it's inside "if (!isGameOver && winner === null) {...}". When it's inside, it tracks winner precisely. In the first game, winner is playerO after 7 turns. When I put checkWinOrTie() outside of "if (!isGameOver && winner === null) {...}" it takes 8 turns to find the winner.
// existing issue 2: how to make gameController into an IIFE as the return is an object with 3 methods: printBoard(), playTurn() and reset(). How can i make a game passing the board and players parameters like I am doing with factory function gameController?
// existing issue 3: what is a better way to decide player switching. my current method turnCount%2 is working properly but i want to find a better method

// // Test game in console
// game.playTurn(4); // x
// game.playTurn(5); // o
// game.playTurn(7); // x
// game.playTurn(2); // o
// game.playTurn(0); // x
// game.playTurn(1); // o
// game.playTurn(6); // x
// game.playTurn(8); // o Winner is o after 7 turns
// console.log(game.printBoard());
// // game.playTurn(3); // x
// game.resetGame();
// console.log("==========================================");
// console.log(game.printBoard());

// // Test game 2 works as expected
// game.playTurn(0); // x
// game.playTurn(3); // o
// game.playTurn(1); // x
// game.playTurn(6); // o
// game.playTurn(2); // x Winner is x after 4 turns
// console.log(game.printBoard());
// game.resetGame();

// // Test game 3 results in a tie as expected
// console.log("=============================");
// console.log(game.printBoard());
// game.playTurn(7);
// game.playTurn(6);
// game.playTurn(8);
// game.playTurn(5);
// game.playTurn(4);
// game.playTurn(1);
// game.playTurn(2);
// game.playTurn(0);
// // game.playTurn(3);
// // This game is tie
// console.log(game.printBoard());
// // game.playTurn(3);
// // Test game 4 where someone tries the same spot twice mid-game and reset mid game
// console.log("=============================");
// console.log("Test game 4");
// game.resetGame();
// // console.log(game.printBoard());
// game.playTurn(7);
// game.playTurn(6);
// game.playTurn(8);
// game.playTurn(8);
// game.playTurn(87);
// game.resetGame();
// console.log("=============================");
// console.log(game.printBoard());
// game.playTurn(0);
// game.playTurn(1);
// game.playTurn(2);
// game.playTurn(3);
// game.playTurn(4);
// game.playTurn(5);
// game.playTurn(6);
// console.log(game.getGameStatus());
// console.log(game.playTurn()[0]);
// game.resetGame();
