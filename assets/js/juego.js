//Funciones anonimas autoinvocadas

const blackJack = (() => {
    'use strict'
    let deck = [];
    const tipos = ['C', 'D', 'H', 'S'],
          especiales = ['A', 'J', 'Q', 'K'];


    let puntosJugadores = [];


    //Referencias html

    const btnPedir = document.querySelector('#btnPedir'),
          btnDetener = document.querySelector('#btnDetener'),
          btnNuevoJuego = document.querySelector('#btnNuevoJuego');

    const  divCartasJugadores = document.querySelectorAll('.divCartas'),
           puntosHTML = document.querySelectorAll('small');

          

    const inicializarJuego = ( numJugadores = 2) => {
        deck = crearDeck();
        puntosJugadores = []; 
        for (let i = 0; i < numJugadores; i++){
            puntosJugadores.push(0);
        }

        puntosHTML.forEach( elem => elem.innerText = 0);
        divCartasJugadores.forEach(elem => elem.innerHTML = '');

        btnPedir.disabled = false;
        btnDetener.disabled = false;

    }
   
    const crearDeck = () => {
        deck = [];
        for (let i = 2; i <= 10; i++) {
            for (let tipo of tipos) {
                deck.push(i + tipo);
            }
        }

        for (let esp of especiales) {
            for (let tipo of tipos) {
                deck.push(esp + tipo);
            }
        }
        return _.shuffle(deck);
    }

    const pedirCarta = () => {
        if (deck.length === 0) {
            throw 'No hay más cartas en el deck';
        }
        return deck.pop();
    }

    const valorCarta = (carta) => {
        const valor = carta.substring(0, carta.length - 1);
        return (isNaN(valor)) ?
            (valor === 'A') ? 11 : 10
            : valor * 1;
    }

    // El último jugador siempre es la computadora
    const acumularPuntos = ( carta, turno ) => {
        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
        puntosHTML[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno]; 
    }

    const crearCarta = ( carta, turno )=>{

        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/cartas/${carta}.png`;
        imgCarta.classList.add('carta');
        divCartasJugadores[turno].append(imgCarta);
    }

    const determinarGanador = ( ) =>{

        const [ puntosMinimos, puntosComputador] = puntosJugadores; 

        setTimeout(() => {

            if (puntosComputador === puntosMinimos) {
                alert('Nadie gana');
            } else if (puntosMinimos > 21) {
                alert('Computador gana');
            } else if (puntosComputador > 21) {
                alert('Jugador gana');
            } else {
                alert('Computadora gana');
            }
        }, 10);
    }

    //Los puntosMinimos son los puntos del jugador
    const turnoComputadora = ( puntosMinimos ) => {

        let puntosComputador = 0;
        let turnoCPU = puntosJugadores.length - 1; 

        do {
            const carta = pedirCarta();
            puntosComputador = acumularPuntos(carta, turnoCPU);

            crearCarta(carta, turnoCPU);

        } while ((puntosComputador < puntosMinimos) && (puntosMinimos <= 21));

        determinarGanador(); 
    }


    //Eventos

    btnPedir.addEventListener('click', () => {

        const carta = pedirCarta();
        const puntosJugador = acumularPuntos(carta, 0);

        crearCarta(carta, 0);

        if (puntosJugador > 21) {
            console.warn('Perdiste');
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);

        } else if (puntosJugador === 21) {
            console.warn('Ganaste');
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);

        }

    });

    btnDetener.addEventListener('click', () => {
        btnPedir.disabled = true;
        btnDetener.disabled = true;
        turnoComputadora(puntosJugadores[0]);
    });

    btnNuevoJuego.addEventListener('click', () => {
        inicializarJuego();
    });

    return {
        nuevoJuego : inicializarJuego
    }; 
})();








