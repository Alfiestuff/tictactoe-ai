let board = Array(9).fill("");
let gameOver = false;

const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");

// ---------------- RENDER ----------------
function render() {
  boardEl.innerHTML = "";

  board.forEach((v, i) => {
    const cell = document.createElement("div");
    cell.className = "cell " + (v === "X" ? "x" : v === "O" ? "o" : "");
    cell.textContent = v;
    cell.onclick = () => playerMove(i);
    boardEl.appendChild(cell);
  });
}

// ---------------- PLAYER ----------------
function playerMove(i) {
  if (board[i] || gameOver) return;

  board[i] = "X";
  render();

  const result = checkWinner(board);
  if (result) return endGame(result);

  statusEl.textContent = "AI thinking...";
  setTimeout(aiMove, 50);
}

// ---------------- AI (UNBEATABLE) ----------------
function aiMove() {
  if (gameOver) return;

  let bestScore = -Infinity;
  let move = -1;

  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = "O";
      let score = minimax(board, 0, false, -Infinity, Infinity);
      board[i] = "";

      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  if (move !== -1) board[move] = "O";

  render();

  const result = checkWinner(board);
  if (result) return endGame(result);

  statusEl.textContent = "Your turn";
}

// ---------------- MINIMAX + PRUNING ----------------
function minimax(b, depth, isMax, alpha, beta) {
  const result = checkWinner(b);

  if (result !== null) {
    if (result === "O") return 10 - depth;
    if (result === "X") return depth - 10;
    return 0;
  }

  if (isMax) {
    let best = -Infinity;

    for (let i = 0; i < 9; i++) {
      if (!b[i]) {
        b[i] = "O";
        best = Math.max(best, minimax(b, depth + 1, false, alpha, beta));
        b[i] = "";

        alpha = Math.max(alpha, best);
        if (beta <= alpha) break;
      }
    }

    return best;
  } else {
    let best = Infinity;

    for (let i = 0; i < 9; i++) {
      if (!b[i]) {
        b[i] = "X";
        best = Math.min(best, minimax(b, depth + 1, true, alpha, beta));
        b[i] = "";

        beta = Math.min(beta, best);
        if (beta <= alpha) break;
      }
    }

    return best;
  }
}

// ---------------- WIN CHECK ----------------
function checkWinner(b) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (let [a,b1,c] of wins) {
    if (b[a] && b[a] === b[b1] && b[a] === b[c]) {
      return b[a];
    }
  }

  if (!b.includes("")) return "draw";
  return null;
}

// ---------------- GAME END ----------------
function endGame(result) {
  gameOver = true;

  if (result === "draw") {
    statusEl.textContent = "Draw";
  } else if (result === "X") {
    statusEl.textContent = "You win (rare)";
  } else {
    statusEl.textContent = "AI wins";
  }

  render();
}

// ---------------- RESET ----------------
function resetGame() {
  board = Array(9).fill("");
  gameOver = false;
  statusEl.textContent = "Your turn";
  render();
}

render();
