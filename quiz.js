function checkQuiz(event) {
    if (event) event.preventDefault();

    const quizForm = document.getElementById("quiz");
    const resultDisplay = document.getElementById("quiz-result");
    const questions = ['q1', 'q2', 'q3', 'q4', 'q5'];
    let score = 0;

    questions.forEach(qName => {
        const selected = quizForm.querySelector(`input[name="${qName}"]:checked`);
        if (selected) {
            score += parseInt(selected.value);
        }
    });

    if (resultDisplay) {
        resultDisplay.textContent = `You scored ${score}/${questions.length}!`;
        resultDisplay.style.display = 'block';
    }
}

// Add listeners
document.addEventListener('DOMContentLoaded', () => {
    const quizForm = document.getElementById("quiz");
    if (quizForm) {
        quizForm.addEventListener('submit', checkQuiz);
    }
});