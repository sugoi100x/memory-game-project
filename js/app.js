/*
 * Create a list that holds all of your cards
 */
let toggledCards = [];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */



const deck = document.querySelector('.deck');
deck.addEventListener('click', event => {
	const clickTarget = event.target;
	if (clickTarget.classList.contains('card') && toggledCards.length < 2 && !toggledCards.includes(clickTarget)){
		viraCarta(clickTarget);
		addToggledCard(clickTarget);
		if (toggledCards.length === 2) {
			checkForMatch();
		}
	}
});

function viraCarta(clickTarget){
	clickTarget.classList.toggle('open');
	clickTarget.classList.toggle('show');
}

function addToggledCard(clickTarget){
	toggledCards.push(clickTarget);
	console.log(toggledCards);
}

function checkForMatch(){
	if (
		toggledCards[0].firstElementChild.className ===
		toggledCards[1].firstElementChild.className
	) {
		toggledCards[0].classList.toggle('match');
		toggledCards[1].classList.toggle('match');
		toggledCards = [];
	} else {
		setTimeout(() => {
			console.log('Not a match!');
			viraCarta(toggledCards[0]);
			viraCarta(toggledCards[1]);
			toggledCards = [];
		}, 1000);
			
	}
}