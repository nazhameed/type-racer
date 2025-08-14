// Simple Type Racer JavaScript

// Text samples for different difficulties
const texts = {
    easy: [
        "The cat sat on the mat. The dog ran in the park. The sun is bright today.",
        "I like to read books. The car is red. The house has a blue door.",
        "The sky is blue. Fish swim in the water. The grass is green.",
        "Mom bakes cookies. Dad drives the car. The flower smells nice.",
        "The ball is round. The box is square. The tree is tall."
    ],
    medium: [
        "The quick brown fox jumps over the lazy dog. Technology advances rapidly in our modern world.",
        "Sustainable energy sources are becoming increasingly important for environmental protection.",
        "Communication skills are essential for building strong relationships and achieving professional goals.",
        "Artificial intelligence is transforming industries and changing how we work and live.",
        "Global cooperation is necessary to address challenges like poverty and disease."
    ],
    difficult: [
        "The philosophical implications of quantum mechanics continue to perplex scientists and philosophers alike.",
        "Neuroplasticity research demonstrates the brain's remarkable capacity for adaptation and reorganization throughout life.",
        "Macroeconomic policies must carefully balance inflation control, employment stability, and sustainable growth.",
        "Constitutional jurisprudence involves intricate interpretation of legal precedents and balancing individual rights.",
        "Bioethical considerations surrounding genetic engineering require careful deliberation about autonomy and justice."
    ]
};

// Variables to track the test
let startTime = null;
let timer = null;
let testRunning = false;

// Get random text based on difficulty
function getRandomText(difficulty) {
    if (difficulty === 'Choose...') {
        return "Please select a difficulty level to start the test.";
    }
    const textArray = texts[difficulty];
    const randomIndex = Math.floor(Math.random() * textArray.length);
    return textArray[randomIndex];
}

// Update the text when difficulty changes
function updateText() {
    const difficulty = document.getElementById('difficultySelect').value;
    const newText = getRandomText(difficulty);
    
    document.querySelector('.prompt-text').textContent = newText;
    document.getElementById('levelResult').textContent = 
        difficulty === 'Choose...' ? '-' : difficulty;
}

// Start the typing test
function startTest() {
    const difficulty = document.getElementById('difficultySelect').value;
    
    if (difficulty === 'Choose...') {
        alert('Please select a difficulty level first!');
        return;
    }
    
    // Get new text and reset everything
    updateText();
    document.getElementById('typingInput').value = '';
    document.getElementById('typingInput').disabled = false;
    document.getElementById('typingInput').focus();
    document.getElementById('timeResult').textContent = '0s';
    document.getElementById('wpmResult').textContent = '0';
    
    // Start the timer
    startTime = Date.now();
    testRunning = true;
    timer = setInterval(updateTimer, 100);
}

// Stop the typing test
function stopTest() {
    testRunning = false;
    clearInterval(timer);
    document.getElementById('typingInput').disabled = true;
    calculateWPM();
}

// Update the timer display
function updateTimer() {
    if (!testRunning) return;
    
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('timeResult').textContent = elapsed + 's';
}

// Calculate words per minute
function calculateWPM() {
    if (!startTime) return;
    
    const elapsed = (Date.now() - startTime) / 60000; // minutes
    const typed = document.getElementById('typingInput').value.trim();
    const words = typed.split(' ').length;
    const wpm = Math.round(words / elapsed);
    
    document.getElementById('wpmResult').textContent = wpm;
}

// Check if user finished typing
function checkIfDone() {
    if (!testRunning) return;
    
    const typed = document.getElementById('typingInput').value;
    const target = document.querySelector('.prompt-text').textContent;
    
    if (typed === target) {
        stopTest();
        alert('Great job! You finished the test!');
    }
}

// When page loads, set up everything
document.addEventListener('DOMContentLoaded', function() {
    // When difficulty changes, update text
    document.getElementById('difficultySelect').addEventListener('change', updateText);
    
    // Button clicks
    document.getElementById('startBtn').addEventListener('click', startTest);
    document.getElementById('stopBtn').addEventListener('click', stopTest);
    document.getElementById('retryBtn').addEventListener('click', function() {
        stopTest();
        setTimeout(startTest, 100);
    });
    
    // Check if done while typing
    document.getElementById('typingInput').addEventListener('input', checkIfDone);
    
    // Set initial text
    updateText();
});
