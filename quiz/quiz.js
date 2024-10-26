var randomQuestion;
var keyPressed = false;
var choosenAnswer = 0;
var timerMode = false;
var selectMode = 0;

const selecting = new Audio("../select.mp3");
const hover = new Audio("../hover.wav");
const whoosh = new Audio('whoosh.mp3');
const background = new Audio('background.mp3');
const correct = new Audio('correct.mp3');
const wrong = new Audio('wrong.mp3');
const pop = new Audio('pop.wav');

const overlay = document.querySelector('.overlay');

background.play();
// Select all sky-button elements
const skyButtons = document.querySelectorAll('.sky-button');
const answerButtons = document.querySelectorAll('.answer-container span');

// Function to update button background color based on selectMode
function updateButtonColors() {
	skyButtons.forEach((button, index) => {
		button.style.backgroundColor = index === selectMode ? '#00BFFF' : ''; // Apply color if selected
	});
	
	answerButtons.forEach((button, index) => {
		button.querySelector('label').style.backgroundColor = index === choosenAnswer ? '#FFFF00' : ''; // Apply color if selected
	});
}

// Add hover event listener to each button
skyButtons.forEach((button, index) => {
    button.addEventListener('mouseover', () => {
        selectMode = index; // Update selectMode with the hovered button's index
		updateButtonColors();
		hover.play();
    });
	
	button.addEventListener('click', () => {
		// Array of all sounds for easy control
		const allSounds = [whoosh, correct, wrong, pop, selecting];
			allSounds.forEach(sound => {
			sound.pause();
			sound.currentTime = 0; // Reset playback position to the start
		});
		selecting.play();
	})
});

answerButtons.forEach((button, index) => {
	button.addEventListener('mouseover', () => {
		choosenAnswer = index; // Update selectMode with the hovered button's index
		updateButtonColors();
		hover.play();
	})
});

// Event listener for keyboard controls
document.addEventListener('keydown', (event) => {
	if (document.querySelector('.container').style.display !== 'none') {
		if (!keyPressed) {
			if (event.key === 'ArrowDown' && selectMode < 2) { // Assuming 3 buttons (0, 1, 2)
				selectMode++;
				hover.play();
			} else if (event.key === 'ArrowUp' && selectMode > 0) {
				selectMode--;
				hover.play();
			}
			updateButtonColors(); // Update button colors after changing selectMode
		}
		
		keyPressed = true;
		if (event.key === 'Enter') {
			switch (selectMode) {
				case 0:
					start_button.click();
					break;
				case 1:
					timer_button.click();
					break;
				case 2:
					exit_button.click();
					break;
			}
			selecting.play();
		}
	} else {
		if (overlay.style.pointerEvents === 'none' && !keyPressed) {
			if (event.key === 'ArrowDown' && choosenAnswer < 2) { // Assuming 3 buttons (0, 1, 2)
				choosenAnswer++;
				hover.play();
			} else if (event.key === 'ArrowUp' && choosenAnswer > 0) {
				choosenAnswer--;
				hover.play();
			}
			updateButtonColors(); // Update button colors after changing choosenAnswer
		}
		
		keyPressed = true;
		if (event.key === 'Enter') {
			const answerSpan = document.querySelectorAll('.answer-container span')[choosenAnswer];
			const answerText = answerSpan.querySelector('.q-label').textContent;
			
			
			switch (choosenAnswer) {
				case 0:
					checkAnswer(answerText, answerSpan);
					break;
				case 1:
					checkAnswer(answerText, answerSpan);
					break;
				case 2:
					checkAnswer(answerText, answerSpan);
					break;
			}
			selecting.play();
		}
	}
});

function checkAnswer(answer, answerSpan) {
	if (answer === randomQuestion.correctAnswer) {
		handleAnswerClick(answerSpan, true); // Correct answer clicked
	} else {
		handleAnswerClick(answerSpan, false); // Incorrect answer clicked
	}
}

document.addEventListener('keyup', () => {
	keyPressed = false; // Reset the flag when the key is released
});
// Initial call to set the first button's background color
updateButtonColors();

// Helper function to shuffle array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
	const j = Math.floor(Math.random() * (i + 1));
	[array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Function to load a new question from the JSON data
function loadNewQuestion() {
	overlay.style.pointerEvents = 'auto';
	fetch('questions.json') // Replace with the correct path to the JSON file
		.then(response => response.json())
		.then(data => {
			// Select a random question
			randomQuestion = data.questions[Math.floor(Math.random() * data.questions.length)];

			// Assign question text
			document.querySelector('.q-label').textContent = randomQuestion.question;

			// Assign image source
			document.querySelector('.show-image').src = randomQuestion.image;

			// Shuffle and assign answers
			const shuffledAnswers = shuffle([...randomQuestion.answers]);
			const answerLabels = document.querySelectorAll('.w-label');
			shuffledAnswers.forEach((answer, index) => {
				answerLabels[index].textContent = answer.text;

				// Add event listener for each answer option
				answerLabels[index].parentNode.onclick = () => {
					handleAnswerClick(answerLabels[index].parentNode, answer.text === randomQuestion.correctAnswer);
				};
			});
		})
		.catch(error => {
			console.error("Error fetching the JSON file:", error);
		});
		
	// Start the answer animations after 1000ms from the first question
	setTimeout(() => {
		animateAnswers(0); // Start the animation chain for answers
	}, 1500); // Start after 1000ms
}

const start_button = document.getElementById('start_button');
const timer_button = document.getElementById('timer_button');
const exit_button = document.getElementById('exit_button');

start_button.addEventListener('click', function() {
	document.querySelector('.game-container').style.display = 'block';
	document.querySelector('.container').style.display = 'none';
	
	// Initial call to load the first question
	loadNewQuestion();
})

timer_button.querySelector('span').innerHTML = timerMode ? 'مفعَّل' : 'مغلق';
timer_button.addEventListener('click', function() {
	timerMode = timerMode ? false : true;
	timer_button.querySelector('span').innerHTML = timerMode ? 'مفعَّل' : 'مغلق';
});

exit_button.addEventListener('click', function() {
	const fadeElement = document.querySelector('#fadeIn');
	fadeElement.style.animation = 'fadeColor 1s';
	fadeElement.addEventListener('animationend', function() {
		window.location.href = '../';
	}, { once: true });
	background.pause();
})
  
// Function to handle correct and incorrect answers
function handleAnswerClick(answerElement, isCorrect) {
	const labelElement = answerElement.querySelector('label'); // Select the label within the answerElement
	
	if (isCorrect) {
		// Action for correct answer: Set label background to green
		labelElement.style.backgroundColor = 'green';
		overlay.style.pointerEvents = 'auto';
		correct.play();
	} else {
		// Action for incorrect answer: Set label background to red
		labelElement.style.backgroundColor = 'red';
		overlay.style.pointerEvents = 'auto';
		wrong.play()
	}
	
	// Wait a moment to show the color feedback, then load a new question
	setTimeout(() => {
		labelElement.style.backgroundColor = 'white'; // Reset the color
		loadNewQuestion(); // Load a new question
	}, 1000); // 1-second delay for feedback
}

// Add click events to each answer
document.querySelectorAll('.answer-container span').forEach((answerSpan, index) => {
	const answerText = answerSpan.querySelector('.q-label').textContent;

	// Check if the answer text matches the correct answer from the JSON data
	answerSpan.addEventListener('click', () => {
		if (answerText === randomQuestion.correctAnswer) {
			handleAnswerClick(answerSpan, true); // Correct answer clicked
		} else {
			handleAnswerClick(answerSpan, false); // Incorrect answer clicked
		}
	});
});

// Function to trigger animations for the answers sequentially
function animateAnswers(index) {
	const answers = document.querySelectorAll('.answer-container span');

	if (index >= answers.length) return; // Stop if all answers have been animated

	const answer = answers[index];
	const image = answer.querySelector('.q-image');
	const label = answer.querySelector('.q-label');

	// Start the fade-in for the image
	image.style.opacity = '1'; // Make the image visible
	image.style.animationPlayState = 'running'; // Start the animation

	// Make the label visible and start the slide animation
	label.style.opacity = '1'; // Make the label visible
	label.style.animationPlayState = 'running'; // Start the animation

	// Set the delay before starting the next answer animation
	const delay = 500; // First answer has 1000ms delay, others 500ms

	// Wait for the current animation to complete before starting the next one
	setTimeout(() => {
		animateAnswers(index + 1); // Call the next animation
	
		if (index == 2 && timerMode) {
			setTimeout(() => {
				const timerElement = document.querySelector('.timer');
				timerElement.style.display = 'block'; // Make the timer visible
				const video = timerElement.querySelector('.timer-video'); // Get the video element
				video.play(); // Start playing the video automatically
				overlay.style.pointerEvents = 'none';
			}, 500)
		} else {
			overlay.style.pointerEvents = 'none';
		}
	}, delay); // Change this value if you want a delay after each answer animation
}

// Initial animation for the first question
const firstQuestion = document.querySelector('.question');
const firstImage = firstQuestion.querySelector('.q-image');
const firstLabel = firstQuestion.querySelector('.q-label');

// Start the fade-in for the first image
firstImage.style.opacity = '1';
firstImage.style.animationPlayState = 'running';

// Make the first label visible and start the slide animation
firstLabel.style.opacity = '1';
firstLabel.style.animationPlayState = 'running';
