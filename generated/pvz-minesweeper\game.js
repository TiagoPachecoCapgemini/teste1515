class MinesweeperGame {
    constructor() {
        this.difficulties = {
            easy: { rows: 8, cols: 8, zombies: 10 },
            medium: { rows: 12, cols: 12, zombies: 25 },
            hard: { rows: 16, cols: 16, zombies: 50 }
        };
        
        this.currentDifficulty = 'easy';
        this.board = [];
        this.gameStatus = 'idle';
        this.firstClick = true;
        this.timerInterval = null;
        this.startTime = null;
        this.flagsPlaced = 0;
        
        this.initializeElements();
        this.setupEventListeners();
        this.initializeGame();
    }
    
    initializeElements() {
        this.gameBoardEl = document.getElementById('gameBoard');
        this.zombieCountEl = document.getElementById('zombieCount');
        this.flagCountEl = document.getElementById('flagCount');
        this.timerEl = document.getElementById('timer');
        this.restartBtn = document.getElementById('restartBtn');
        this.modalEl = document.getElementById('gameModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalMessage = document.getElementById('modalMessage');
        this.modalIcon = document.getElementById('modalIcon');
        this.modalRestartBtn = document.getElementById('modalRestartBtn');
        this.difficultyBtns = document.querySelectorAll('.difficulty-btn');
    }
    
    setupEventListeners() {
        this.restartBtn.addEventListener('click', () => this.initializeGame());
        this.modalRestartBtn.addEventListener('click', () => {
            this.hideModal();
            this.initializeGame();
        });
        
        this.difficultyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.difficultyBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentDifficulty = e.target.dataset.difficulty;
                this.initializeGame();
            });
        });
    }
    
    initializeGame() {
        this.gameStatus = 'idle';
        this.firstClick = true;
        this.flagsPlaced = 0;
        this.stopTimer();
        this.resetTimer();
        
        const config = this.difficulties[this.currentDifficulty];
        this.rows = config.rows;
        this.cols = config.cols;
        this.zombieCount = config.zombies;
        
        this.createBoard();
        this.renderBoard();
        this.updateUI();
    }
    
    createBoard() {
        this.board = [];
        for (let row = 0; row < this.rows; row++) {
            this.board[row] = [];
            for (let col = 0; col < this.cols; col++) {
                this.board[row][col] = {
                    row,
                    col,
                    hasZombie: false,
                    isRevealed: false,
                    isFlagged: false,
                    adjacentZombies: 0
                };
            }
        }
    }
    
    placeZombies(excludeRow, excludeCol) {
        let zombiesPlaced = 0;
        while (zombiesPlaced < this.zombieCount) {
            const row = Math.floor(Math.random() * this.rows);
            const col = Math.floor(Math.random() * this.cols);
            
            if (!this.board[row][col].hasZombie && !(row === excludeRow && col === excludeCol)) {
                this.board[row][col].hasZombie = true;
                zombiesPlaced++;
            }
        }
        
        this.calculateAdjacentZombies();
    }
    
    calculateAdjacentZombies() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (!this.board[row][col].hasZombie) {
                    let count = 0;
                    for (let dr = -1; dr <= 1; dr++) {
                        for (let dc = -1; dc <= 1; dc++) {
                            if (dr === 0 && dc === 0) continue;
                            const newRow = row + dr;
                            const newCol = col + dc;
                            if (this.isValidCell(newRow, newCol) && this.board[newRow][newCol].hasZombie) {
                                count++;
                            }
                        }
                    }
                    this.board[row][col].adjacentZombies = count;
                }
            }
        }
    }
    
    isValidCell(row, col) {
        return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    }
    
    renderBoard() {
        this.gameBoardEl.innerHTML = '';
        this.gameBoardEl.style.gridTemplateColumns = `repeat(${this.cols}, 40px)`;
        this.gameBoardEl.style.gridTemplateRows = `repeat(${this.rows}, 40px)`;
        
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.dataset.row = row;
                tile.dataset.col = col;
                
                tile.addEventListener('click', () => this.handleTileClick(row, col));
                tile.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.handleTileRightClick(row, col);
                });
                
                tile.addEventListener('touchstart', (e) => {
                    this.touchTimer = setTimeout(() => {
                        e.preventDefault();
                        this.handleTileRightClick(row, col);
                    }, 500);
                });
                
                tile.addEventListener('touchend', () => {
                    clearTimeout(this.touchTimer);
                });
                
                this.gameBoardEl.appendChild(tile);
            }
        }
    }
    
    handleTileClick(row, col) {
        if (this.gameStatus === 'won' || this.gameStatus === 'lost') return;
        
        const cell = this.board[row][col];
        if (cell.isRevealed || cell.isFlagged) return;
        
        if (this.firstClick) {
            this.placeZombies(row, col);
            this.firstClick = false;
            this.gameStatus = 'running';
            this.startTimer();
        }
        
        this.revealCell(row, col);
        this.updateBoard();
        this.checkWinCondition();
    }
    
    handleTileRightClick(row, col) {
        if (this.gameStatus === 'won' || this.gameStatus === 'lost') return;
        
        const cell = this.board[row][col];
        if (cell.isRevealed) return;
        
        cell.isFlagged = !cell.isFlagged;
        this.flagsPlaced += cell.isFlagged ? 1 : -1;
        this.updateBoard();
        this.updateUI();
    }
    
    revealCell(row, col) {
        if (!this.isValidCell(row, col)) return;
        
        const cell = this.board[row][col];
        if (cell.isRevealed || cell.isFlagged) return;
        
        cell.isRevealed = true;
        
        if (cell.hasZombie) {
            this.gameOver(false);
            return;
        }
        
        if (cell.adjacentZombies === 0) {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    this.revealCell(row + dr, col + dc);
                }
            }
        }
    }
    
    updateBoard() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = this.board[row][col];
                const tileEl = this.gameBoardEl.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                
                tileEl.className = 'tile';
                tileEl.textContent = '';
                
                if (cell.isRevealed) {
                    tileEl.classList.add('revealed');
                    if (cell.hasZombie) {
                        tileEl.classList.add('zombie');
                    } else if (cell.adjacentZombies > 0) {
                        tileEl.classList.add(`number-${cell.adjacentZombies}`);
                        tileEl.textContent = cell.adjacentZombies;
                    } else {
                        tileEl.classList.add('plant');
                    }
                } else if (cell.isFlagged) {
                    tileEl.classList.add('flagged');
                }
            }
        }
    }
    
    checkWinCondition() {
        let revealedCount = 0;
        let totalSafeCells = this.rows * this.cols - this.zombieCount;
        
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = this.board[row][col];
                if (cell.isRevealed && !cell.hasZombie) {
                    revealedCount++;
                }
            }
        }
        
        if (revealedCount === totalSafeCells) {
            this.gameOver(true);
        }
    }
    
    gameOver(won) {
        this.gameStatus = won ? 'won' : 'lost';
        this.stopTimer();
        
        if (!won) {
            for (let row = 0; row < this.rows; row++) {
                for (let col = 0; col < this.cols; col++) {
                    if (this.board[row][col].hasZombie) {
                        this.board[row][col].isRevealed = true;
                    }
                }
            }
            this.updateBoard();
        }
        
        this.showModal(won);
    }
    
    showModal(won) {
        this.modalIcon.className = 'modal-icon ' + (won ? 'win' : 'lose');
        this.modalTitle.textContent = won ? 'You Win!' : 'Game Over!';
        this.modalMessage.textContent = won 
            ? `You cleared all plants in ${this.timerEl.textContent} seconds!`
            : 'You hit a zombie! Try again!';
        this.modalEl.classList.remove('hidden');
    }
    
    hideModal() {
        this.modalEl.classList.add('hidden');
    }
    
    updateUI() {
        this.zombieCountEl.textContent = this.zombieCount;
        this.flagCountEl.textContent = this.zombieCount - this.flagsPlaced;
    }
    
    startTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            this.timerEl.textContent = elapsed;
        }, 1000);
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    resetTimer() {
        this.timerEl.textContent = '0';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MinesweeperGame();
});