const sentenceElement = document.getElementById("sentence");
const sentence = sentenceElement.textContent;
const keyboardKeys = document.querySelectorAll(".key");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");

let typedText = "";
let correctChars = 0;
let totalChars = 0;
let startTime;

const correctSound = new Audio("correct-sound.mp3"); // Add a correct sound file
const errorSound = new Audio("error-sound.mp3"); // Add an error sound file

// Mapping for keys that require Shift to type
const shiftKeyMapping = {
    "~": "`",
    "!": "1",
    "@": "2",
    "#": "3",
    "$": "4",
    "%": "5",
    "^": "6",
    "&": "7",
    "*": "8",
    "(": "9",
    ")": "0",
    "_": "-",
    "+": "=",
    "{": "[",
    "}": "]",
    "|": "\\",
    ":": ";",
    '"': "'",
    "<": ",",
    ">": ".",
    "?": "/"
};

// Update the sentence with highlights
function updateSentenceDisplay() {
    sentenceElement.innerHTML = sentence.split("").map((char, index) => {
        const typedChar = typedText[index];
        if (typedChar === undefined) {
            if (index === typedText.length) {
                return `<span class="highlight">${char}</span>`;
            } else {
                return `<span>${char}</span>`;
            }
        } else if (typedChar === char) {
            return `<span class="correct">${char}</span>`;
        } else {
            return `<span class="incorrect">${char}</span>`;
        }
    }).join("");
}

// Highlight the next key to press
function updateKeyboardHighlight() {
    keyboardKeys.forEach((key) => {
        key.classList.remove("active", "error", "highlight");
    });

    const nextChar = sentence[typedText.length];
    if (!nextChar) return; // If the sentence is fully typed, stop highlighting

    const isUpperCase = nextChar === nextChar.toUpperCase() && nextChar !== nextChar.toLowerCase();
    const isSymbol = shiftKeyMapping[nextChar] !== undefined;

    if (isUpperCase || isSymbol) {
        // Highlight Shift key
        keyboardKeys.forEach((key) => {
            if (key.textContent.trim().toLowerCase() === "shift") {
                key.classList.add("highlight");
            }
        });
    }

    let keyToHighlight = nextChar.toLowerCase();
    if (isSymbol) {
        keyToHighlight = shiftKeyMapping[nextChar];
    }

    keyboardKeys.forEach((key) => {
        const keyText = key.textContent.trim().toLowerCase();
        if (keyText === keyToHighlight || (nextChar === " " && keyText === "space")) {
            key.classList.add("highlight");
        }
    });
}

// Calculate and display typing speed and accuracy
function calculateStats() {
    const elapsedTime = (new Date().getTime() - startTime) / 1000 / 60; // Time in minutes
    const wpm = Math.round((correctChars / 5) / elapsedTime);
    const accuracy = Math.round((correctChars / totalChars) * 100);
    wpmDisplay.textContent = wpm;
    accuracyDisplay.textContent = accuracy + "%";
}

// Handle key presses
function handleKeyPress(event) {
    const keyPressed = event.key;
    const expectedChar = sentence[typedText.length];

    // Ignore functional keys like Ctrl, Alt, etc.
    if (event.key === "Shift" || event.key === "CapsLock" || event.key === "Alt" || event.key === "Control") {
        return;
    }

    if (!startTime) {
        startTime = new Date().getTime();
    }

    if (keyPressed === expectedChar) {
        correctChars++;
        typedText += keyPressed;
        correctSound.play();
    } else if (keyPressed === "Backspace") {
        typedText = typedText.slice(0, -1);
    } else if (keyPressed === " ") {
        if (expectedChar === " ") {
            correctChars++;
        }
        typedText += " ";
    } else {
        typedText += keyPressed;
        errorSound.play();
    }

    totalChars++;

    updateSentenceDisplay();
    updateKeyboardHighlight();
    calculateStats();
}

// Attach listeners
document.addEventListener("keydown", handleKeyPress);
updateSentenceDisplay();
updateKeyboardHighlight();
