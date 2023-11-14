// Function to select a single element using a CSS selector
const $ = selector => document.querySelector(selector);

// Function to select multiple elements using a CSS selector
const _ = selector => document.querySelectorAll(selector);

document.addEventListener("DOMContentLoaded", () => {
    // DOM elements
    let easy = $("#easy");
    let medium = $("#medium");
    let hard = $("#hard");
    let start = $("#start");
    let playArea = $("#buttonGrid");
    let selections = $("#selections");

    // Variables for mines and grid size
    var mines = 0;
    var size = 0;

    // Variable for seconds for timer
    var seconds = 0;

    // Variable for counting the number of tiles revealed
    var numberOfTilesRevealed = 0;

    // Function to generate an array representing the game board
    const generateArray = () => {
        let boardArray = [];

        // Populate the array with mines
        for (let i = 0; i < mines; i++) {
            boardArray.push(-1);
        }

        // Populate the remaining slots with zeros
        for (let i = 0; i < size - mines; i++) {
            boardArray.push(0);
        }

        // Shuffle the array
        for (let i = boardArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [boardArray[i], boardArray[j]] = [boardArray[j], boardArray[i]];
        }

        return boardArray;
    }

    const winConditionCheck = () => {
        if (numberOfTilesRevealed === (size - mines)) {
            winGame();
        }
    }

    // Event handler for button clicks
    const buttonClickHandler = (evt) => {
        // Check if the clicked button is a mine
        if (evt.target.value === '-1' && !evt.target.classList.contains('flagged')) {
            alert("You clicked a mine, you lose!");
            evt.target.textContent = '💣';
            lostGame();
        } else if (evt.target.value !== '-1' && !evt.target.classList.contains('flagged')) {
            // Check if the clicked button has a value other than zero or mine
            if (evt.target.value !== '0' && evt.target.value !== '-1') {
                evt.target.textContent = evt.target.value;
                numberOfTilesRevealed++;
                console.log(`buttonClickHandler ${numberOfTilesRevealed}`);
                winConditionCheck();
            } else {
                revealZeros(evt.target);
            }
        }
    }

// Function to reveal zeros and their adjacent zeros using recursion
const revealZeros = (button) => {
    if (button.value === '0' && !button.classList.contains('revealed')) {
        button.textContent = ''; // Clear the content for zero values
        button.style.backgroundColor = "#C0C0C0"; // Fix the syntax here
        button.classList.add('revealed');
        numberOfTilesRevealed++;
        console.log(`revealZeros ${numberOfTilesRevealed}`);
        winConditionCheck();

        // Get the coordinates of the clicked button
        const coords = button.className.split(",");
        const col = parseInt(coords[0]);
        const row = parseInt(coords[1]);

        // Loop through adjacent buttons
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) {
                    continue;
                }
                const newCol = col + dx;
                const newRow = row + dy;

                // Skip invalid coordinates
                if (newCol < 1 || newRow < 1 || newCol > Math.sqrt(size) || newRow > Math.sqrt(size)) {
                    continue;
                }

                // Get the adjacent button
                const adjacentButton = document.getElementsByClassName(`${newCol},${newRow}`)[0];

                // Recursively reveal zeros for adjacent buttons
                revealZeros(adjacentButton);
            }
        }
    } else if (button.value > 0 && !button.classList.contains('revealed')) {
        // Display the number for non-zero values
        button.textContent = button.value;
        button.classList.add('revealed');
        numberOfTilesRevealed++;
        console.log(`revealZeros number tile ${numberOfTilesRevealed}`);
        winConditionCheck();
    }
}


    const flagATile = (evt) => {
        if (!evt.target.classList.contains('revealed') || !evt.target.classList.contains('flagged')) {
            evt.target.textContent = '🚩';
            evt.target.classList.add('flagged');
            winConditionCheck();

        }
    }

    // Function to display numbers on the grid
    const displayNumbersOnGrid = () => {
        const buttons = document.querySelectorAll("#buttonGrid button");

        for (let i = 0; i < buttons.length; i++) {
            let coords = buttons[i].className.split(",");
            let col = parseInt(coords[0]);
            let row = parseInt(coords[1]);
            var adjacentMines = 0;

            if (buttons[i].value !== -1) {
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        if (dx === 0 && dy === 0) {
                            continue;
                        }
                        let newCol = col + dx;
                        let newRow = row + dy;

                        // Skip invalid coordinates
                        if (newCol < 1 || newRow < 1 || newCol > Math.sqrt(buttons.length) || newRow > Math.sqrt(buttons.length)) {
                            continue;
                        }

                        // Get the adjacent button
                        let adjacentButton = document.getElementsByClassName(`${newCol},${newRow}`)[0];

                        // Check if the adjacent button is a mine
                        if (adjacentButton.value === '-1') {
                            adjacentMines++;
                        }
                    }
                }
                // buttons[i].textContent = '?';
                if (buttons[i].value !== '-1') {
                    buttons[i].value = adjacentMines;
                } else {
                    buttons[i].value = '-1';
                }
            }
        }
    };

    // Function to display the grid based on the generated array
    const displayGrid = (array) => {
        for (i = 0; i < Math.sqrt(size); i++) {
            for (j = 0; j < Math.sqrt(size); j++) {
                const tile = document.createElement("button");
                const index = (i) * Math.sqrt(size) + (j);
                tile.style.width = "50px";
                tile.style.height = "50px";
                tile.value = array[index];
                // tile.textContent = array[index];
                tile.className = `${i + 1},${j + 1}`;
                tile.addEventListener("click", buttonClickHandler);
                tile.addEventListener('contextmenu', (event) => {
                    flagATile(event); // Pass the event to flagATile function
                    event.preventDefault();
                });
                playArea.appendChild(tile);
            }
            playArea.appendChild(document.createElement("br"));
        }
    }

    const resetTimer = () => {
        seconds = 0;
        $("#timerText").textContent = "";
    }

    // Function to hide the div for selections
    const hideSelections = () => {
        selections.setAttribute("hidden", "true");
    }

    // Function to show the div for selections
    const showSelections = () => {
        selections.removeAttribute("hidden");
    }

    // Function to reset the game
    const resetGame = () => {
        // Reset any game-related variables or states
        mines = 0;
        size = 0;
        numberOfTilesRevealed = 0;

        // Remove existing buttons and Reset button
        playArea.innerHTML = "";
        $("#win-lose").innerHTML = "";
        showSelections();
        resetTimer();
    }

    // Function to display reset button on game loss
    const lostGame = () => {
        playArea.innerHTML = "";
        const resetBtn = document.createElement("button");
        resetBtn.style.width = "160px";
        resetBtn.style.height = "75px";
        resetBtn.textContent = "Reset Game";
        resetBtn.addEventListener("click", resetGame);
        $("#win-lose").appendChild(resetBtn);
        clearInterval(intervalId);
        numberOfTilesRevealed = 0;
    }

    const winGame = () => {
        playArea.innerHTML = "";
        const resetBtn = document.createElement("button");
        resetBtn.style.width = "160px";
        resetBtn.style.height = "75px";
        resetBtn.textContent = "Reset Game";
        resetBtn.addEventListener("click", resetGame);
        $("#win-lose").appendChild(resetBtn);
        alert("You win!");
        numberOfTilesRevealed = 0;
        clearInterval(intervalId);
    }

    // Function to start the game
    const startGame = () => {
        const array = generateArray();
        displayGrid(array);
        displayNumbersOnGrid();
        hideSelections();

        intervalId = setInterval(() => {
            seconds++;
            // Calculate minutes and remaining seconds
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            // Display the timer in the format MM:SS
            $("#timerText").textContent = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
          }, 1000);
    }

    // Event listeners for difficulty buttons
    easy.addEventListener("click", () => { mines = 10; size = 81; });
    medium.addEventListener("click", () => { mines = 40; size = 256; });
    hard.addEventListener("click", () => { mines = 99; size = 484; });

    // Event listener for the start button
    start.addEventListener("click", startGame);
});
