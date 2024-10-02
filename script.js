// Player factory to create players
const Player = (name, mark) => {
    return { name, mark };
};

const gameBoard = (() => {
    let board = Array(9).fill(null); // Initialize board with null values

    const resetBoard = () => {
        board = Array(9).fill(null); // Reset board to empty state
    };

    const getBoard = () => board;

    const setMark = (index, mark) => {
        if (!board[index]) {
            board[index] = mark; // Set the mark if the spot is empty
        }
    };

    return {
        resetBoard,
        getBoard,
        setMark
    };
})();

const displayController = (() => {
    let player1;
    let player2;
    let currentPlayer;
    let isGameOver = false;

    const startGame = () => {
        // Get player names from inputs
        const player1Name = document.getElementById('player1Input').value;
        const player2Name = document.getElementById('player2Input').value;

        // Initialize players
        player1 = Player(player1Name, 'x'); // Set the mark as 'x'
        player2 = Player(player2Name, 'o'); // Set the mark as 'o'

        // Set the current player to Player 1
        currentPlayer = player1;

        // Hide the overlay
        document.getElementById('overlay').style.display = 'none';

        // Update hover effect for the current player (X or O)
        updateHoverEffect();
        renderBoard(); // Render the initial empty board
    };

    const handleClick = (index) => {
        if (isGameOver || gameBoard.getBoard()[index]) return; // Return if game over or cell already filled

        // Set the mark on the board (either 'x' or 'o')
        gameBoard.setMark(index, currentPlayer.mark);

        // Render the updated board
        renderBoard();

        // Check for win or tie
        if (checkWinner()) {
            displayWinner(currentPlayer.name);
            isGameOver = true;
        } else if (gameBoard.getBoard().every(cell => cell !== null)) {
            displayWinner('No one'); // It's a tie
            isGameOver = true;
        } else {
            // Switch players
            currentPlayer = currentPlayer === player1 ? player2 : player1;
            updateHoverEffect(); // Update hover effect after switching player
        }
    };

    const renderBoard = () => {
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            // Clear previous content
            cell.classList.remove('x', 'o'); // Clear previous marks
            if (gameBoard.getBoard()[index]) {
                cell.classList.add(gameBoard.getBoard()[index]); // Add the corresponding class for the mark
            }
        });
    };

    const displayWinner = (winnerName) => {
        // Display the winning message
        const winningMessageDiv = document.getElementById('winning-message');
        const winningMessageText = document.getElementById('winning-message-text');

        winningMessageText.textContent = `${winnerName} Wins!`;
        winningMessageDiv.classList.add('show'); // Show the winning message
    };

    const resetGame = () => {
        isGameOver = false;
        gameBoard.resetBoard();
        renderBoard();
        document.getElementById('winning-message').classList.remove('show'); // Hide the winning message
        currentPlayer = player1;
        updateHoverEffect();
    };

    const checkWinner = () => {
        const board = gameBoard.getBoard();
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        return winConditions.some(condition => {
            const [a, b, c] = condition;
            return board[a] && board[a] === board[b] && board[a] === board[c];
        });
    };

    const updateHoverEffect = () => {
        const gameBoardDiv = document.querySelector('.game');
        gameBoardDiv.classList.remove('x', 'o'); // Remove both hover effects
        gameBoardDiv.classList.add(currentPlayer.mark); // Add current player's hover effect
    };

    // Attach event listeners to cells and restart button
    const attachListeners = () => {
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            cell.addEventListener('click', () => handleClick(index));
        });

        const restartButton = document.getElementById('restartButton');
        restartButton.addEventListener('click', resetGame);
    };

    return {
        startGame,
        attachListeners
    };
})();

window.onload = () => {
    displayController.attachListeners(); // Attach event listeners to cells and restart button
};
