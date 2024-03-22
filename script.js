let board;
let startTime;
let timerInterval;
let isFirstWrongInput = true;

const sudokuBoardWrapper = document.getElementById("sudoku-board-wrapper");
const sudokuBoard = document.getElementById("sudoku-board");
const sudokuCounter = document.getElementById("sudoku-counter");
const difficultyButtons = document.getElementById("difficulty-buttons");
const easyBtn = document.getElementById("easy-btn");
const mediumBtn = document.getElementById("medium-btn");
const hardBtn = document.getElementById("hard-btn");

easyBtn.addEventListener("click", () => {
    setDifficulty(32);
});

mediumBtn.addEventListener("click", () => {
    setDifficulty(25);
});

hardBtn.addEventListener("click", () => {
    setDifficulty(20);
});

function setDifficulty(numGiven) {
    startTimer();
    hideButtons();
    sudokuBoardWrapper.classList.add("show");
    board = generateRandomBoard(numGiven);
    renderBoard(board);
}

function hideButtons() {
    difficultyButtons.style.display = "none";
}


function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const elapsedTime = Date.now() - startTime;
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    const formattedTime = pad(minutes) + ":" + pad(seconds);
    sudokuCounter.textContent = "sayac: " + formattedTime;
}

function pad(val) {
    return val < 10 ? "0" + val : val;
}

function renderBoard(board) {
    const table = document.getElementById("sudoku-board");

    table.innerHTML = "";

    for (let i = 0; i < 9; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement("td");
            cell.textContent = board[i][j] !== 0 ? board[i][j] : "";
            if (board[i][j] !== 0) {
                cell.classList.add("given");
            }
            row.appendChild(cell);

            cell.addEventListener("click", () => {
                if (!cell.classList.contains("given")) {
                    const value = prompt("sayi gir (1-9):");
                    const num = parseInt(value);
                    if (!isNaN(num) && num >= 1 && num <= 9) {
                        if (isValidMove(board, i, j, num)) {
                            board[i][j] = num;
                            cell.textContent = num;
                            cell.classList.remove("error");
                        } else {
                            if (isFirstWrongInput) {
                                showWrongInputImage();
                                isFirstWrongInput = false;
                            }
                            alert("olmaz. duzgun sayi gir.");
                            cell.classList.add("error");
                        }
                    } else {
                        alert("sayi gir sayi.");
                    }
                }
            });
        }
        table.appendChild(row);
    }
}

function showWrongInputImage() {
    const wrongInputImage = document.getElementById("wrong-input-image");
    wrongInputImage.style.display = "block";

    setTimeout(() => {
        wrongInputImage.style.display = "none";
    }, 3500);
}


function isValidMove(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num || board[i][col] === num) {
            return false;
        }
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j] === num) {
                return false;
            }
        }
    }

    return true;
}

function generateRandomBoard(numGiven) {
    const shuffled = Array.from({ length: 9 }, () =>
        Array.from({ length: 9 }, () => 0)
    );

    let count = 0;
    while (count < numGiven) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        const num = Math.floor(Math.random() * 9) + 1;
        if (shuffled[row][col] === 0 && isValidMove(shuffled, row, col, num)) {
            shuffled[row][col] = num;
            count++;
        }
    }

    return shuffled;
}