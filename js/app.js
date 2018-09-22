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
 * Constante que guarda o número de pares possíveis nesse jogo.
 */
 const TOTAL_PAIRS = 8

/*
 * Variável que guarda o número de pares que o jogador conseguiu formar durante o jogo.
 */
 let matched = 0;

 // Guardamos o deck de cartas dentro dessa constante.
const deck = document.querySelector('.deck');

/*
 * Evento do botão "Cancel" para fechar o modal.
 */
document.querySelector('.modal_cancel').addEventListener('click', () => {
	toggleModal();
});

/*
 * Evento do botão "Cancel" para fechar o modal.
 */
document.querySelector('.modal_close').addEventListener('click', () => {
	toggleModal();
});

/*
 * Evento do botão replay que reinicia o jogo.
 */
document.querySelector('.modal_replay').addEventListener('click', () => {
	console.log('replay');
});

/*
 * Evento do botão de resetar do jogo.
 */
document.querySelector('.restart').addEventListener('click', resetGame);

/*
 * Evento do botão replay do jogo.
 */
document.querySelector('.modal_replay').addEventListener('click', replayGame);

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
			addMove();
			checkScore();
			checkForMatch();
		}
	}
});

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 *	 - Shuffle function from http://stackoverflow.com/a/2450976
 */
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
		matched = matched + 1;
		// Aqui o código irá verificar se o número de pares for igual o número de pares possíveis
		if (matched === TOTAL_PAIRS) {
			// Uma vez completada a condição, finalizamos o jogo.
			gameOver()
		}
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

/*
 * Função que faz o modal aparecer/desaparecer.
 */
function toggleModal() {
	const modal = document.querySelector('.modal_background');
	modal.classList.toggle('hide');
}

/*
 * Função que serva para colocar o status e pontução na tela modal.
 */
function writeModalStats() {
	const timeStat = document.querySelector('.modal_time');
	const clockTime = document.querySelector('.clock').innerHTML;
	const movesStat = document.querySelector('.modal_moves');
	const starsStat = document.querySelector('.modal_stars');
	const stars = getStars();

	timeStat.innerHTML = `Time = ${clockTime}`
	movesStat.innerHTML = `Moves = ${moves}`
	starsStat.innerHTML = `Stars = ${stars}`
}

/*
 * Função que serve contar o número de estrelas para que a função writeModalStats escreva na tela modal.
 */
function getStars() {
	const stars = document.querySelectorAll('.stars li');
	let starCount = 0;
	console.log(starCount);
	for (star of stars){
		if(star.style.display !== 'none'){
			starCount = starCount + 1;
			console.log(starCount);
		}
	}
	return starCount;
}

/*
 * Função que reseta o jogo.
 */
function resetGame(){
	resetClockAndTime();
	resetMoves();
	resetStars();
	shuffleDeck();
	toggledCards = [];
	matched = 0;
}

/*
 * Função que reseta o relógio.
 */
function resetClockAndTime(){
	stopClock();
	clockOff = true;
	time = 0;
	displayTime();
	resetCards();
}

/*
 * Função que reseta o número de movimentos.
 */
function resetMoves() {
	moves = 0;
	document.querySelector('.moves').innerHTML = moves;
}

/*
 * Função que reseta o número de estrelas.
 */
function resetStars(){
	stars = 0;
	const starList = document.querySelectorAll('.stars li');
	for (star of starList){
		star.style.display = 'inline';
	}
}

/*
 * Função que finaliza o jogo.
 */
function gameOver() {
	stopClock();
	toggleModal();
	writeModalStats();
	matched = 0;
}

/*
 * Função que reinicia o jogo.
 */
function replayGame(){
	resetGame();
	toggleModal();
	resetCards();
}

/*
 * Função que vira as cartas para baixo.
 */
function resetCards(){
	const cards = document.querySelectorAll('.deck li');
	for (let card of cards) {
		card.className = 'card';
	}
}


// Embaralha as cartas jogo.
shuffleDeck();