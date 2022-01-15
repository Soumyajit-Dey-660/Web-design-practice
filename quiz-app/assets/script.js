let highscoresList = document.getElementById('highscores-list');
let homePageDiv = document.getElementById('start-quiz');
let scoreList = document.getElementById('score-list');
let quizQuestionDiv = document.getElementById('quiz-questions');
let allDoneDiv = document.getElementById('all-done');
let currentHighScores = {};
let currentQuestionNumber = 0;
let totalScore = 0;
let prevQuestionAnswer = '';
let quizQuestions = [{
    "id": 0,
    "question": "Commonly used Data types DO NOT include:",
    "options": [
        "strings", "booleans", "alerts", "numbers"
    ],
    "answer": 2
}, {
    "id": 1,
    "question": "Arrays in JavaScript can be used to store ________",
    "options": [
        "numbers and strings", "other arrays", "booleans", "all of the above"
    ],
    "answer": 3
}]

let quizHtmlString = `<div id='question-description'>
<h2 id="question">${quizQuestions[currentQuestionNumber]["question"]}</h2>
<p class='answer-option' value="1" id="answer-1">1. ${quizQuestions[currentQuestionNumber]["options"][0]}</p>
<p class='answer-option' value="2" id="answer-2">2. ${quizQuestions[currentQuestionNumber]["options"][1]}</p>
<p class='answer-option' value="3" id="answer-3">3. ${quizQuestions[currentQuestionNumber]["options"][2]}</p>
<p class='answer-option' value="4" id="answer-4">4. ${quizQuestions[currentQuestionNumber]["options"][3]}</p>
<hr>
<div id="evaluation">${prevQuestionAnswer}</div>
</div>`

let compareObjects = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);

let createElementFromHTML = (htmlString) => {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
  
    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild; 
  }

let showLeaderboard = () => {
    homePageDiv.style.display = 'none';
    const prevQuestionDiv = document.getElementById('question-description');
    console.log(prevQuestionDiv)
    if (prevQuestionDiv) {
        currentQuestionNumber = 0;
        prevQuestionDiv.remove();
    }
    let highscore = JSON.parse(localStorage.getItem('highScores')) || {};
    let highscoresList = document.querySelector('#highscores-list');
    if (!compareObjects(highscore, currentHighScores)) {
        scoreList.remove();
        let newScoreList = document.createElement('ol'); 
        newScoreList.id = 'score-list';
        Object.entries(highscore)
            .sort((a, b) => b[1] - a[1])
            .forEach((score) => { 
                const li = document.createElement('li'); 
                li.innerHTML = `${ score[0] } - ${ score[1] }`; 
                newScoreList.append(li); 
        });
        scoreList = newScoreList;
        highscoresList.append(scoreList);
    }
    highscoresList.style.display = 'block';
}

let addScore = (initials, score) => {
    const highScoresObj = JSON.parse(localStorage.getItem('highScores')) || {};
    highScoresObj[initials] = score;
    localStorage.setItem('highScores', JSON.stringify(highScoresObj));
}

let clearHighscores = () => {
    const highScoresObj = JSON.parse(localStorage.getItem('highScores')) || {};
    if (!compareObjects(highScoresObj, {})) {
        localStorage.removeItem('highScores');
        scoreList.remove();
        let newScoreList = document.createElement('ol'); 
        newScoreList.id = 'score-list';
        const li = document.createElement('li'); 
        li.innerHTML = `No scores to display`; 
        newScoreList.append(li); 
        scoreList = newScoreList;
        highscoresList.append(scoreList);
    }
}


let showHomePage = () => {
    highscoresList.style.display = 'none';
    const prevQuestionDiv = document.getElementById('question-description');
    if (prevQuestionDiv) {
        currentQuestionNumber = 0;
        prevQuestionDiv.remove();
    }
    homePageDiv.style.display = 'block';
}

let startQuiz = () => {
    homePageDiv.style.display = 'none';
    formQuizQuestion();
}

let formQuizQuestion = () => {
    if (currentQuestionNumber === 0) {
        let quizQuestion = createElementFromHTML(quizHtmlString);
        quizQuestionDiv.append(quizQuestion);
        const answerOptions = document.querySelectorAll('.answer-option');
        for (let i = 0; i < answerOptions.length; i++) {
            answerOptions[i].addEventListener('click',() => checkAnswer(answerOptions[i]));
        }
    } else {
        document.getElementById('question').innerHTML = quizQuestions[currentQuestionNumber]["question"];
        document.getElementById('answer-1').innerHTML = quizQuestions[currentQuestionNumber]["options"][0];
        document.getElementById('answer-2').innerHTML = quizQuestions[currentQuestionNumber]["options"][1];
        document.getElementById('answer-3').innerHTML = quizQuestions[currentQuestionNumber]["options"][2];
        document.getElementById('answer-4').innerHTML = quizQuestions[currentQuestionNumber]["options"][3];
    }
}

let checkAnswer = (element) => {
    const val = element.getAttribute('value');
    if (quizQuestions[currentQuestionNumber]["answer"] === val - 1) {
        prevQuestionAnswer = "Correct";
        totalScore++;
    } else {
        prevQuestionAnswer = "Incorrect";
        // Take away 10 seconds from timer
    }
    const evaluation = document.getElementById('evaluation');
    evaluation.innerHTML = prevQuestionAnswer;
    moveOntoNextQuestion();
}

let moveOntoNextQuestion = () => {
    if (currentQuestionNumber === quizQuestions.length - 1) {
        allDone();
        return;
    }
    currentQuestionNumber++;
    formQuizQuestion()
}

let allDone = () => {
    // View highscore click disable and pop up alert
    currentQuestionNumber = 0;
    const prevQuestionDiv = document.getElementById('question-description');
    prevQuestionDiv.remove();
    document.getElementById("score").innerHTML = totalScore;
    allDoneDiv.style.display = 'block';

}


document.getElementById('start-quiz-btn').addEventListener('click', startQuiz);
document.getElementById('leaderboard').addEventListener('click', showLeaderboard);
document.getElementById('clear-scores').addEventListener('click', clearHighscores);
document.getElementById('go-back-btn').addEventListener('click', showHomePage);

highscoresList.style.display = 'none';
allDoneDiv.style.display = 'none';
// homePageDiv.style.display = 'none'; // Uncomment this line