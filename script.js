document.getElementById("fileInput").addEventListener("change", function (event) {
  const file = event.target.files[0];

  if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
          const csvData = e.target.result;

          Papa.parse(csvData, {
              header: true,
              skipEmptyLines: true,
              complete: function (result) {
                  setupQuiz(result.data);
              }
          });
      };
      reader.readAsText(file);
  }
});

let quizData = [];
let selectedQuestions = [];
let currentIndex = 0;
let timer;
let timeLeft = 30;
let correctCount = 0;
let wrongCount = 0;

function setupQuiz(data) {
  quizData = data;

  if (quizData.length > 30) {
      alert("CSV must contain at least 30 questions.");
      return;
  }

  selectedQuestions = shuffleArray(quizData).slice(0, 12 + Math.floor(Math.random() * 4)); // 12 to 15 random questions

  document.getElementById("fileInput").classList.add("hidden");
  document.getElementById("quiz-container").classList.remove("hidden");

  currentIndex = 0;
  correctCount = 0;
  wrongCount = 0;
  
  loadQuestion();
}

function loadQuestion() {
  if (currentIndex >= selectedQuestions.length) {
      showResult();
      return;
  }

  resetTimer();
  
  const qData = selectedQuestions[currentIndex];
  document.getElementById("question").innerText = qData.question;

  const options = [qData.option1, qData.option2, qData.option3, qData.option4];
  document.getElementById("options").innerHTML = options
      .map(option => 
          `<button onclick='checkAnswer(this, ${JSON.stringify(option)}, ${JSON.stringify(qData.correct)})'>${option}</button>`
      )
      .join("");
}

function checkAnswer(button, selected, correct) {
  clearInterval(timer);

  let buttons = document.querySelectorAll("#options button");

  buttons.forEach(btn => btn.disabled = true); // Disable all buttons

  if (selected === correct) {
      button.style.backgroundColor = "green";
      button.style.color = "white";
      correctCount++;
  } else {
      button.style.backgroundColor = "red";
      button.style.color = "white";
      wrongCount++;

      // Highlight the correct answer
      buttons.forEach(btn => {
          if (btn.innerText === correct) {
              btn.style.backgroundColor = "green";
              btn.style.color = "white";
          }
      });
  }

  setTimeout(() => {
      currentIndex++;
      loadQuestion();
  }, 2000); // Move to next question after 3 sec
}

function resetTimer() {
  clearInterval(timer);
  timeLeft = 30;
  document.getElementById("timer").innerText = `Time Left: ${timeLeft}s`;

  timer = setInterval(() => {
      timeLeft--;
      document.getElementById("timer").innerText = `Time Left: ${timeLeft}s`;

      if (timeLeft <= 0) {
          clearInterval(timer);
          alert("⏳ Time's up!");
          wrongCount++;
          currentIndex++;
          loadQuestion();
      }
  }, 1000);
}

function showResult() {
  document.getElementById("quiz-container").innerHTML = `
      <h2>Quiz Completed!</h2>
      <p>✅ Correct Answers: ${correctCount}</p>
      <p>❌ Wrong Answers: ${wrongCount}</p>
      <button onclick="location.reload()">Restart Quiz</button>
  `;
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}







