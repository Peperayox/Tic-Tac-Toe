/* 
This code utilizes exclusively modules built by IFFE's 

Workflow:

[EventHandlerLogic] ---> [gameLogic] <---> [boardLogic] ---> [renderLogic] 

Thanks to MichaelOsman, took some functions and general inspiration from his set up. I believe this structure is much cleaner though.
https://github.com/michalosman/tic-tac-toe/blob/main/script.js#L112
*/

// Only does one thing, whenever anything is written on the board, be it the message or a new X/O, it renders that into the DOM, recieves commands from BoardLogic
const renderLogic = (() => {
  const squares = document.querySelectorAll('.square');
  const messageElement = document.getElementById('message');

  const renderBoard = () => {
    for (let i = 0; i < squares.length; i++) {
      squares[i].innerText = boardLogic.getBoard(i);
    }
    messageElement.textContent = boardLogic.getMessage();
  };

  return { renderBoard };
})();

// Acts as the "Memory", a place to write and read the state of the board, gets written and read by gameLogic, as soon as it's written it also calls on renderLogic

const boardLogic = (() => {
  const board = ['', '', '', '', '', '', '', '', ''];
  let message = '';

  const setBoard = (index, sign) => {
    board[index] = sign;
    renderLogic.renderBoard();
  };

  const setMessage = (messageFromGameLogic) => {
    message = messageFromGameLogic;
    renderLogic.renderBoard();
  };

  const getBoard = (index) => {
    return board[index];
  };

  const getMessage = () => {
    return message;
  };

  const restartBoard = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = '';
    }
    message = '';
    renderLogic.renderBoard();
  };

  return {
    setBoard,
    setMessage,
    getBoard,
    getMessage,
    restartBoard,
  };
})();

// The brains of the game, gets input from eventHandlerLogic and outputs it into the BoardLogic
//

const gameLogic = (() => {
  let round = 1;
  let gameStatus = true;

  const playRound = (fieldIndex) => {
    if (gameStatus === false || boardLogic.getBoard(fieldIndex) !== '') {
      return;
    }
    boardLogic.setBoard(fieldIndex, currentPlayer());
    if (checkWinner(fieldIndex)) {
      boardLogic.setMessage(`${currentPlayer()}'s WON!'`);
      gameStatus = false;
      return;
    }
    if (round === 9) {
      boardLogic.setMessage('DRAW');
      gameStatus = false;
      return;
    }
    round++;
    boardLogic.setMessage(`${currentPlayer()}'s Turn`);
  };

  const checkWinner = (fieldIndex) => {
    const winCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winCombinations
      .filter((combination) => combination.includes(fieldIndex))
      .some((possibleCombination) =>
        possibleCombination.every(
          (index) => boardLogic.getBoard(index) == currentPlayer()
        )
      );
  };

  const currentPlayer = () => {
    return round % 2 === 1 ? 'X' : 'O';
  };

  const restartGame = () => {
    round = 1;
    gameStatus = true;
    boardLogic.restartBoard();
    boardLogic.setMessage(`${currentPlayer()}'s Turn`);
  };
  return { restartGame, playRound };
})();

// does not even have functions inside of it, exclusively event listeners, we delegate weather they events are heard or not inside their respective functions look line 77

const eventHandlerLogic = (() => {
  const squares = document.querySelectorAll('.square');
  const restartButton = document.getElementById('restart');

  squares.forEach((square) =>
    square.addEventListener('click', (e) => {
      gameLogic.playRound(parseInt(e.target.dataset.square));
    })
  );

  restartButton.addEventListener('click', (e) => {
    gameLogic.restartGame();
  });
})();
