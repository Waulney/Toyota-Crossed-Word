// 20 Niveaux automobiles dédiés à Toyota (Modèles, Logiciels, Matériels, Équipements, Jargon) adaptés pour une grille 10x10
const LEVELS = [
    { title: "Level 1: Iconic Sedans", words: ["CAMRY", "COROLLA", "AVALON", "PRIUS", "YARIS"] },
    { title: "Level 2: SUVs & Crossovers", words: ["RAV4", "HIGHLANDER", "4RUNNER", "SEQUOIA", "VENZA"] },
    { title: "Level 3: Tough Trucks", words: ["TACOMA", "TUNDRA", "HILUX", "FRAME", "BED"] },
    { title: "Level 4: Under the Hood (Hardware)", words: ["MOTOR", "PISTON", "VALVE", "TURBO", "BATTERY"] },
    { title: "Level 5: Powertrain & Transmission", words: ["GEAR", "AXLE", "CLUTCH", "HYBRID", "DRIVE"] },
    { title: "Level 6: Wheels & Brakes", words: ["WHEEL", "TIRE", "BRAKE", "ROTOR", "ABS"] },
    { title: "Level 7: Software & Infotainment", words: ["SCREEN", "AUDIO", "MAPS", "SYNC", "APP"] },
    { title: "Level 8: Safety & Sensors", words: ["SENSE", "RADAR", "CAMERA", "BEAM", "ALERT"] },
    { title: "Level 9: Interior Comfort", words: ["SEAT", "CABIN", "PEDAL", "STEER", "CLIMATE"] },
    { title: "Level 10: Exterior Elements", words: ["PAINT", "DOOR", "GLASS", "LIGHT", "GRILLE"] },
    { title: "Level 11: Performance & Handling", words: ["SPORT", "SPEED", "TRACK", "GRIP", "POWER"] },
    { title: "Level 12: Electric & Future Tech", words: ["EV", "CELL", "PLUG", "CHARGE", "VOLT"] },
    { title: "Level 13: Maintenance & Service", words: ["OIL", "FILTER", "WIPER", "SPARK", "FLUID"] },
    { title: "Level 14: Gaz Acquisition & Fuel", words: ["GAS", "DIESEL", "TANK", "PUMP", "OCTANE"] },
    { title: "Level 15: Lighting & Visibility", words: ["LED", "BULB", "BEAM", "LAMP", "VISION"] },
    { title: "Level 16: Steering & Suspension", words: ["SHOCK", "SPRING", "RACK", "STRUT", "JOINT"] },
    { title: "Level 17: Racing & TRD", words: ["TRD", "RACE", "RALLY", "TEAM", "WIN"] },
    { title: "Level 18: Quality & Manufacturing", words: ["LEAN", "BUILD", "TEST", "PART", "PLANT"] },
    { title: "Level 19: Accessories & Gear", words: ["MAT", "RACK", "HITCH", "TOW", "BOX"] },
    { title: "Level 20: Ultimate Toyota", words: ["TOYOTA", "LEGEND", "FUTURE", "DRIVE", "ROAD"] }
];

let currentLevelIndex = 0;
let grid = [];
let placedWords = [];
let foundWords = new Set();
let selectedCells = [];
let isInteracting = false;
let startCell = null;

const GRID_SIZE = 10;

document.addEventListener('DOMContentLoaded', () => {
    initLevel(currentLevelIndex);

    document.getElementById('themeToggleBtn').addEventListener('click', () => {
        document.body.classList.toggle('theme-dark');
        const btn = document.getElementById('themeToggleBtn');
        btn.innerText = document.body.classList.contains('theme-dark') ? '☀️' : '🌙';
    });

    document.getElementById('nextLevelBtn').addEventListener('click', () => {
        document.getElementById('levelModal').classList.add('hidden');
        currentLevelIndex++;
        if (currentLevelIndex >= LEVELS.length) {
            currentLevelIndex = 0;
        }
        initLevel(currentLevelIndex);
    });

    window.addEventListener('mouseup', endSelection);
    window.addEventListener('touchend', endSelection);
});

function initLevel(levelIdx) {
    const levelData = LEVELS[levelIdx];
    
    document.getElementById('levelDisplay').innerText = `Level ${levelIdx + 1} / ${LEVELS.length}`;
    document.getElementById('levelThemeTitle').innerText = levelData.title;
    
    foundWords.clear();
    generateGrid(levelData.words);
    renderWordList(levelData.words);
    renderGrid();
}

function generateGrid(words) {
    grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
    placedWords = [];

    words.forEach(word => {
        let placed = false;
        let attempts = 0;
        const cleanWord = word.replace(/[^A-Z]/g, '');

        while (!placed && attempts < 100) {
            attempts++;
            const direction = Math.floor(Math.random() * 3); // 0: Horizontal, 1: Vertical, 2: Diagonal
            let row = Math.floor(Math.random() * GRID_SIZE);
            let col = Math.floor(Math.random() * GRID_SIZE);

            if (canPlaceWord(cleanWord, row, col, direction)) {
                placeWord(cleanWord, row, col, direction);
                placedWords.push({ word: cleanWord, coords: getWordCoords(cleanWord, row, col, direction) });
                placed = true;
            }
        }
    });

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (grid[r][c] === '') {
                grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
            }
        }
    }
}

function canPlaceWord(word, row, col, dir) {
    const len = word.length;
    if (dir === 0 && col + len > GRID_SIZE) return false;
    if (dir === 1 && row + len > GRID_SIZE) return false;
    if (dir === 2 && (col + len > GRID_SIZE || row + len > GRID_SIZE)) return false;

    for (let i = 0; i < len; i++) {
        let r = row + (dir === 1 || dir === 2 ? i : 0);
        let c = col + (dir === 0 || dir === 2 ? i : 0);
        if (grid[r][c] !== '' && grid[r][c] !== word[i]) {
            return false;
        }
    }
    return true;
}

function placeWord(word, row, col, dir) {
    for (let i = 0; i < word.length; i++) {
        let r = row + (dir === 1 || dir === 2 ? i : 0);
        let c = col + (dir === 0 || dir === 2 ? i : 0);
        grid[r][c] = word[i];
    }
}

function getWordCoords(word, row, col, dir) {
    let coords = [];
    for (let i = 0; i < word.length; i++) {
        let r = row + (dir === 1 || dir === 2 ? i : 0);
        let c = col + (dir === 0 || dir === 2 ? i : 0);
        coords.push(`${r}-${c}`);
    }
    return coords;
}

function renderGrid() {
    const container = document.getElementById('gridContainer');
    container.innerHTML = '';

    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.innerText = grid[r][c];

            // Événements unifiés Souris et Tactile fluides avec verrouillage de trajectoire linéaire
            cell.addEventListener('mousedown', (e) => { e.preventDefault(); startSelection(r, c); });
            cell.addEventListener('mouseenter', () => { if (isInteracting) updateSelection(r, c); });

            cell.addEventListener('touchstart', (e) => {
                e.preventDefault();
                startSelection(r, c);
            }, { passive: false });

            cell.addEventListener('touchmove', (e) => {
                e.preventDefault();
                if (!isInteracting) return;
                const touch = e.touches[0];
                const target = document.elementFromPoint(touch.clientX, touch.clientY);
                if (target && target.classList.contains('grid-cell')) {
                    updateSelection(parseInt(target.dataset.row), parseInt(target.dataset.col));
                }
            }, { passive: false });

            container.appendChild(cell);
        }
    }
}

function renderWordList(words) {
    const container = document.getElementById('wordList');
    container.innerHTML = '';
    words.forEach(word => {
        const chip = document.createElement('div');
        chip.classList.add('word-chip');
        chip.id = `chip-${word}`;
        chip.innerText = word;
        container.appendChild(chip);
    });
    document.getElementById('scoreDisplay').innerText = `Words found: 0 / ${words.length}`;
}

function startSelection(r, c) {
    isInteracting = true;
    startCell = { r, c };
    selectedCells = [`${r}-${c}`];
    updateCellStyles();
}

function updateSelection(r, c) {
    if (!isInteracting || !startCell) return;

    let dr = r - startCell.r;
    let dc = c - startCell.c;
    
    let steps = Math.max(Math.abs(dr), Math.abs(dc));
    if (steps === 0) {
        selectedCells = [`${startCell.r}-${startCell.c}`];
        updateCellStyles();
        return;
    }

    let stepR = dr === 0 ? 0 : dr / steps;
    let stepC = dc === 0 ? 0 : dc / steps;

    if (Math.abs(stepR) !== Math.abs(stepC) && stepR !== 0 && stepC !== 0) {
        return;
    }

    selectedCells = [];
    for (let i = 0; i <= steps; i++) {
        let currR = Math.round(startCell.r + (i * stepR));
        let currC = Math.round(startCell.c + (i * stepC));
        selectedCells.push(`${currR}-${currC}`);
    }

    updateCellStyles();
}

function endSelection() {
    if (!isInteracting) return;
    isInteracting = false;
    startCell = null;

    let formedWord = selectedCells.map(key => {
        const [r, c] = key.split('-').map(Number);
        return grid[r][c];
    }).join('');

    const currentWords = LEVELS[currentLevelIndex].words;
    let matched = placedWords.find(pw => pw.word === formedWord || pw.word === formedWord.split('').reverse().join(''));

    if (matched && currentWords.includes(matched.word) && !foundWords.has(matched.word)) {
        foundWords.add(matched.word);
        
        selectedCells.forEach(key => {
            const cell = document.querySelector(`[data-row='${key.split('-')[0]}'][data-col='${key.split('-')[1]}']`);
            if (cell) cell.classList.add('found');
        });

        const chip = document.getElementById(`chip-${matched.word}`);
        if (chip) chip.classList.add('found');

        document.getElementById('scoreDisplay').innerText = `Words found: ${foundWords.size} / ${currentWords.length}`;

        if (foundWords.size === currentWords.length) {
            setTimeout(showLevelModal, 400);
        }
    }

    selectedCells = [];
    updateCellStyles();
}

function updateCellStyles() {
    document.querySelectorAll('.grid-cell').forEach(cell => {
        const key = `${cell.dataset.row}-${cell.dataset.col}`;
        if (selectedCells.includes(key)) {
            cell.classList.add('selected');
        } else {
            cell.classList.remove('selected');
        }
    });
}

function showLevelModal() {
    const modal = document.getElementById('levelModal');
    
    if (currentLevelIndex === LEVELS.length - 1) {
        document.getElementById('modalTitle').innerText = "All Levels Completed! 🏆";
        document.getElementById('modalDesc').innerText = "Congratulations, you've mastered all 20 Toyota levels!";
        document.getElementById('nextLevelBtn').innerText = "Play Again from Start";
    } else {
        document.getElementById('modalTitle').innerText = "Level Passed! 🏁";
        document.getElementById('modalDesc').innerText = "Ready for the next gear?";
        document.getElementById('nextLevelBtn').innerText = "Next Level";
    }
    modal.classList.remove('hidden');
}