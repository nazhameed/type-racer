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
let currentText = '';

// Best results storage
let bestResults = {
    easy: 0,
    medium: 0,
    difficult: 0
};

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
    
    // Store the current text
    currentText = newText;
    
    // For simple display without highlighting, just use textContent
    document.querySelector('.prompt-text').textContent = newText;
    
    // Capitalize the difficulty for display
    let displayDifficulty = '-';
    if (difficulty !== 'Choose...') {
        displayDifficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    }
    
    document.getElementById('levelResult').textContent = displayDifficulty;
}

// Prepare text for highlighting (called when test starts)
function prepareTextForHighlighting() {
    const promptElement = document.querySelector('.prompt-text');
    const text = currentText;
    
    // Split text into words and wrap each in a span for highlighting
    const words = text.split(' ');
    const wrappedText = words.map(word => 
        `<span class="word">${word}</span>`
    ).join(' ');
    
    promptElement.innerHTML = wrappedText;
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
    
    // Start the actual test
    beginTest();
}

// Begin the actual test (shared logic)
function beginTest() {
    prepareTextForHighlighting();
    document.getElementById('timeResult').textContent = '0s';
    document.getElementById('wpmResult').textContent = '0';
    
    // Start the timer
    startTime = Date.now();
    testRunning = true;
    timer = setInterval(updateTimer, 100);
}

// Auto-start test when user begins typing
function handleTypingStart() {
    // If test is not running and user starts typing, start the test
    if (!testRunning) {
        const difficulty = document.getElementById('difficultySelect').value;
        
        if (difficulty === 'Choose...') {
            alert('Please select a difficulty level first!');
            document.getElementById('typingInput').value = '';
            return;
        }
        
        // Start the actual test
        beginTest();
    }
    
    // Continue with normal typing feedback
    checkTyping();
}

// Handle Enter key press to stop test
function handleKeyPress(event) {
    // Check if Enter key was pressed and test is running
    if (event.key === 'Enter' && testRunning) {
        event.preventDefault(); // Prevent new line in textarea
        stopTest();
    }
}

// Stop the typing test
function stopTest() {
    testRunning = false;
    clearInterval(timer);
    document.getElementById('typingInput').disabled = true;
    
    // Always try to calculate WPM (calculateWPM will handle empty input)
    calculateWPM();
    
    // Reset text display to original format (but keep same text)
    document.querySelector('.prompt-text').textContent = currentText;
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
    
    // Only calculate if user typed meaningful content (more than just spaces)
    if (typed.length === 0) return;
    
    const words = typed.split(' ').length;
    const wpm = Math.round(words / elapsed);
    
    document.getElementById('wpmResult').textContent = wpm;
    
    // Check if this is a new best result
    checkAndUpdateBestResult(wpm);
}

// Check if current WPM is a new best result and update if so
function checkAndUpdateBestResult(wpm) {
    const difficulty = document.getElementById('difficultySelect').value;
    
    // Only update if we have a valid difficulty and WPM is better than current best
    if (difficulty !== 'Choose...' && wpm > bestResults[difficulty]) {
        bestResults[difficulty] = wpm;
        saveBestResults();
        updateBestResultsDisplay();
        
        // Show congratulations message
        setTimeout(() => {
            alert(`New best result for ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}: ${wpm} WPM!`);
        }, 500);
    }
}

// Save best results to localStorage
function saveBestResults() {
    localStorage.setItem('typeRacerBestResults', JSON.stringify(bestResults));
}

// Load best results from localStorage
function loadBestResults() {
    const saved = localStorage.getItem('typeRacerBestResults');
    if (saved) {
        bestResults = JSON.parse(saved);
    }
    updateBestResultsDisplay();
}

// Update the best results display
function updateBestResultsDisplay() {
    document.getElementById('bestEasy').textContent = bestResults.easy > 0 ? bestResults.easy + ' WPM' : '-';
    document.getElementById('bestMedium').textContent = bestResults.medium > 0 ? bestResults.medium + ' WPM' : '-';
    document.getElementById('bestDifficult').textContent = bestResults.difficult > 0 ? bestResults.difficult + ' WPM' : '-';
}

// Check typing progress and provide real-time feedback
function checkTyping() {
    if (!testRunning) return;
    
    const typed = document.getElementById('typingInput').value;
    const originalText = currentText; // Use stored text instead of getting from element
    
    // Check if finished
    if (typed === originalText) {
        stopTest();
        alert('Great job! You finished the test!');
        return;
    }
    
    // Update word highlighting
    const typedWords = typed.split(' ');
    const targetWords = originalText.split(' ');
    const wordSpans = document.querySelectorAll('.prompt-text .word');
    
    // Reset and update each word
    wordSpans.forEach((span, index) => {
        span.className = 'word';
        
        if (index < typedWords.length) {
            const typedWord = typedWords[index];
            const targetWord = targetWords[index];
            
            if (typedWord === targetWord) {
                span.classList.add('correct');
            } else {
                span.classList.add('incorrect');
            }
        }
    });
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
        setTimeout(() => {
            updateText(); // Get new text
            document.getElementById('typingInput').value = '';
            document.getElementById('typingInput').disabled = false;
            // Reset results display
            document.getElementById('timeResult').textContent = '0s';
            document.getElementById('wpmResult').textContent = '0';
            document.getElementById('typingInput').focus();
        }, 100);
    });
    
    // Auto-start test when user begins typing
    document.getElementById('typingInput').addEventListener('input', handleTypingStart);
    
    // Stop test when user presses Enter key
    document.getElementById('typingInput').addEventListener('keydown', handleKeyPress);
    
    // Set initial text and enable typing area
    updateText();
    document.getElementById('typingInput').disabled = false;
    
    // Load best results from localStorage
    loadBestResults();
});
