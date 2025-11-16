"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Chess } from "chess.js";
import {
  Menu,
  LayoutDashboard,
  Settings,
  User,
  Bell,
  BarChart3,
  Sun,
  Moon,
  RotateCcw,
  Cpu,
  Users,
  Palette,
  Send,
  MessageSquare
} from 'lucide-react';

import StatisticsPage from '@/components/dashboard/statisticsPage';
import ProfilePage from '@/components/dashboard/profilePage';
import SettingsPage from '@/components/dashboard/settingsPage';

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  if (!mounted) {
    return null;
  }

  const isDark = theme === 'dark';

  const ChessboardView = () => {
    const [game, setGame] = useState(new Chess());
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [validMoves, setValidMoves] = useState([]);
    const [level, setLevel] = useState(3);
    const [gameMode, setGameMode] = useState('vsAI');
    const [playerColor, setPlayerColor] = useState('w');
    const [gameStatus, setGameStatus] = useState('');
    const [boardOrientation, setBoardOrientation] = useState('white');
    const [moveHistory, setMoveHistory] = useState([]);
    const [lastMove, setLastMove] = useState(null);

    // Temas
    const [pieceTheme, setPieceTheme] = useState('classic');
    const [boardTheme, setBoardTheme] = useState('wooden');
    const [showThemeSelector, setShowThemeSelector] = useState(false);

    // Chat IA
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const chatEndRef = useRef(null);

    // Temas de peças
    const pieceThemes = {
      classic: {
        name: 'Clássico',
        pieces: {
          'wp': '/pieces/pawn-w.svg',
          'wn': '/pieces/knight-w.svg',
          'wb': '/pieces/bishop-w.svg',
          'wr': '/pieces/rook-w.svg',
          'wq': '/pieces/queen-w.svg',
          'wk': '/pieces/king-w.svg',
          'bp': '/pieces/pawn-b.svg',
          'bn': '/pieces/knight-b.svg',
          'bb': '/pieces/bishop-b.svg',
          'br': '/pieces/rook-b.svg',
          'bq': '/pieces/queen-b.svg',
          'bk': '/pieces/king-b.svg',
        }
      }
    };
    // Temas de tabuleiro
    const boardThemes = {
      wooden: {
        name: 'Madeira',
        light: 'bg-amber-200',
        dark: 'bg-amber-700',
        border: 'border-amber-900'
      },
      marble: {
        name: 'Mármore',
        light: 'bg-slate-100',
        dark: 'bg-slate-600',
        border: 'border-slate-800'
      },
      ocean: {
        name: 'Oceano',
        light: 'bg-cyan-200',
        dark: 'bg-cyan-700',
        border: 'border-cyan-900'
      },
      forest: {
        name: 'Floresta',
        light: 'bg-emerald-200',
        dark: 'bg-emerald-700',
        border: 'border-emerald-900'
      },
      royal: {
        name: 'Real',
        light: 'bg-purple-200',
        dark: 'bg-purple-700',
        border: 'border-purple-900'
      },
      neon: {
        name: 'Neon',
        light: 'bg-pink-300',
        dark: 'bg-purple-900',
        border: 'border-pink-500'
      }
    };

    const pieceSymbols = pieceThemes[pieceTheme].pieces;
    const currentBoardTheme = boardThemes[boardTheme];

    useEffect(() => {
      updateGameStatus();
      if (gameMode === 'vsAI' && game.turn() !== playerColor && !isGameFinished()) {
        setTimeout(() => makeAIMove(), 500);
      }
    }, [game]);

    useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    function updateGameStatus() {
      if (game.isCheckmate()) {
        const winner = game.turn() === 'w' ? 'Pretas' : 'Brancas';
        setGameStatus(`Xeque-mate! ${winner} venceram! 🏆`);
      } else if (game.isDraw()) {
        setGameStatus('Empate! 🤝');
      } else if (game.isStalemate()) {
        setGameStatus('Afogamento! 🤝');
      } else if (game.isThreefoldRepetition()) {
        setGameStatus('Empate por repetição! 🤝');
      } else if (game.isCheck()) {
        setGameStatus('Xeque! ⚠️');
      } else if (game.isGameOver()) {
        setGameStatus('Jogo finalizado!');
      } else {
        const turn = game.turn() === 'w' ? 'Brancas' : 'Pretas';
        if (gameMode === 'vsAI') {
          if (game.turn() === playerColor) {
            setGameStatus(`Sua vez (${turn}) ♟️`);
          } else {
            setGameStatus('IA pensando... 🤖');
          }
        } else {
          setGameStatus(`Vez das ${turn} ♟️`);
        }
      }
    }

    function isGameFinished() {
      return game.isGameOver() || game.isDraw() || game.isCheckmate() ||
        game.isStalemate() || game.isThreefoldRepetition();
    }

    async function analyzeMove(move) {
      setIsAnalyzing(true);

      setTimeout(() => {
        const analysis = generateMoveAnalysis(move);
        setChatMessages(prev => [...prev, {
          type: 'ai',
          content: analysis,
          timestamp: new Date()
        }]);
        setIsAnalyzing(false);
      }, 1000);
    }

    function generateMoveAnalysis(move) {
      const analyses = [];

      // Análise de captura
      if (move.captured) {
        const pieceValues = { p: 'peão', n: 'cavalo', b: 'bispo', r: 'torre', q: 'dama' };
        analyses.push(`✅ Excelente! Você capturou um ${pieceValues[move.captured]}.`);
      }

      // Análise de posição
      const centralSquares = ['d4', 'd5', 'e4', 'e5'];
      if (centralSquares.includes(move.to)) {
        analyses.push(`🎯 Ótimo controle do centro! A casa ${move.to} é estratégica.`);
      }

      // Análise de desenvolvimento
      if ((move.piece === 'n' || move.piece === 'b') && move.from[1] === '1') {
        analyses.push(`🚀 Bom desenvolvimento de peça! É importante ativar suas peças rapidamente.`);
      }

      // Análise de check
      const tempGame = new Chess(game.fen());
      if (tempGame.isCheck()) {
        analyses.push(`⚔️ Check! Você está pressionando o rei adversário.`);
      }

      // Análise genérica
      if (analyses.length === 0) {
        const genericAnalyses = [
          `Movimento sólido. Mantém a posição equilibrada.`,
          `Interessante! Este movimento abre possibilidades.`,
          `Movimento defensivo, fortalece sua posição.`,
          `Boa jogada! Mantém a iniciativa.`
        ];
        analyses.push(genericAnalyses[Math.floor(Math.random() * genericAnalyses.length)]);
      }

      return analyses.join(' ');
    }

    function onSquareClick(square) {
      if (isGameFinished()) return;
      if (gameMode === 'vsAI' && game.turn() !== playerColor) return;

      if (selectedSquare) {
        if (selectedSquare === square) {
          setSelectedSquare(null);
          setValidMoves([]);
          return;
        }

        const moveResult = makeMove(selectedSquare, square);
        setSelectedSquare(null);
        setValidMoves([]);

        if (moveResult && gameMode === 'vsAI' && !isGameFinished()) {
          setTimeout(() => makeAIMove(), 500);
        }

        if (!moveResult) {
          const piece = game.get(square);
          if (piece && piece.color === game.turn()) {
            setSelectedSquare(square);
            const moves = game.moves({ square: square, verbose: true });
            setValidMoves(moves.map(m => m.to));
          }
        }
      } else {
        const piece = game.get(square);
        if (piece && piece.color === game.turn()) {
          setSelectedSquare(square);
          const moves = game.moves({ square: square, verbose: true });
          setValidMoves(moves.map(m => m.to));
        }
      }
    }

    function makeMove(from, to) {
      try {
        const move = game.move({
          from: from,
          to: to,
          promotion: 'q'
        });

        if (move) {
          setGame(new Chess(game.fen()));
          setMoveHistory([...moveHistory, move.san]);
          setLastMove({ from, to });

          if (gameMode === 'vsAI' && game.turn() !== playerColor) {
            analyzeMove(move);
          }

          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    }

    function makeAIMove() {
      if (isGameFinished()) return;

      const moves = game.moves({ verbose: true });
      if (moves.length === 0) return;

      const aiMove = level === 1 ? randomMove(moves) : weightedMove(moves);

      const move = game.move(aiMove);
      if (move) {
        setGame(new Chess(game.fen()));
        setMoveHistory([...moveHistory, move.san]);
        setLastMove({ from: move.from, to: move.to });

        // IA explica seu movimento
        setTimeout(() => {
          const explanation = generateAIExplanation(move);
          setChatMessages(prev => [...prev, {
            type: 'ai',
            content: `🤖 **Minha jogada: ${move.san}**\n\n${explanation}`,
            timestamp: new Date()
          }]);
        }, 800);
      }
    }

    function generateAIExplanation(move) {
      const explanations = [];

      if (move.captured) {
        explanations.push(`Capturei sua peça para ganhar material.`);
      }

      if (move.san.includes('+')) {
        explanations.push(`Dei check para forçar seu rei a se mover.`);
      }

      if (move.san.includes('#')) {
        return `Xeque-mate! 🏆`;
      }

      const centralSquares = ['d4', 'd5', 'e4', 'e5'];
      if (centralSquares.includes(move.to)) {
        explanations.push(`Controlei o centro do tabuleiro.`);
      }

      if (explanations.length === 0) {
        const generic = [
          `Fortaleço minha posição.`,
          `Desenvolvo minhas peças.`,
          `Preparo um ataque futuro.`,
          `Melhoro a coordenação das peças.`
        ];
        explanations.push(generic[Math.floor(Math.random() * generic.length)]);
      }

      return explanations.join(' ');
    }

    function randomMove(moves) {
      return moves[Math.floor(Math.random() * moves.length)];
    }

    function weightedMove(moves) {
      const scores = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 100 };
      let bestMove = null;
      let bestScore = -9999;

      moves.forEach((m) => {
        const tempGame = new Chess(game.fen());
        tempGame.move({ from: m.from, to: m.to, promotion: "q" });

        let score = 0;
        if (m.captured) score += scores[m.captured] * level;
        if (tempGame.isCheck()) score += 2 * level;
        if (tempGame.isCheckmate()) score += 10000;
        if (['d4', 'd5', 'e4', 'e5'].includes(m.to)) score += 0.5 * level;
        if (m.piece === 'n' || m.piece === 'b') score += 0.3 * level;
        score += Math.random() * (11 - level);

        if (score > bestScore) {
          bestScore = score;
          bestMove = m;
        }
      });

      return bestMove || randomMove(moves);
    }

    function resetGame() {
      const newGame = new Chess();
      setGame(newGame);
      setSelectedSquare(null);
      setValidMoves([]);
      setGameStatus('');
      setMoveHistory([]);
      setLastMove(null);
      setChatMessages([{
        type: 'ai',
        content: '♟️ Novo jogo iniciado! Boa sorte! Faça seus movimentos e eu te ajudarei a entender o porquê de cada jogada.',
        timestamp: new Date()
      }]);
    }

    function changeGameMode(mode) {
      setGameMode(mode);
      resetGame();
    }

    function changePlayerColor(color) {
      setPlayerColor(color);
      setBoardOrientation(color === 'w' ? 'white' : 'black');
      resetGame();
    }

    function sendChatMessage() {
      if (!chatInput.trim()) return;

      setChatMessages(prev => [...prev, {
        type: 'user',
        content: chatInput,
        timestamp: new Date()
      }]);

      // Simula resposta da IA
      setTimeout(() => {
        const response = generateChatResponse(chatInput);
        setChatMessages(prev => [...prev, {
          type: 'ai',
          content: response,
          timestamp: new Date()
        }]);
      }, 1000);

      setChatInput('');
    }

    function generateChatResponse(input) {
      const lower = input.toLowerCase();

      if (lower.includes('melhor jogada') || lower.includes('o que fazer')) {
        const moves = game.moves({ verbose: true });
        if (moves.length > 0) {
          const bestMove = weightedMove(moves);
          return `🎯 Sugiro jogar ${bestMove.san}. Esta jogada ${bestMove.captured ? 'captura uma peça' : 'fortalece sua posição'}.`;
        }
      }

      if (lower.includes('dica') || lower.includes('ajuda')) {
        return `💡 Dica: Tente controlar o centro do tabuleiro (casas d4, d5, e4, e5) e desenvolva suas peças (cavalos e bispos) antes de mover a dama!`;
      }

      if (lower.includes('como') || lower.includes('estratégia')) {
        return `📚 Na abertura, foque em: 1) Controlar o centro, 2) Desenvolver peças, 3) Colocar o rei em segurança (roque). No meio-jogo, busque oportunidades táticas!`;
      }

      return `🤔 Interessante pergunta! Analise o tabuleiro e procure por: capturas, checks, ameaças às peças adversárias e melhorias na posição das suas peças.`;
    }

    function renderBoard() {
      const squares = [];
      const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

      if (boardOrientation === 'black') {
        files.reverse();
        ranks.reverse();
      }

      ranks.forEach((rank, rankIndex) => {
        files.forEach((file, fileIndex) => {
          const square = file + rank;
          const piece = game.get(square);

          const fileNum = file.charCodeAt(0) - 'a'.charCodeAt(0);
          const rankNum = parseInt(rank);
          const isLight = (fileNum + rankNum) % 2 !== 0;

          const isSelected = selectedSquare === square;
          const isValidMove = validMoves.includes(square);
          const isLastMove = lastMove && (lastMove.from === square || lastMove.to === square);

          squares.push(
            <div
              key={square}
              onClick={() => onSquareClick(square)}
              className={`
                aspect-square flex items-center justify-center text-5xl cursor-pointer transition-all relative
                ${isLight ? currentBoardTheme.light : currentBoardTheme.dark}
                ${isSelected ? 'ring-4 ring-green-500 ring-inset' : ''}
                ${isValidMove ? 'ring-4 ring-yellow-400 ring-inset' : ''}
                ${isLastMove ? 'bg-opacity-70 ring-2 ring-blue-400 ring-inset' : ''}
                hover:brightness-110
              `}
            >
              {fileIndex === 0 && (
                <span className={`absolute top-1 left-1 text-xs font-bold ${isLight ? 'text-amber-900' : 'text-amber-100'
                  }`}>
                  {rank}
                </span>
              )}
              {rankIndex === ranks.length - 1 && (
                <span className={`absolute bottom-1 right-1 text-xs font-bold ${isLight ? 'text-amber-900' : 'text-amber-100'
                  }`}>
                  {file}
                </span>
              )}

              {piece && (
                <img
                  src={pieceSymbols[piece.color + piece.type]}
                  alt={`${piece.color}${piece.type}`}
                  className="z-10 w-4/5 h-4/5 pointer-events-none select-none"
                />
              )}

              {isValidMove && !piece && (
                <div className="w-5 h-5 bg-green-500 rounded-full opacity-60 shadow-lg"></div>
              )}

              {isValidMove && piece && (
                <div className="absolute inset-2 border-4 border-red-500 rounded-full opacity-50"></div>
              )}
            </div>
          );
        });
      });

      return squares;
    }

    return (
      <div className="flex gap-4 w-full h-full p-4 overflow-hidden">

        {/* Painel Esquerdo - Controles */}
        <div className="w-80 flex flex-col gap-4 overflow-y-auto">

          {/* Seletor de Temas */}
          <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4 shadow-lg`}>
            <button
              onClick={() => setShowThemeSelector(!showThemeSelector)}
              className={`flex items-center gap-2 w-full p-2 rounded-lg mb-3 ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'
                }`}
            >
              <Palette size={20} />
              <span className="font-semibold">Personalizar Tema</span>
            </button>

            {showThemeSelector && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block">Estilo de Peças</label>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(pieceThemes).map(([key, theme]) => (
                      <button
                        key={key}
                        onClick={() => setPieceTheme(key)}
                        className={`p-2 rounded-lg text-left transition-all ${pieceTheme === key
                            ? 'bg-purple-600 text-white'
                            : isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'
                          }`}
                      >
                        {theme.name} {theme.pieces.wk}{theme.pieces.bk}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">Estilo do Tabuleiro</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(boardThemes).map(([key, theme]) => (
                      <button
                        key={key}
                        onClick={() => setBoardTheme(key)}
                        className={`p-3 rounded-lg transition-all ${boardTheme === key
                            ? 'ring-2 ring-purple-600'
                            : ''
                          }`}
                      >
                        <div className="flex gap-1 mb-1">
                          <div className={`w-6 h-6 ${theme.light} rounded`}></div>
                          <div className={`w-6 h-6 ${theme.dark} rounded`}></div>
                        </div>
                        <span className="text-xs">{theme.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modo de Jogo */}
          <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4 shadow-lg`}>
            <h3 className="font-semibold mb-3">Modo de Jogo</h3>
            <div className="flex gap-2">
              <button
                onClick={() => changeGameMode('vsAI')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all ${gameMode === 'vsAI'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'
                  }`}
              >
                <Cpu size={16} />
                <span className="text-sm">vs IA</span>
              </button>

              <button
                onClick={() => changeGameMode('vsHuman')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all ${gameMode === 'vsHuman'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'
                  }`}
              >
                <Users size={16} />
                <span className="text-sm">vs Humano</span>
              </button>
            </div>
          </div>

          {/* Controles IA */}
          {gameMode === 'vsAI' && (
            <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4 shadow-lg`}>
              <h3 className="font-semibold mb-3">Dificuldade</h3>
              <input
                type="range"
                min={1}
                max={10}
                value={level}
                onChange={(e) => setLevel(parseInt(e.target.value))}
                className="w-full mb-2"
              />
              <p className="text-sm text-center mb-4">Nível: {level}/10</p>

              <h3 className="font-semibold mb-3">Sua Cor</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => changePlayerColor('w')}
                  className={`flex-1 px-3 py-2 rounded-lg transition-all ${playerColor === 'w'
                      ? 'bg-slate-300 text-slate-900 ring-2 ring-slate-600'
                      : isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'
                    }`}
                >
                  ⚪ Brancas
                </button>

                <button
                  onClick={() => changePlayerColor('b')}
                  className={`flex-1 px-3 py-2 rounded-lg transition-all ${playerColor === 'b'
                      ? 'bg-slate-800 text-white ring-2 ring-purple-500'
                      : isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'
                    }`}
                >
                  ⚫ Pretas
                </button>
              </div>
            </div>
          )}

          {/* Status e Reset */}
          <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4 shadow-lg`}>
            <div className="text-center p-3 mb-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold">
              {gameStatus}
            </div>

            <button
              onClick={resetGame}
              className={`flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg transition-all ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'
                }`}
            >
              <RotateCcw size={18} />
              <span>Novo Jogo</span>
            </button>
          </div>

          {/* Histórico */}
          <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4 shadow-lg`}>
            <h3 className="font-bold mb-2">Movimentos</h3>
            <div className="max-h-48 overflow-y-auto space-y-1 text-sm">
              {moveHistory.map((move, index) => (
                <div key={index} className={`p-2 rounded ${index % 2 === 0 ? (isDark ? 'bg-slate-700' : 'bg-slate-100') : ''
                  }`}>
                  <span className="font-mono">{Math.floor(index / 2) + 1}. {move}</span>
                </div>
              ))}
              {moveHistory.length === 0 && (
                <p className={`text-center py-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Nenhum movimento
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tabuleiro Central */}
        <div className="flex-1 flex items-center justify-center">
          <div className={`w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl ${currentBoardTheme.border} border-8`}>
            <div className="grid grid-cols-8 gap-0 w-full aspect-square">
              {renderBoard()}
            </div>
          </div>
        </div>

        {/* Chat IA - Direita */}
        <div className={`w-96 flex flex-col ${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-lg`}>
          <div className="p-4 border-b border-slate-700 flex items-center gap-2">
            <MessageSquare size={20} className="text-purple-500" />
            <h3 className="font-bold">Assistente de Xadrez IA</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-lg ${msg.type === 'user'
                    ? 'bg-purple-600 text-white'
                    : isDark ? 'bg-slate-700' : 'bg-slate-200'
                  }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <span className="text-xs opacity-60 mt-1 block">
                    {msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {isAnalyzing && (
              <div className="flex justify-start">
                <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className={`p-4 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                placeholder="Pergunte sobre a jogada..."
                className={`flex-1 px-3 py-2 rounded-lg ${isDark
                    ? 'bg-slate-700 text-white placeholder-slate-400'
                    : 'bg-slate-100 text-slate-900 placeholder-slate-500'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
              <button
                onClick={sendChatMessage}
                disabled={!chatInput.trim()}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send size={20} />
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setChatInput('Qual a melhor jogada?');
                  setTimeout(() => sendChatMessage(), 100);
                }}
                className={`text-xs px-3 py-1 rounded-full ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'
                  }`}
              >
                💡 Melhor jogada
              </button>
              <button
                onClick={() => {
                  setChatInput('Me dê uma dica');
                  setTimeout(() => sendChatMessage(), 100);
                }}
                className={`text-xs px-3 py-1 rounded-full ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'
                  }`}
              >
                🎯 Dica
              </button>
              <button
                onClick={() => {
                  setChatInput('Explique estratégia');
                  setTimeout(() => sendChatMessage(), 100);
                }}
                className={`text-xs px-3 py-1 rounded-full ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'
                  }`}
              >
                📚 Estratégia
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const PlaceholderView = ({ title }) => (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
          Em desenvolvimento...
        </p>
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      } transition-colors duration-300`}>

      <header className={`flex items-center justify-between h-16 px-4 w-full ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
        } border-b flex-shrink-0 z-10 transition-colors duration-300`}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              } p-2 rounded-full transition-all duration-200`}
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-3xl">♞</span>
            <span className="text-xl font-bold hidden sm:block">Neural Gambit</span>
          </div>
        </div>

        <h1 className="text-xl font-semibold hidden md:block">
          {activeView === 'dashboard' && ' Dashboard de Estudos'}
          {activeView === 'profile' && 'Meu Perfil'}
          {activeView === 'settings' && 'Configurações'}
          {activeView === 'statistics' && "Estatísticas"}
        </h1>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all duration-300 ${isDark
                ? 'bg-slate-700 hover:bg-slate-600 text-yellow-400'
                : 'bg-slate-200 hover:bg-slate-300 text-indigo-600'
              }`}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button className={`${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            } p-2 rounded-full transition-all duration-200`}>
            <Bell size={20} />
          </button>

          <span className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold text-white">
            SN
          </span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        <aside
          className={`
            flex flex-col ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-r
            transition-all duration-300 ease-in-out flex-shrink-0
            ${sidebarOpen ? 'w-64' : 'w-20'}
          `}
        >
          <nav className="flex-1 p-4 space-y-2 mt-4">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`flex items-center gap-3 p-3 rounded-lg w-full transition-all duration-200 ${activeView === 'dashboard'
                  ? 'bg-purple-600 text-white font-semibold shadow-lg'
                  : isDark
                    ? 'hover:bg-slate-700 text-slate-300'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
            >
              <LayoutDashboard size={20} />
              {sidebarOpen && <span>Jogar</span>}
            </button>

            <button
              onClick={() => setActiveView('profile')}
              className={`flex items-center gap-3 p-3 rounded-lg w-full transition-all duration-200 ${activeView === 'profile'
                  ? 'bg-purple-600 text-white font-semibold shadow-lg'
                  : isDark
                    ? 'hover:bg-slate-700 text-slate-300'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
            >
              <User size={20} />
              {sidebarOpen && <span>Perfil</span>}
            </button>

            <button
              onClick={() => setActiveView('statistics')}
              className={`flex items-center gap-3 p-3 rounded-lg w-full transition-all duration-200 ${activeView === 'statistics'
                  ? 'bg-purple-600 text-white font-semibold shadow-lg'
                  : isDark
                    ? 'hover:bg-slate-700 text-slate-300'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
            >
              <BarChart3 size={20} />
              {sidebarOpen && <span>Estatísticas</span>}
            </button>

            <button
              onClick={() => setActiveView('settings')}
              className={`flex items-center gap-3 p-3 rounded-lg w-full transition-all duration-200 ${activeView === 'settings'
                  ? 'bg-purple-600 text-white font-semibold shadow-lg'
                  : isDark
                    ? 'hover:bg-slate-700 text-slate-300'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
            >
              <Settings size={20} />
              {sidebarOpen && <span>Configurações</span>}
            </button>
          </nav>

          <div className={`p-4 ${isDark ? 'border-slate-700' : 'border-slate-200'} border-t transition-colors duration-300`}>
            <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                SN
              </div>
              {sidebarOpen && (
                <div className="overflow-hidden">
                  <p className="text-sm font-medium truncate">Seu Nome</p>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} truncate`}>seu@email.com</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        <main className={`flex-1 flex flex-col overflow-hidden ${isDark ? 'bg-slate-950' : 'bg-slate-50'
          } transition-colors duration-300`}>
          {activeView === 'dashboard' && <ChessboardView />}
          {activeView === 'profile' && <ProfilePage isDark={isDark}/>}
          {activeView === 'statistics' && <StatisticsPage isDark={isDark}/>}
          {activeView === 'settings' && <SettingsPage isDark={isDark}/>}
        </main>

      </div>
    </div>
  );
}