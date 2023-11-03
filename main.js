const $ = selector => document.querySelector(selector);
const _ = selector => document.querySelectorAll(selector);

document.addEventListener("DOMContentLoaded", () => {
    let easy = $("#easy");
    let medium = $("#medium");
    let hard = $("#hard");

    const displayGrid = (difficulty) => {
        let mines = 0;
        let size = 0;

        if(difficulty === "easy") {
            mines = 10;
            size = 81;
        } else if (difficulty === "medium") {
            mines = 40;
            size = 256;
        } else if (difficulty === "hard") {
            mines = 99;
            size = 484;
        }
    }

    easy.addEventListener("click", displayGrid("easy"));
    medium.addEventListener("click", displayGrid("medium"));
    hard.addEventListener("click", displayGrid("hard"));
})