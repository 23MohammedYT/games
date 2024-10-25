var background = new Audio("background.mp3");
var hover = new Audio("hover.wav");
var selecting = new Audio("select.mp3");

document.addEventListener('DOMContentLoaded', function() {
	background.play();
})

const items = document.querySelectorAll('.item');
let offset = 0; // Track the current offset for the items
let keyPressed = false;
let gameView = true;
const game_name = ['تحدي المعرفة', 'Flappy Bird']; // Add game names here

const screenSettings = document.querySelectorAll('.screen_settings');
let settings_offest = 0;

// Function to update the class names based on the offset
function updateItemClasses() {
	items.forEach((item, index) => {
		// Clear previous class names
		item.classList.remove('left', 'right', 'selected');

		// Assign class names based on the offset
		if (index < offset) {
			item.classList.add('left');
		} else if (index > offset) {
			item.classList.add('right');
		} else {
			item.classList.add('selected');
		}

		// Manage z-index based on offset
		if (index === (offset + 1)) {
			item.style.zIndex = '1';
		} else if (index === offset) {
			item.style.zIndex = '2';
		} else {
			item.style.zIndex = '0';
		}
	});

	// Update game title based on the current offset
	const gameTitle = document.getElementById('game_title');
	if (game_name[offset]) {
		gameTitle.textContent = game_name[offset];
	} else {
		gameTitle.textContent = '???';
	}
	
	screenSettings.forEach(function(button) {
		if (!gameView && button == screenSettings[settings_offest]) {
			button.style.color = '#00FF00';
		} else {
			button.style.color = '#FFFFFF';
		}
	});
}

// Event listener for keyboard controls
document.addEventListener('keydown', (event) => {
	if (event.key === 'ArrowUp') {
		if (gameView) {
			gameView = false;
			screenSettings[0].style.color = '#00FF00';
			document.querySelector('.selected').style.borderColor = '#FFFF00';
		}
		
		hover.play();
	} else if (event.key === 'ArrowDown') {
		if (!gameView) {
			gameView = true;
			document.querySelector('.selected').style.borderColor = '#00FF00';
			screenSettings.forEach(function(button) {
				button.style.color = '#FFFFFF';
			});
		}
		
		hover.play();
	}

	if (event.key === 'Enter') {
		if (gameView) {
			const fadeElement = document.querySelector('#fadeIn');
            fadeElement.style.animation = 'fadeColor 1s';
			
			fadeElement.addEventListener('animationend', function() {
				if (offset == 0) {
					window.location.href = 'quiz/';
				} else if (offset == 1) {
					window.location.href = 'flappy/';
				}
            }, { once: true });
			
			background.pause();
		} else {
			if (settings_offest == 0) {
				if (!document.fullscreenElement && 
					!document.mozFullScreenElement && 
					!document.webkitFullscreenElement && 
					!document.msFullscreenElement) {
					if (document.documentElement.requestFullscreen) {
						document.documentElement.requestFullscreen();
					} else if (document.documentElement.mozRequestFullScreen) { // Firefox
						document.documentElement.mozRequestFullScreen();
					} else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari, Opera
						document.documentElement.webkitRequestFullscreen();
					} else if (document.documentElement.msRequestFullscreen) { // IE/Edge
						document.documentElement.msRequestFullscreen();
					}
				} else {
					// Exit full-screen mode if currently in full-screen
					if (document.exitFullscreen) {
						document.exitFullscreen();
					} else if (document.mozCancelFullScreen) { // Firefox
						document.mozCancelFullScreen();
					} else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
						document.webkitExitFullscreen();
					} else if (document.msExitFullscreen) { // IE/Edge
						document.msExitFullscreen();
					}
				}
				
				// Request full-screen and update canvas size when fully loaded
				function enterFullScreen() {
				  if (document.documentElement.requestFullscreen) {
					document.documentElement.requestFullscreen().then(() => {
					});
				  }
				}

				// Run when the window has fully loaded
				window.onload = function() {
				  enterFullScreen(); // Trigger full screen
				};
			}
		}
		
		selecting.play();
	}

	if (!keyPressed) {
		if (event.key === 'ArrowLeft') {
			if (gameView) {
				// Move items left
				if (offset > 0) {
					offset--;
				}
			} else {
				if (settings_offest != (screenSettings.length - 1)) {settings_offest++};
			}
			
			hover.play();
		} else if (event.key === 'ArrowRight') {
			if (gameView) {
				// Move items right
				if (offset < (items.length - 1)) {
					offset++;
				}
			} else {
				if (settings_offest != 0) {settings_offest--};
			}
			
			hover.play();
		}
		
		// Update the class names after changing the offset
		updateItemClasses();
	}
	
	keyPressed = true;
});

document.addEventListener('keyup', () => {
	keyPressed = false; // Reset the flag when the key is released
});

// Initialize the classes on page load
updateItemClasses();

// Function to determine the time of day and change the background accordingly
function checkTimeOfDay() {
	const now = new Date();
	const hours = now.getHours();
	const body = document.body;
	
	// Hide stars by default
	const stars = document.querySelectorAll('.star');
	stars.forEach(star => star.style.display = 'none');
	
	// Hide clouds by default
	const clouds = document.querySelectorAll('.cloud');
	clouds.forEach(cloud => cloud.style.display = 'none');

	// Define the time ranges
	if (hours >= 5 && hours < 12) {
		console.log("Day");
		body.style.background = 'linear-gradient(135deg, #87CEEB 0%, #B0E0E6 100%)'; // Bright blue sky
		clouds.forEach(cloud => cloud.style.display = 'block');
	} else if (hours >= 12 && hours < 17) {
		console.log("Afternoon");
		body.style.background = 'linear-gradient(135deg, #FFA07A 0%, #FF7F50 100%)'; // Sunset-like colors
	} else if (hours >= 17 && hours < 21) {
		console.log("Evening");
		body.style.background = 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)'; // Golden dusk
		clouds.forEach(cloud => cloud.style.display = 'block');
	} else {
		console.log("Night");
		body.style.background = 'linear-gradient(135deg, #1c1c3c 0%, #2a2a69 100%)'; // Dark sky
		stars.forEach(star => star.style.display = 'block'); // Show stars at night
	}
}

// Call the function to check the time of day
checkTimeOfDay();

// Optionally, check the time of day periodically, every 1 minute
setInterval(checkTimeOfDay, 60000); // Update every 60 seconds
