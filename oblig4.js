window.onload = start;

var canvas;
var can;

var head = {
	x:0,
	y:0,
	div:null,
	pos: function(h, l) {
		this.x = h || 0;
		this.y = l || 0;
	},
	draw: function() {
		if(this.div) {
			var high = (this.x / window.innerHeight) * 1000;
			var prog = (this.y / window.innerWidth) * 10000;
			if(prog >= 100) { state = 3; }
			this.div.style.bottom = high > 80 ? 80 : high + "%";
			this.div.style.left = prog > 98 ? 98 : prog + "%";
		}
	}
}

var words = ["SEO", "hesteløp", "barneskole", "høgskole", "mus", "hare", "elg", "harryhandel", "luretelefon", "eksamen", "berøringsskjerm", "esel", "søkemotoroptimalisering", "katt", "potetstappe", "Tom", "er", "best", "superduperubermegagigantisk", "kuruke", "narkodealer", "bajs", "koskenkorva", "absolutevodkapineapple", "pineappleekspress"];

var state = -1;
var sTime, eTime, timeLeft;
var currentWord, prevWord, curPos, correctWords = -1;
var hardcore = false;

function start() {
	document.getElementById("game").hidden = true;
	//canvas = document.getElementById("canvas");
	//con = canvas.getContext("2d");
	//canRez();
	//window.addEventListener('resize', canRez, false);
	document.getElementById("start").onclick = begin;
}

function begin() {
	document.getElementById("setup").hidden = true;
	document.getElementById("game").hidden = false;
	document.getElementById("stats").hidden = true;
	hardcore = document.getElementById("hardcore").checked;
	currentWord = wordChoose();
	state = 1;
	curPos = 0;
	correctWords = 0;
	renderWord(words[currentWord]);
	sTime = (window.performance.now() || +new Date())+15000;
	document.getElementById("letter").value = "";
	document.getElementById("letter").focus();
	window.addEventListener('keyup', hasPres, false);
	window.requestAnimationFrame(drawTime);
	drawHed();
	document.getElementById("hed").className = "";
}

function renderWord(word) {
	var contain = document.getElementById("words");
	contain.innerHTML = "";
	for(var i = 0; i < word.length; i++) {
		contain.innerHTML += "<span id=\"" + i + "\">"+ word[i] + "</span>";
	}
}

function hasPres() {
	var source = document.getElementById("letter");
	var letters = source.value;
	var places;
	var pos;
	
	if(letters.match("[a-zA-ZæøåÆØÅ]")) { //sjekk om det er skrevet bokstaver
		if(pos = tryLetter(letters, words[currentWord])) {
			curPos += pos; //legg til antall korrekt rekkefølge
			
			for(var i = 0; i < curPos; i++) {
				document.getElementById(i).className = "done";
			}
			
			if(curPos > (words[currentWord].length - 1)) {
				playFlap("1");
				sTime+=words[currentWord].length*400;
				correctWords++;
				curPos = 0;
				prevWord = currentWord;
				currentWord = wordChoose();
				renderWord(words[currentWord]);
			}
		} else {
			playFlap("wrong");
			if(hardcore) {
				curPos = 0;
				
				for(var i = 0; i < words[currentWord].length; i++) {
					document.getElementById(i).className = "";
				}
			}
		}
			
		/* if(places = findLetter(source, words[currentWord])) {
			if(places.length > 0) {
				//currentGuessedLetters.push(source);
			} else {
				
			}
		} */
	}
	source.value = ""; // Fjern bokstaven som ble skrevet
	
	/* if(currentCorrect === words[currentWord].length) {
		gameOver(true);
	} else if(currentPart > maxParts) {
		gameOver(false);
	} */
}

function tryLetter(let, word) {
	var correct = 0;
	for(var i = 0; i < let.length; i++) {
		if(let[i].toLowerCase() === word[curPos+i].toLowerCase()) {
			correct++;
		}
	}
	return correct;
}

function drawTime(timestamp) {
	var tdiv = document.getElementById("time");
	var time = timestamp || +new Date();
	timeLeft = calcTimeLeft(time);
	tdiv.innerHTML = (timeLeft > 0 ? timeLeft : 0);
	
	if(timeLeft >= 40) {
		tdiv.className = "high";
	}else if(timeLeft >= 24) {
		tdiv.className = "norm";
	} else if(timeLeft >= 11) {
		tdiv.className = "low";
	} else {
		tdiv.className = "crit";
	}
	
	if(timeLeft > 0 && state === 1) {
		window.requestAnimationFrame(drawTime);
	} else if(state === 3) {
		// Du har vunnet
		playFlap("away");
		document.getElementById("hed").className = "win";
		window.removeEventListener('keyup', hasPres, false);
		document.getElementById("setup").hidden = false;
		document.getElementById("game").hidden = true;
		document.getElementById("stats").hidden = false;
		document.getElementById("stats").innerHTML = "<h2>Gratulerer!</h2> Tom klarte å fly bort med "+ timeLeft +" sekunder igjen.";
	}
	else {
		// spillet er over fordi tiden er ute
		playFlap("ded");
		state = 2;
		document.getElementById("hed").className = "ded";
		window.removeEventListener('keyup', hasPres, false);
		document.getElementById("setup").hidden = false;
		document.getElementById("game").hidden = true;
		document.getElementById("stats").hidden = false;
		document.getElementById("stats").innerHTML = "Du klarte "+ correctWords +" ord før Tom gikk i bakken.";
	}
}

function drawHed() {
	if(!document.getElementById("hed")) {
		var h = document.createElement("div");
		h.setAttribute("id", "hed");
		h.style.width = "4em";
		h.style.height = "6.7em";
		document.body.appendChild(h);
		head.div = document.getElementById("hed");
	}
	head.pos(timeLeft, correctWords);
	head.draw();
	if(state == 2) {
		
	}
	window.requestAnimationFrame(drawHed);
}

function calcTimeLeft(time) {
	//var elaps = Math.floor(((time - sTime) / 1000) * 100) / 100;
	return Math.floor(((sTime - time) / 1000) * 100) / 100;
}

function wordChoose(diffWord) {
	var done = false;
	var rand;
	while(!done) {
		rand = Math.floor(Math.random() * words.length);
		switch (diffWord) {
			case 1:
				if(words[rand].length <= 4) done = true;
				break;
			case 2:
				if(words[rand].length > 4 && words[rand].length <= 8) done = true;
				break;
			case 3:
				if(words[rand].length > 9) done = true;
				break;
			default:
				done = true;
		}
		if(prevWord === rand) { // Ikke hent ut det samme ordet som forrige gang
			done = false;
		}
	}
	return rand;
}

function playFlap(type) {
	var audio = document.getElementById("sfx");
	audio.src = "sounds/flap-"+type+".mp3";
	audio.play();
}