"use client";

import { Chess } from "chess.js";

const ChessboardView = () => {
  const [game, setGame] = useState(new Chess());
  const [board, setBoard] = useState(game.fen());
  const [level, setLevel] = useState(3); // dificuldade da IA

  // ---- MOVE DO JOGADOR ----
  function onDrop(source: string, target: string) {
    const newGame = new Chess(game.fen());

    const move = newGame.move({
      from: source,
      to: target,
      promotion: "q",
    });

    if (!move) return false; // movimento inválido

    setGame(newGame);
    setBoard(newGame.fen());

    // IA joga depois do usuário
    setTimeout(() => makeAIMove(newGame), 300);

    return true;
  }

  // ---- VERIFICA MATE/FIM ----
  const isGameFinished = (g: Chess) => {
    return (
      g.isGameOver() ||
      g.isDraw() ||
      g.isCheckmate() ||
      g.isStalemate() ||
      g.isThreefoldRepetition()
    );
  };

  // ---- IA ----
  function makeAIMove(currentGame: Chess) {
    if (isGameFinished(currentGame)) return;

    const moves = currentGame.moves({ verbose: true });
    if (moves.length === 0) return;

    const aiMove =
      level === 1 ? randomMove(moves) : weightedMove(currentGame, moves);

    currentGame.move(aiMove);
    setGame(new Chess(currentGame.fen()));
    setBoard(currentGame.fen());
  }

  // Nível 1: aleatório
  function randomMove(moves: any[]) {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  // Nível 2+: IA simplificada (sistema de pontos)
  function weightedMove(g: Chess, moves: any[]) {
    const scores = {
      p: 1,
      n: 3,
      b: 3,
      r: 5,
      q: 9,
      k: 100,
    };

    let bestMove = null;
    let bestScore = -9999;

    moves.forEach((m) => {
      const cloned = new Chess(g.fen());
      cloned.move({ from: m.from, to: m.to, promotion: "q" });

      let score = 0;

      // Se capturar peça → pontua
      if (m.captured) {
        score += scores[m.captured] * level;
      }

      // Se der check → pontua
      if (cloned.isCheck()) score += 2 * level;

      // Se der mate → pontua muito
      if (cloned.isCheckmate()) score += 9999;

      if (score > bestScore) {
        bestScore = score;
        bestMove = m;
      }
    });

    return bestMove || randomMove(moves);
  }

  return (
    <div className="flex flex-col items-center w-full h-full pt-4">

      {/* NÍVEL DA IA */}
      <div className="text-center mb-4">
        <label className={`${isDark ? "text-slate-400" : "text-slate-600"} text-sm`}>
          Nível da IA (1 a 10)
        </label>
        <input
          type="range"
          min={1}
          max={10}
          value={level}
          onChange={(e) => setLevel(parseInt(e.target.value))}
          className="w-64 mt-2"
        />
        <p className="text-xs opacity-70">Nível atual: {level}</p>
      </div>

      {/* TABULEIRO */}
      <div className="flex-1 flex justify-center items-center p-4 overflow-hidden">
        <div
          className={`max-w-lg w-full rounded-lg overflow-hidden shadow-2xl ${
            isDark ? "shadow-black/50" : "shadow-slate-400/30"
          }`}
        >
          <Chessboard
            id="MainVSIA"
            position={board}
            onPieceDrop={onDrop}
            animationDuration={200}
            customBoardStyle={{
              borderRadius: "12px",
            }}
          />
        </div>
      </div>
    </div>
  );
};
