const buttons = document.querySelectorAll(".subject-type");
const logoContainer = document.getElementById("logo-container");
const headerSubject = document.getElementById("subject");
const headerLogo = document.getElementById("header-logo");
const headerText = document.getElementById("header-text");
const mainMenu = document.getElementById("main-menu");
const quizContainer = document.getElementById("quiz-container");
const quizCompleted = document.getElementById("quiz-completed");
const questionNumber = document.getElementById("question-number");
const optionButtons = document.querySelectorAll('.quiz-option');
const questionText = document.getElementById("question-text");
const questionElement = document.querySelector('.question-text');
const progressBar = document.getElementById("progress-bar");
const submitButton = document.getElementById("submit-button");
const nextQuestionButton = document.querySelector(".button-next");
const resultSubjectText = document.getElementById("result-subject-text");
const scoreNumber = document.getElementById("score-number");
const playAgain = document.getElementById("play-again-button");

const scoreContainer = document.getElementById("logo-score");
const scoreLogo = document.getElementById("score-logo");
const scoreText = document.getElementById("score-text-logo");

let quizzes = [];
let currentQuiz, currentQuestionIndex, score;
let selectedOption = null;


const toggleSwitch = document.getElementById("switch-button");
const sunIcon = document.getElementById('sun-icon'); 
const moonIcon = document.getElementById('moon-icon'); 



toggleSwitch.addEventListener('change', function() {
    if (this.checked) {
        document.documentElement.setAttribute('data-theme', 'dark-mode'); 
        sunIcon.src = './images/icon-sun-light.svg'; 
        moonIcon.src = './images/icon-moon-light.svg';
    } else {
        document.documentElement.setAttribute('data-theme', ''); 
        sunIcon.src = './images/icon-sun-dark.svg'; 
        moonIcon.src = './images/icon-moon-dark.svg';
    }
});


fetch('data.json')
    .then(response => response.json())
    .then(data => {
        quizzes = data.quizzes;
        initializeQuiz();
    });

// Initialiser le quiz
function initializeQuiz() {
    buttons.forEach(button => {
        button.addEventListener("click", function() {
          
            mainMenu.style.display = "none";
            quizContainer.classList.remove('display');
            quizContainer.classList.add('active');

            const newLogoSrc = this.getAttribute("data-logo");
            const newText = this.getAttribute("data-text");
            const newBackgroundClass = `${newText.toLowerCase()}-bg`;
            
            
            headerLogo.src = newLogoSrc;
            headerText.textContent = newText;

            scoreLogo.src = newLogoSrc;
            scoreText.textContent = newText;

            
            logoContainer.classList.remove("html-bg", "css-bg", "javascript-bg", "accessibility-bg");
            scoreContainer.classList.remove("html-bg", "css-bg", "javascript-bg", "accessibility-bg");

           
            logoContainer.classList.add(newBackgroundClass);
            scoreContainer.classList.add(newBackgroundClass);

            currentQuiz = quizzes.find(quiz => quiz.title.toLowerCase() === newText.toLowerCase());
            currentQuestionIndex = 0;
            score = 0;
            
            showQuestion();
        });
    });
}


function showQuestion() {
    let currentQuestion = currentQuiz.questions[currentQuestionIndex];
    let questionNumberText = `Question ${currentQuestionIndex + 1} of ${currentQuiz.questions.length}`;
    questionNumber.textContent = questionNumberText;
    questionText.textContent = currentQuestion.question;

    questionElement.textContent = currentQuestion.question;


    optionButtons.forEach((button, index) => {
        button.classList.remove('correct', 'wrong', 'selected');
        button.querySelector('.fa-circle-check').style.display = 'none';
        button.querySelector('.fa-circle-xmark').style.display = 'none';
        button.querySelector('.content-option').classList.remove('correct', 'wrong');
        
        // Réactiver les boutons
        button.style.pointerEvents = 'auto';
        button.style.cursor = 'pointer';
        button.disabled = false;

        const optionTextElement = button.querySelector('.choice-text.option-text');
        optionTextElement.textContent = currentQuestion.options[index];
    });
    
    selectedOption = null;
    
    submitButton.style.display = 'inline-block';
    nextQuestionButton.style.display = 'none';
}



// Sélectionner une option
optionButtons.forEach(button => {
    button.addEventListener('click', function()  {

        optionButtons.forEach(btn => btn.classList.remove('selected'));
        this.classList.add('selected');
        selectedOption = this;
    });
});


submitButton.addEventListener('click', function() {

      const msgError = document.getElementById('error-message-text');
      const iconError = document.querySelector('.icon-error');

   
    if (!selectedOption) {
        iconError.style.visibility = 'visible';
        msgError.textContent = 'Please select an answer';
        return; 
    }

    iconError.style.visibility = 'hidden';
    msgError.textContent = '';
    

        const userAnswer = selectedOption.querySelector('.choice-text.option-text').textContent;
        const correctAnswer = currentQuiz.questions[currentQuestionIndex].answer;

       

        if (userAnswer === correctAnswer) {
            score++;
            selectedOption.classList.add('correct');
            selectedOption.querySelector('.content-option').classList.add('correct');
            selectedOption.querySelector('.fa-circle-check').classList.add('correct');
            selectedOption.querySelector('.fa-circle-check').style.display = 'block';
        } else {
            selectedOption.classList.add('wrong');
            selectedOption.querySelector('.content-option').classList.add('wrong');
            selectedOption.querySelector('.fa-circle-xmark').classList.add('wrong');
            selectedOption.querySelector('.fa-circle-xmark').style.display = 'block';     

            // Montrer la bonne réponse
            optionButtons.forEach(btn => {
                const btnText = btn.querySelector('.choice-text.option-text').textContent;
                if (btnText === correctAnswer) {
                    btn.querySelector('.fa-circle-check').style.display = 'block';
                }
            });
        }

        // Réinitialiser pour la prochaine question
        optionButtons.forEach(btn => {
          btn.style.pointerEvents = 'none';
          btn.style.cursor = 'default';
          btn.disabled = true;
        })
        nextQuestionButton.style.display = 'block';
        submitButton.style.display = 'none';
    
});    


function showScore() {

    const scoreElement = document.querySelector('#score-number');
    scoreElement.textContent = `${score}`;
}


function handleNextButton() {
  currentQuestionIndex++;
  if (currentQuestionIndex < currentQuiz.questions.length) {
    showQuestion();
  } else {
     quizContainer.classList.remove('active');
     quizContainer.classList.add('display');
          
     quizCompleted.classList.remove('visibility');
     quizCompleted.classList.add('active');
 
     showScore();
    }
}




currentQuestionIndex = 0;
const totalQuestions = 10; 

function updateProgressBar() {
    
    const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    
    progressBar.value = progressPercentage;
}


nextQuestionButton.addEventListener('click', () => {
  if(currentQuestionIndex < currentQuiz.questions.length) {
    handleNextButton();
    updateProgressBar();
  } else {
    initializeQuiz();
  }
  
});

playAgain.addEventListener('click', () => {
    
    progressBar.value = 0; 
    currentQuestionIndex = 0; 

    quizCompleted.classList.remove('active');
    quizCompleted.classList.add('visibility');
    
    mainMenu.style.display = 'flex';
    logoContainer.classList.remove("html-bg", "css-bg", "javascript-bg", "accessibility-bg");
    headerText.textContent = '';
    headerLogo.src = '';


    score = 0;
    scoreNumber.textContent = `${score}`;
    
    initializeQuiz();

})








