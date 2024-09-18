import { useState, useEffect } from "react";
import "./App.css";
import Color from "./components/Colors";

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function App() {
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [isGameStarted, setIsGameStarted] = useState(false);

  const startGame = () => {
    setIsMenuVisible(false);
    setIsGameStarted(true);
  };

  const colorList = ["green", "red", "blue", "yellow"];
  const [gameOn, setGameOn] = useState(false);

  const initialGameState = {
    isDisplay: false, //Indica si se están mostrando los colores al usuario.
    colors: [], //Almacena los colores generados aleatoriamente.
    score: 0, //Puntuación del usuario.
    userPlay: false, //Indica si el usuario puede jugar.
    userColors: [], //Almacena los colores que el usuario ha seleccionado.
  };

  const [gameState, setGameState] = useState(initialGameState);

  //Iniciar juego, se ejecutará cuando gameOn cambie su estado
  useEffect(() => {
    if (gameOn) {
      setGameState({ ...initialGameState, isDisplay: true });
    } else {
      setGameState(initialGameState);
    }
  }, [gameOn]);

  //Generación de colores aleatorios
  useEffect(() => {
    if (gameOn && gameState.isDisplay) {
      const randomColor =
        colorList[Math.floor(Math.random() * colorList.length)];
      setGameState((prev) => ({
        ...prev,
        colors: [...prev.colors, randomColor],
      }));
    }
  }, [gameOn, gameState.isDisplay]);

  const [flashColor, setFlashColor] = useState("");

  //Muestra los colores y el parpadeo al usuario
  useEffect(() => {
    if (gameOn && gameState.isDisplay && gameState.colors.length) {
      showColors();
    }
  }, [gameOn, gameState.isDisplay, gameState.colors]);

  async function showColors() {
    await timeout(1500);
    for (const color of gameState.colors) {
      setFlashColor(color);
      await timeout(500);
      setFlashColor("");
      await timeout(500);
    }
    setGameState((prev) => ({
      ...prev,
      isDisplay: false,
      userPlay: true,
      userColors: [...gameState.colors].reverse(),
    }));
  }

  //Estado de juego del usuario cuando hace click en los colores.
  async function colorClickHandle(color) {
    if (!gameState.isDisplay && gameState.userPlay) {
      const copyUserColors = [...gameState.userColors];
      const lastColor = copyUserColors.pop();
      setFlashColor(color);

      if (color === lastColor) {
        if (copyUserColors.length) {
          setGameState((prev) => ({ ...prev, userColors: copyUserColors }));
        } else {
          await timeout(300);
          setGameState((prev) => ({
            ...prev,
            isDisplay: true,
            userPlay: false,
            score: prev.colors.length,
            userColors: [],
          }));
        }
      } else {
        await timeout(1000);
        setGameState({ ...initialGameState, score: gameState.colors.length });
      }
      await timeout(1000);
      setFlashColor("");
    }
  }

  return (
    <div className="App">
      {isMenuVisible && (
        <div className="menu">
          <h1 className="title">¡PATRÓN DE MEMORIA!</h1>
          <button onClick={startGame} className="menuButton">
            JUGAR
          </button>
        </div>
      )}

      {isGameStarted && (
        <div className="game">
          <div className="colorContainer">
            {colorList.map((color, i) => (
              <Color
                key={i}
                color={color}
                flash={flashColor === color}
                onClick={() => colorClickHandle(color)}
              />
            ))}
          </div>
          {!gameOn && (
            <button onClick={() => setGameOn(true)} className="startButton">
              COMENZAR
            </button>
          )}
          {gameOn && (gameState.isDisplay || gameState.userPlay) && (
            <div className="score">{gameState.score}</div>
          )}
          {gameOn &&
            !gameState.isDisplay &&
            !gameState.userPlay &&
            gameState.score > 0 && (
              <div className="gameOver">
                <div className="finalScore">
                  PUNTUACIÓN FINAL: {gameState.score - 1}
                </div>
                <button className="lostButton" onClick={() => setGameOn(false)}>
                  VOLVER A INTENTAR
                </button>
              </div>
            )}
        </div>
      )}
    </div>
  );
}

export default App;
