const $ = selector => document.querySelector(selector);
const _ = selector => document.querySelectorAll(selector);

document.addEventListener("DOMContentLoaded", () => {
    let easy = $("#easy");
    let medium = $("#medium");
    let hard = $("#hard");
    let start = $("#start");
    let playArea = $("#buttonGrid");
    var mines = 0;
    var size = 0;

    const generateArray = () => {
        let boardArray = [];
        for (let i = 0; i < mines; i++) {
            boardArray.push(-1);
        }
        for (let i = 0; i < size; i++) {
            boardArray.push(0);
        }
        for (let i = boardArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [boardArray[i], boardArray[j]] = [boardArray[j], boardArray[i]];
        }
        return boardArray;
    }

    const buttonClickHandler = (evt) => {
        alert(evt.target.value);
    }

    const displayNumbersOnGrid = () => {
        const buttons = document.querySelectorAll("button");
    
        for (let i = 0; i < buttons.length; i++) {
            const value = parseInt(buttons[i].dataset.value);
    
            if (value === 0) {
                let adjacentMines = 0;
                const [row, col] = buttons[i].className.split(" ").map(Number);
    
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        const newRow = row + dx;
                        const newCol = col + dy;
    
                        if (newRow >= 1 && newRow <= Math.sqrt(size) && newCol >= 1 && newCol <= Math.sqrt(size)) {
                            const adjacentIndex = (newRow - 1) * Math.sqrt(size) + (newCol - 1);
                            const adjacentButton = buttons[adjacentIndex];
                            if (parseInt(adjacentButton.dataset.value) === -1) {
                                adjacentMines++;
                            }
                        }
                    }
                }
                if (adjacentMines > 0) {
                    buttons[i].value = adjacentMines;
                    buttons[i].textContent = buttons[i].value;
                }
            }
        }
    };
    
    const displayGrid = (array) => {
        for(i = 0; i <= Math.sqrt(size); i++) {
            for(j = 0; j <= Math.sqrt(size); j++) {
                const tile = document.createElement("button");
                const index = (i - 1) * Math.sqrt(size) + (j - 1); 
                tile.style.width = "40px";
                tile.style.height = "40px";
                tile.dataset.value = array[index];
                tile.className = [i + 1, j + 1].join(" ");
                tile.addEventListener("click", buttonClickHandler);
                playArea.appendChild(tile);
            }
            playArea.appendChild(document.createElement("br"));
        }
    }

    easy.addEventListener("click", () => {mines = 10; size = 81;});
    medium.addEventListener("click", () => {mines = 40; size = 256;});
    hard.addEventListener("click", () => {mines = 99; size = 484;});

    start.addEventListener("click", () => {
        const array = generateArray();
        displayGrid(array);
        displayNumbersOnGrid();
    });
})