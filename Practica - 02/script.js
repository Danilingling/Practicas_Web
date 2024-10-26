const tabla = document.getElementById('tabla');
const boton_reiniciar = document.getElementById('reiniciar');
const tabla_records = document.querySelector('#Tabla_tiempos tbody');

let jugador = 'X';
let estatus_tabla = ['','','','','','','','',''];
let juego_activado = true;  
let empezar_tiempo;
let puntajes = [];
let turno_jugador = true;

function CrearTabla() {
    for (let i = 0; i < 9; i++) {
        const celda = document.createElement('div');
        celda.classList.add('celda');
        celda.dataset.index = i;
        celda.addEventListener('click', Click);
        tabla.appendChild(celda);
    }
}

function Click(event) {
    const index = event.target.dataset.index;

    if (!juego_activado || estatus_tabla[index] !== '' || !turno_jugador) {
        return;
    }

    estatus_tabla[index] = jugador;
    event.target.textContent = jugador;

    if (!empezar_tiempo) {
        empezar_tiempo = Date.now();
    }

    if (verificar_ganador()) {
        juego_activado = false;
        const tiempo_tomado = (Date.now() - empezar_tiempo) / 1000;  /* Segundos */
        const nombre_jugador = prompt("Felicidades!! Ingresa tu nombre para registrarlo:");
        if (nombre_jugador) {
            actualizar_puntaje(nombre_jugador, tiempo_tomado);
            actualizar(); 
        }
        
    } else if (estatus_tabla.every(cell => cell !== '')) {
        alert('Es un empate');
        juego_activado = false;
    } else {
        turno_jugador = false;
        jugador = 'O';
        setTimeout(movimiento_computadora, 800);
    }
}

function movimiento_computadora() {
    let celdas_disponibles = estatus_tabla.map((cell, index) => cell === '' ? index : null).filter(v => v !== null);
    if (celdas_disponibles.length === 0) {
        return;
    }

    const randomIndex = celdas_disponibles[Math.floor(Math.random() * celdas_disponibles.length)];
    estatus_tabla[randomIndex] = jugador;
    document.querySelector(`.celda[data-index='${randomIndex}']`).textContent = jugador;

    if (verificar_ganador()) {
        juego_activado = false;
        alert("La IA te ganó, ¡qué más podías hacer! :(");
    } else if (estatus_tabla.every(cell => cell !== '')) {
        alert('¡EMPATE!');
        juego_activado = false;
    } else {
        jugador = 'X';
        turno_jugador = true;
    }
}

function verificar_ganador() {
    const combinaciones_para_ganar = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    return combinaciones_para_ganar.some(combinacion => {
        const [a, b, c] = combinacion;
        return estatus_tabla[a] && estatus_tabla[a] === estatus_tabla[b] && estatus_tabla[a] === estatus_tabla[c];
    });
}

function actualizar_puntaje(nombre_jugador, tiempo_tomado) {
    const fecha_hora = new Date().toISOString().split('T')[0];  /* Fecha en formato DD/MM/AA */
    puntajes.push({
        nombre: nombre_jugador,
        tiempo: `${tiempo_tomado.toFixed(1)}s`,  /* Formatear a 1 decimal con 's' de segundos */
        fecha_hora
    });

    puntajes.sort((a, b) => parseFloat(a.tiempo) - parseFloat(b.tiempo));  /* Comparar tiempos */

    if (puntajes.length > 10) {
        puntajes.pop();  /* Los diez mejores */
    }
    localStorage.setItem('TicTacToe_Puntajes', JSON.stringify(puntajes));
}

function actualizar() {
    tabla_records.innerHTML = '';  
    
    const encabezado = document.createElement('tr');
    encabezado.innerHTML = `<td>#</td><td>Nombre</td><td>Tiempo</td><td>Fecha</td>`;
    tabla_records.appendChild(encabezado);

    puntajes.forEach((puntaje, index) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `<td>${index + 1}</td><td>${puntaje.nombre}</td><td>${puntaje.tiempo}</td><td>${puntaje.fecha_hora}</td>`;
        tabla_records.appendChild(fila);
    });
}

function reiniciar_juego() {
    estatus_tabla = ['','','','','','','','',''];
    jugador = 'X';
    juego_activado = true;
    turno_jugador = true;
    empezar_tiempo = null;

    document.querySelectorAll('.celda').forEach(celda => {
        celda.textContent = '';  
    });
}

function cargar_puntajes() {
    const puntajes_guardados = localStorage.getItem('TicTacToe_Puntajes');
    if (puntajes_guardados) {
        puntajes = JSON.parse(puntajes_guardados);
        actualizar();
    }
}

function iniciar_juego() {
    CrearTabla();
    cargar_puntajes();
}

boton_reiniciar.addEventListener('click', reiniciar_juego);
iniciar_juego();
