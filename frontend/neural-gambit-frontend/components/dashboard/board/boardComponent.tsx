import React, { useState, useEffect, useRef } from 'react';
import { Chess } from "chess.js";
// Importação da engine de xadrez
// @ts-ignore
import { aiMove } from 'js-chess-engine'; 
import {
  RotateCcw, Cpu, Users, Palette, Send, MessageSquare, Lightbulb, X,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from 'lucide-react';
import Chatbot from '../chatSidebar';

export default function ChessBoard({ isDark }: { isDark: boolean }) {
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [validMoves, setValidMoves] = useState<string[]>([]);
  const [level, setLevel] = useState(3); // Nível visual (1-10)
  const [gameMode, setGameMode] = useState('vsAI');
  const [playerColor, setPlayerColor] = useState('w');
  const [gameStatus, setGameStatus] = useState('');
  const [boardOrientation, setBoardOrientation] = useState('white');
  const [moveHistory, setMoveHistory] = useState<string[]>([]); 
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1); 
  const [lastMove, setLastMove] = useState<{from: string, to: string} | null>(null);
  const [pieceTheme, setPieceTheme] = useState('classic');
  const [boardTheme, setBoardTheme] = useState('wooden');
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const pgnSavedRef = useRef(false);
  const [isSavingPGN, setIsSavingPGN] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [showInsightModal, setShowInsightModal] = useState(false);

  // Definindo tipos para os temas para evitar erros de indexação
  const pieceThemes: any = {
    classic: { name: 'Clássico', pieces: { 'wp': '/pieces/pawn-w.svg', 'wn': '/pieces/knight-w.svg', 'wb': '/pieces/bishop-w.svg', 'wr': '/pieces/rook-w.svg', 'wq': '/pieces/queen-w.svg', 'wk': '/pieces/king-w.svg', 'bp': '/pieces/pawn-b.svg', 'bn': '/pieces/knight-b.svg', 'bb': '/pieces/bishop-b.svg', 'br': '/pieces/rook-b.svg', 'bq': '/pieces/queen-b.svg', 'bk': '/pieces/king-b.svg' } }
  };

  const boardThemes: any = {
    wooden: { name: 'Madeira', light: 'bg-amber-200', dark: 'bg-amber-700', border: 'border-amber-900' },
    marble: { name: 'Mármore', light: 'bg-slate-100', dark: 'bg-slate-600', border: 'border-slate-800' },
    ocean: { name: 'Oceano', light: 'bg-cyan-200', dark: 'bg-cyan-700', border: 'border-cyan-900' },
    forest: { name: 'Floresta', light: 'bg-emerald-200', dark: 'bg-emerald-700', border: 'border-emerald-900' },
    royal: { name: 'Real', light: 'bg-purple-200', dark: 'bg-purple-700', border: 'border-purple-900' },
    neon: { name: 'Neon', light: 'bg-pink-300', dark: 'bg-purple-900', border: 'border-pink-500' }
  };

  const pieceSymbols = pieceThemes[pieceTheme].pieces; 
  const currentBoardTheme = boardThemes[boardTheme];

  function navigateHistory(direction: string) {
    let newIndex = currentMoveIndex;
    if (direction === 'start') newIndex = -1;
    else if (direction === 'prev') newIndex = Math.max(-1, currentMoveIndex - 1);
    else if (direction === 'next') newIndex = Math.min(moveHistory.length - 1, currentMoveIndex + 1);
    else if (direction === 'end') newIndex = moveHistory.length - 1;

    if (newIndex !== currentMoveIndex) {
      setCurrentMoveIndex(newIndex);
      const tempGame = new Chess();
      for (let i = 0; i <= newIndex; i++) tempGame.move(moveHistory[i]);
      setGame(tempGame);
      if (newIndex >= 0) {
        // @ts-ignore - history com verbose pode retornar array
        const history = tempGame.history({ verbose: true });
        const lastMoved = history.pop();
        if (lastMoved) setLastMove({ from: lastMoved.from, to: lastMoved.to });
      } else {
        setLastMove(null);
      }
    }
  }

  async function fetchSendMoves(moves: string[]) {
    setIsLoadingInsight(true);
    try {
      const response = await fetch('/api/chat/moves', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ moves, board_pgn: game.pgn() }) });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      if (!response.body) throw new Error("No response body");
      
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let insightContent = '';
      const newInsightIndex = insights.length;
      setInsights(prev => [...prev, { moves: moves.slice(-1)[0], content: '', timestamp: new Date() }]);
      
      while (true) {
        const { done, value } = await reader.read(); if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        for (const line of lines) { if (line.startsWith('data: ')) insightContent += line.substring(6); else if (line.trim() && !line.startsWith(':')) insightContent += line; }
        setInsights(prev => { const updated = [...prev]; if (updated[newInsightIndex]) updated[newInsightIndex] = { ...updated[newInsightIndex], content: insightContent }; return updated; });
      }
      setIsLoadingInsight(false); return { success: true, insight: insightContent };
    } catch (error) { console.error(error); setIsLoadingInsight(false); return { success: false, error }; }
  }

  const handleManualAnalysis = () => {
    if (game.isCheckmate()) return;
    setShowInsightModal(true);
    // @ts-ignore
    const uciMoves = game.history({ verbose: true }).map((m: any) => m.from + m.to);
    fetchSendMoves(uciMoves);
  };

  useEffect(() => {
    updateGameStatus();
    const isLatestMove = currentMoveIndex === moveHistory.length - 1;
    // Adiciona um pequeno delay para a IA não responder instantaneamente (parece mais natural)
    if (gameMode === 'vsAI' && game.turn() !== playerColor && !isGameFinished() && isLatestMove) {
      const timer = setTimeout(() => makeAIMove(), 500);
      return () => clearTimeout(timer);
    }
  }, [game]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);

  async function savePGNToBackend(pgn: string) {
    if (!pgn || pgnSavedRef.current) return; setIsSavingPGN(true);
    try {
      const res = await fetch('/api/studies/insert', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ game_pgn: pgn }) });
      if (res.ok) { pgnSavedRef.current = true; setChatMessages(prev => [...prev, { type: 'system', content: 'PGN salvo.', timestamp: new Date() }]); }
    } catch (err) { console.error(err); } finally { setIsSavingPGN(false); }
  }

  function updateGameStatus() {
    if (game.isCheckmate()) { const winner = game.turn() === 'w' ? 'Pretas' : 'Brancas'; setGameStatus(`Xeque-mate! ${winner} venceram! 🏆`); savePGNToBackend(game.pgn()); }
    else if (game.isDraw()) setGameStatus('Empate! 🤝'); else if (game.isCheck()) setGameStatus('Xeque! ⚠️');
    else { const turn = game.turn() === 'w' ? 'Brancas' : 'Pretas'; setGameStatus(gameMode === 'vsAI' && game.turn() !== playerColor ? 'IA pensando... 🤖' : `Vez das ${turn} ♟️`); }
  }
   
  function isGameFinished() { return game.isGameOver() || game.isDraw() || game.isCheckmate() || game.isStalemate() || game.isThreefoldRepetition(); }

  function onSquareClick(square: string) {
    if (currentMoveIndex !== moveHistory.length - 1) return;
    if (isGameFinished() || (gameMode === 'vsAI' && game.turn() !== playerColor)) return;
    if (selectedSquare === square) { setSelectedSquare(null); setValidMoves([]); return; }
    
    const moveResult = makeMove(selectedSquare, square);
    setSelectedSquare(null); setValidMoves([]);
    
    if (!moveResult) {
      // @ts-ignore
      const piece = game.get(square);
      if (piece && piece.color === game.turn()) { 
          setSelectedSquare(square); 
          // @ts-ignore
          setValidMoves(game.moves({ square: square, verbose: true }).map((m: any) => m.to)); 
      }
    }
  }

  function makeMove(from: string | null, to: string) {
    if (!from) return false;
    try {
      const move = game.move({ from, to, promotion: 'q' });
      if (move) {
        const updatedGame = new Chess(); updatedGame.loadPgn(game.pgn()); setGame(updatedGame);
        const newHistory = [...moveHistory, move.san];
        setMoveHistory(newHistory);
        setCurrentMoveIndex(newHistory.length - 1);
        setLastMove({ from, to });
        return true;
      }
      return false;
    } catch (e) { return false; }
  }

  /**
   * NOVA LÓGICA DE IA USANDO js-chess-engine
   * Substitui weightedMove e randomMove
   */
  function makeAIMove() {
    if (isGameFinished()) return;

    // Mapeamento do slider (1-10) para a engine (0-3)
    // js-chess-engine fica muito forte e lenta acima do nível 3 sem web workers
    let engineLevel = 0; 
    if (level >= 4 && level <= 6) engineLevel = 1;
    if (level >= 7 && level <= 8) engineLevel = 2;
    if (level >= 9) engineLevel = 3;

    try {
        // aiMove retorna um objeto ex: { "E2": "E4" }
        const moveMap = aiMove(game.fen(), engineLevel);
        
        // Obtém a origem e destino (keys e values vêm em maiúsculo, chess.js prefere minúsculo)
        const fromKey = Object.keys(moveMap)[0];
        const toKey = moveMap[fromKey];
        
        const from = fromKey.toLowerCase();
        const to = toKey.toLowerCase();

        const move = game.move({ from, to, promotion: 'q' });

        if (move) {
            const updatedGame = new Chess(); 
            updatedGame.loadPgn(game.pgn()); 
            setGame(updatedGame);
            
            const newHistory = [...moveHistory, move.san];
            setMoveHistory(newHistory);
            setCurrentMoveIndex(newHistory.length - 1);
            setLastMove({ from: move.from, to: move.to });
        }
    } catch (error) {
        console.error("Erro na engine:", error);
        // Fallback de segurança caso a engine falhe
        const moves = game.moves();
        if (moves.length > 0) {
            const randomM = moves[Math.floor(Math.random() * moves.length)];
            game.move(randomM);
            const updatedGame = new Chess(); updatedGame.loadPgn(game.pgn()); setGame(updatedGame);
        }
    }
  }

  function resetGame() {
    setGame(new Chess()); setSelectedSquare(null); setValidMoves([]); setGameStatus('');
    setMoveHistory([]); setCurrentMoveIndex(-1);
    setLastMove(null); pgnSavedRef.current = false; setInsights([]); setShowInsightModal(false);
  }

  function changeGameMode(mode: string) { setGameMode(mode); resetGame(); }
  function changePlayerColor(color: string) { setPlayerColor(color); setBoardOrientation(color === 'w' ? 'white' : 'black'); resetGame(); }

  function renderBoard() {
    // CORREÇÃO: Usando React.ReactNode[] em vez de JSX.Element[]
    const squares: React.ReactNode[] = []; 
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']; 
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    
    if (boardOrientation === 'black') { files.reverse(); ranks.reverse(); }
    ranks.forEach((rank, rankIndex) => {
      files.forEach((file, fileIndex) => {
        const square = file + rank; 
        // @ts-ignore
        const piece = game.get(square);
        const fileNum = file.charCodeAt(0) - 'a'.charCodeAt(0); const rankNum = parseInt(rank);
        const isLight = (fileNum + rankNum) % 2 !== 0; const isSelected = selectedSquare === square;
        const isValidMove = validMoves.includes(square); const isLastMove = lastMove && (lastMove.from === square || lastMove.to === square);
        const cursorClass = (currentMoveIndex === moveHistory.length - 1) ? 'cursor-pointer' : 'cursor-default';
        squares.push(
          <div key={square} onClick={() => onSquareClick(square)}
            className={`aspect-square flex items-center justify-center text-5xl ${cursorClass} transition-all relative
              ${isLight ? currentBoardTheme.light : currentBoardTheme.dark}
              ${isSelected ? 'ring-4 ring-green-500 ring-inset' : ''}
              ${isValidMove ? 'ring-4 ring-yellow-400 ring-inset' : ''}
              ${isLastMove ? 'bg-opacity-70 ring-2 ring-blue-400 ring-inset' : ''}`}
          >
            {fileIndex === 0 && <span className={`absolute top-1 left-1 text-xs font-bold ${isLight ? 'text-amber-900' : 'text-amber-100'}`}>{rank}</span>}
            {rankIndex === ranks.length - 1 && <span className={`absolute bottom-1 right-1 text-xs font-bold ${isLight ? 'text-amber-900' : 'text-amber-100'}`}>{file}</span>}
            {piece && <img src={pieceSymbols[piece.color + piece.type]} alt={`${piece.color}${piece.type}`} className="z-10 w-4/5 h-4/5 pointer-events-none select-none" />}
            {isValidMove && !piece && <div className="w-5 h-5 bg-green-500 rounded-full opacity-60 shadow-lg"></div>}
            {isValidMove && piece && <div className="absolute inset-2 border-4 border-red-500 rounded-full opacity-50"></div>}
          </div>
        );
      });
    }); return squares;
  }

  const isMate = game.isCheckmate();

  return (
    <div className="flex gap-4 w-full h-full p-4 overflow-hidden relative">
      {showInsightModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
           <div className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto" onClick={() => setShowInsightModal(false)}/>
           <div className={`pointer-events-auto relative w-full max-w-md p-6 rounded-2xl shadow-2xl transform transition-all scale-100 ${isDark ? 'bg-slate-800 text-white border border-slate-600' : 'bg-white text-slate-900 border border-slate-200'}`}>
              <button onClick={() => setShowInsightModal(false)} className={`absolute top-3 right-3 p-1 rounded-full transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}><X size={20} /></button>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full"><Lightbulb className="text-yellow-500" size={24} /></div>
                <h3 className="text-lg font-bold">Análise da Posição</h3>
              </div>
              <div className={`min-h-[150px] max-h-[60vh] overflow-y-auto p-4 rounded-xl text-sm leading-relaxed ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                {isLoadingInsight && insights.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-purple-500"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current mb-2"></div><span>Analisando tabuleiro...</span></div>
                ) : (
                  <div className="prose dark:prose-invert max-w-none">
                      {insights.length > 0 ? insights[insights.length - 1].content : "Clique na lâmpada para gerar uma análise."}
                      {isLoadingInsight && <span className="inline-block w-2 h-4 ml-1 bg-purple-500 animate-pulse"/>}
                  </div>
                )}
              </div>
           </div>
        </div>
      )}

      <div className="w-80 flex flex-col gap-4 overflow-y-auto">
        <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4 shadow-lg`}>
          <button onClick={() => setShowThemeSelector(!showThemeSelector)} className={`flex items-center gap-2 w-full p-2 rounded-lg mb-3 ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'}`}>
            <Palette size={20} /><span className="font-semibold">Personalizar Tema</span>
          </button>
          {showThemeSelector && (
            <div className="space-y-4">
              <div><label className="text-sm font-semibold mb-2 block">Estilo de Peças</label><div className="grid grid-cols-1 gap-2">{Object.entries(pieceThemes).map(([key, theme]: [string, any]) => (<button key={key} onClick={() => setPieceTheme(key)} className={`p-2 rounded-lg text-left transition-all ${pieceTheme === key ? 'bg-purple-600 text-white' : isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'}`}>{theme.name}</button>))}</div></div>
              <div><label className="text-sm font-semibold mb-2 block">Estilo do Tabuleiro</label><div className="grid grid-cols-2 gap-2">{Object.entries(boardThemes).map(([key, theme]: [string, any]) => (<button key={key} onClick={() => setBoardTheme(key)} className={`p-3 rounded-lg transition-all ${boardTheme === key ? 'ring-2 ring-purple-600' : ''}`}><div className="flex gap-1 mb-1"><div className={`w-6 h-6 ${theme.light} rounded`}></div><div className={`w-6 h-6 ${theme.dark} rounded`}></div></div><span className="text-xs">{theme.name}</span></button>))}</div></div>
            </div>
          )}
        </div>
        <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4 shadow-lg`}>
          <h3 className="font-semibold mb-3">Modo de Jogo</h3>
          <div className="flex gap-2">
            <button onClick={() => changeGameMode('vsAI')} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all ${gameMode === 'vsAI' ? 'bg-purple-600 text-white shadow-lg' : isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'}`}><Cpu size={16} /><span className="text-sm">vs IA</span></button>
            <button onClick={() => changeGameMode('vsHuman')} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all ${gameMode === 'vsHuman' ? 'bg-purple-600 text-white shadow-lg' : isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'}`}><Users size={16} /><span className="text-sm">vs Humano</span></button>
          </div>
        </div>
        {gameMode === 'vsAI' && (
          <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4 shadow-lg`}>
            <h3 className="font-semibold mb-3">Dificuldade</h3><input type="range" min={1} max={10} value={level} onChange={(e) => setLevel(parseInt(e.target.value))} className="w-full mb-2" /><p className="text-sm text-center mb-4">Nível: {level}/10</p>
            <h3 className="font-semibold mb-3">Sua Cor</h3>
            <div className="flex gap-2">
              <button onClick={() => changePlayerColor('w')} className={`flex-1 px-3 py-2 rounded-lg transition-all ${playerColor === 'w' ? 'bg-slate-300 text-slate-900 ring-2 ring-slate-600' : isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'}`}>⚪ Brancas</button>
              <button onClick={() => changePlayerColor('b')} className={`flex-1 px-3 py-2 rounded-lg transition-all ${playerColor === 'b' ? 'bg-slate-800 text-white ring-2 ring-purple-500' : isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'}`}>⚫ Pretas</button>
            </div>
          </div>
        )}
        <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4 shadow-lg`}>
          <div className="text-center p-3 mb-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold">{gameStatus}</div>
          <button onClick={resetGame} className={`flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg transition-all ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'}`}><RotateCcw size={18} /><span>Novo Jogo</span></button>
          {isSavingPGN && <p className="mt-2 text-xs text-yellow-400">Salvando PGN...</p>}
        </div>
        <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4 shadow-lg`}>
          <h3 className="font-bold mb-2">Movimentos</h3>
          <div className="max-h-48 overflow-y-auto space-y-1 text-sm">
            {moveHistory.map((move, index) => (
               <div key={index} 
                 onClick={() => navigateHistory('start' + (index + 1))}
                 className={`p-2 rounded ${index === currentMoveIndex ? 'bg-purple-500 text-white font-bold' : (index % 2 === 0 ? (isDark ? 'bg-slate-700' : 'bg-slate-100') : '')}`}>
                 <span className="font-mono">{Math.floor(index / 2) + 1}. {move}</span>
               </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className={`relative w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl ${currentBoardTheme.border} border-8`}>
          <div className="grid grid-cols-8 gap-0 w-full aspect-square">
            {renderBoard()}
          </div>
        </div>

        <div className="w-full max-w-2xl flex flex-col gap-2">
          <div className={`flex items-center justify-between px-4 py-2 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-white'} shadow`}>
             <button onClick={() => navigateHistory('start')} className={`p-2 rounded hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors ${currentMoveIndex === -1 ? 'opacity-30 cursor-not-allowed' : ''}`}><ChevronsLeft size={24}/></button>
             <button onClick={() => navigateHistory('prev')} className={`p-2 rounded hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors ${currentMoveIndex === -1 ? 'opacity-30 cursor-not-allowed' : ''}`}><ChevronLeft size={24}/></button>
             <span className="font-mono font-bold text-sm">
                {currentMoveIndex === -1 ? "Início" : `Lance ${Math.floor(currentMoveIndex / 2) + 1}${currentMoveIndex % 2 === 0 ? ' (Brancas)' : ' (Pretas)'}`}
             </span>
             <button onClick={() => navigateHistory('next')} className={`p-2 rounded hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors ${currentMoveIndex === moveHistory.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}><ChevronRight size={24}/></button>
             <button onClick={() => navigateHistory('end')} className={`p-2 rounded hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors ${currentMoveIndex === moveHistory.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}><ChevronsRight size={24}/></button>
          </div>

          <button 
              onClick={handleManualAnalysis}
              disabled={isLoadingInsight || isMate}
              className={`
                  w-full flex items-center justify-center gap-2 px-4 py-4 rounded-xl shadow-lg font-bold text-lg transition-all transform
                  ${isLoadingInsight || isMate 
                      ? 'cursor-not-allowed opacity-70' 
                      : 'hover:scale-[1.01] active:scale-95'}
                  ${isDark 
                      ? (isMate ? 'bg-slate-600 text-slate-400' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white') 
                      : (isMate ? 'bg-gray-200 text-gray-500 border-gray-300' : 'bg-white hover:bg-gray-50 text-purple-700 border border-gray-200')
                  }
              `}
          >
              <Lightbulb size={24} className={isLoadingInsight ? 'animate-pulse' : ''} fill={isLoadingInsight ? "currentColor" : "none"} />
              <span>
                {isLoadingInsight ? 'Analisando Posição Atual...' : 
                 isMate ? 'Xeque-mate! (Fim de Jogo)' : 
                 'Análise da Posição'}
              </span>
          </button>
        </div>

        <div className={`w-full max-w-2xl ${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg p-2 shadow-lg opacity-70 hover:opacity-100 transition-opacity`}>
           <div className="flex items-center justify-between px-2">
             <span className="text-xs font-bold opacity-50">Histórico de Análises</span>
             <span className="text-xs opacity-50">{insights.length} análises geradas</span>
           </div>
        </div>
      </div>

      <Chatbot isDark={isDark} moves={game.pgn()} />
    </div>
  );
}
