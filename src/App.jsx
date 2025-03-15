import { useState } from "react";
import Player from "./components/Player.jsx";
import Gameboard from "./components/GameBoard.jsx";
import Log from "./components/Log.jsx";
import GameOver from "./components/GameOver.jsx";
import { WINNING_COMBINATIONS } from "./winning-combinations.js";

const PLAYERS = {
  X: "Player 1",
  O: "Player 2",
};

const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function deriveActivePlayer(gameTurns) {
  let currentPlayer = "X";

  if (gameTurns.length > 0 && gameTurns[0].player === "X") {
    currentPlayer = "O";
  }
  return currentPlayer;
}

const deriveWinner = (gameBoard, players) => {
  let winner;

  for (const combination of WINNING_COMBINATIONS) {
    const firstFieldSymbol =
      gameBoard[combination[0].row][combination[0].column];
    const secondFieldSymbol =
      gameBoard[combination[1].row][combination[1].column];
    const thirdFieldSymbol =
      gameBoard[combination[2].row][combination[2].column];

    if (
      firstFieldSymbol &&
      firstFieldSymbol === secondFieldSymbol &&
      firstFieldSymbol === thirdFieldSymbol
    ) {
      winner = players[firstFieldSymbol];
    }
  }

  return winner;
};

const deriveGameBoard = (gameTurns) => {
  let gameBoard = [...INITIAL_GAME_BOARD.map((array) => [...array])];

  for (const turn of gameTurns) {
    const { field, player } = turn;
    const { row, col } = field;

    gameBoard[row][col] = player;
  }

  return gameBoard;
};

function App() {
  const [players, setPlayers] = useState(PLAYERS);
  const [gameTurns, setGameTurns] = useState([]);

  const activePlayer = deriveActivePlayer(gameTurns);
  const gameBoard = deriveGameBoard(gameTurns);
  const winner = deriveWinner(gameBoard, players);
  const isADraw = gameTurns.length === 9 && !winner;

  const handleSelectField = (rowIndex, colIndex) => {
    setGameTurns((previousTurns) => {
      const currentPlayer = deriveActivePlayer(previousTurns);

      const updatedTurns = [
        { field: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...gameTurns,
      ];

      return updatedTurns;
    });
  };

  const handleRematch = () => {
    setGameTurns([]);
  };

  const handlePlayerNameChange = (symbol, newName) => {
    setPlayers((previousPlayers) => {
      return {
        ...previousPlayers,
        [symbol]: newName,
      };
    });
  };

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            initialName={PLAYERS.X}
            symbol={"X"}
            isActive={activePlayer === "X"}
            onNameChange={handlePlayerNameChange}
          />
          <Player
            initialName={PLAYERS.O}
            symbol={"O"}
            isActive={activePlayer === "O"}
            onNameChange={handlePlayerNameChange}
          />
        </ol>
        {(winner || isADraw) && (
          <GameOver winner={winner} onRematch={handleRematch} />
        )}
        <Gameboard onSelectField={handleSelectField} board={gameBoard} />
      </div>
      <Log turns={gameTurns} />
    </main>
  );
}

export default App;
