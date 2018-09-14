/*
 * Cria uma lista com as cartas viradas para saber com quais cartas estmos trabalhando.
 */
let toggledCards = [];

/*
 * Regista o número de movimentos do jogador.
 */
let moves = 0;

/*
 * Variável que guarda a informação se o relógio está desligado ou não.
 */
let clockOff = true;


/*
 * Variável para guardar o tempo.
 */
let time = 0;

/*
 * Variável que guarda a indetificação do relógio.
 */
let clockId;



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


// Guardamos o deck de cartas dentro dessa constante.
const deck = document.querySelector('.deck');

// Adicionado escutador de eventos de clique ao deck.
deck.addEventListener('click', event => {
	const clickTarget = event.target;
	if (isClickValid(clickTarget)){
		// Se o relógio não tiver sido ativado anteriormente, ele será ativado aqui.
		if(clockOff){
			startClock();
			clockOff = false;
		}

		// Viramos e adicionamos a carta para a nossa lista.
		viraCarta(clickTarget);
		addToggledCard(clickTarget);

		// Executamos certas ações ao virar duas cartas.
		if (toggledCards.length === 2) {
			checkForMatch();
			addMove();
			checkScore();
		}
	}
});

/*
 * Função que auxilia a virar a carta e gerar a animação.
 */
function viraCarta(clickTarget){
	clickTarget.classList.toggle('open');
	clickTarget.classList.toggle('show');
}

/*
 * Função que adiciona a carta alva a lista de cartas viradas.
 */
function addToggledCard(clickTarget){
	toggledCards.push(clickTarget);
	console.log(toggledCards);
}

/*
 * Função que checa se deu match nas cartas.
 */
function checkForMatch(){
	if (toggledCards[0].firstElementChild.className === toggledCards[1].firstElementChild.className) {
		toggledCards[0].classList.toggle('match');
		toggledCards[1].classList.toggle('match');
		toggledCards = [];
	} else {
		// Esse timeout é importante, pois a animação de virar as cartas é muito rápida para os olhos.
		setTimeout(() => {
			console.log('Not a match!');
			viraCarta(toggledCards[0]);
			viraCarta(toggledCards[1]);
			toggledCards = [];
		}, 1000);
			
	}
}

/*
 * Função que ajuda a verificar se é um clique válido de jogo.
 */
function isClickValid(clickTarget){
	return(
		!clickTarget.classList.contains('match') &&
		clickTarget.classList.contains('card') && 
		toggledCards.length < 2 && 
		!toggledCards.includes(clickTarget)
	);
}

/*
 * Função para embaralhar as cartas.
 */
function shuffleDeck(){
	// É necessário usar esse comando para trabalhar o NodeList como um vetor.
	const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
	const suffledCards = shuffle(cardsToShuffle);
	for(card of suffledCards){
		deck.appendChild(card);
	}
}

/*
 * Função que faz a contagem do número de movimentos.
 */
function addMove(){
	moves = moves + 1;
	const movesText = document.querySelector('.moves');
	movesText.innerHTML = moves;
}

/*
 * Função que checa a pontuação.
 */
function checkScore(){
	if (moves === 18 || moves === 25){
		hideStar();
	}
}

/*
 * Função que esconde o número de estrelas conforme o jogador vai usando mais movimentos.
 */
function hideStar(){
	const starList = document.querySelectorAll('.stars li');
	for (star of starList){
		if (star.style.display !== 'none'){
			star.style.display = 'none';
			break;
		}
	}
}

/*
 * Função que inicializa o relógio.
 */
function startClock(){
	clockId = setInterval(() => {
		time = time + 1;
		displayTime();
		console.log(time);
	}, 1000);
}

/*
 * Função que atualiza o display do relógio.
 */
function displayTime(){
	const clock = document.querySelector('.clock');
	console.log(clock);
	const minutes = Math.floor(time/60);
	const seconds = Math.floor(time%60);

	if (seconds < 10){
		// Essa linha é necessária para aparecer o zero na contagem do tempo do display.
		clock.innerHTML = `${minutes}:0${seconds}`;
	}else{
		clock.innerHTML = `${minutes}:${seconds}`;
	}
}

/*
 * Função que serve para o relógio.
 */
function stopClock(){
	clearInterval(clockId);
}

// Embaralha as cartas jogo.
shuffleDeck();