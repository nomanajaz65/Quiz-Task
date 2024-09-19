const quizData = [
    {
        question: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Lisbon"],
        answer: "Paris"
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Saturn"],
        answer: "Mars"
    },
    {
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        answer: "Pacific Ocean"
    },
];

const storedQuizData = localStorage.getItem('quizData');
const dataToUse = storedQuizData ? JSON.parse(storedQuizData) : quizData;

localStorage.setItem('quizData', JSON.stringify(dataToUse));

class Quiz {
    constructor(quizData) {
        this.quizData = quizData;
        this.currentQuestionIndex = 0;
        this.score = 0;
    }

    getCurrentQuestion() {
        return this.quizData[this.currentQuestionIndex];
    }

    nextQuestion(answer) {
        if (answer === this.getCurrentQuestion().answer) {
            this.score++;
        }
        this.currentQuestionIndex++;
        this.saveProgress();
    }

    isFinished() {
        return this.currentQuestionIndex >= this.quizData.length;
    }

    saveProgress() {
        const progress = {
            currentQuestionIndex: this.currentQuestionIndex,
            score: this.score,
        };
        localStorage.setItem('quizProgress', JSON.stringify(progress));
    }

    loadProgress() {
        const storedProgress = localStorage.getItem('quizProgress');
        if (storedProgress) {
            const { currentQuestionIndex, score } = JSON.parse(storedProgress);
            this.currentQuestionIndex = currentQuestionIndex;
            this.score = score;
        }
    }

    reset() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        localStorage.removeItem('quizProgress'); 
    }
}

const quiz = new Quiz(dataToUse);
quiz.loadProgress();

const renderQuestion = () => {
    const currentQuestion = quiz.getCurrentQuestion();
    const quizContainer = document.getElementById('quiz');

    if (!currentQuestion) return;

    quizContainer.innerHTML = `
        <div class="question">${currentQuestion.question}</div>
        ${currentQuestion.options.map((option) => `
            <label>
                <input type="radio" name="answer" value="${option}" required>
                ${option}
            </label>
        `).join('')}
    `;
};

const handleSubmit = () => {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (selectedAnswer) {
        quiz.nextQuestion(selectedAnswer.value);
        if (quiz.isFinished()) {
            displayResult();
            localStorage.removeItem('quizProgress'); 
            document.getElementById('submit').style.display = 'none'; 
            document.getElementById('restart').style.display = 'block';
        } else {
            renderQuestion();
        }
    } else {
        alert('Please select an answer!');
    }
};

const displayResult = () => {
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = `You scored ${quiz.score} out of ${quizData.length}`;
};

// Reset the quiz

const handleRestart = () => {
    quiz.reset(); 
    renderQuestion(); 
    document.getElementById('result').innerHTML = ''; 
    document.getElementById('submit').style.display = 'block';
        document.getElementById('restart').style.display = 'none';
};

// Event listeners
document.getElementById('submit').addEventListener('click', handleSubmit);
document.getElementById('restart').addEventListener('click', handleRestart);

renderQuestion();
