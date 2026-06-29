const urlCdn = 'https://cdn.thesimpsonsapi.com/500';
const urlApi = 'https://thesimpsonsapi.com/api/characters';
const urlDetalle = 'https://thesimpsonsapi.com/api/characters/';

const listaPersonajes = [];

function armarImagen(ruta) {
  return urlCdn + ruta;
}

async function cargarPersonajes() {
  try {
    const respuesta = await fetch(urlApi);

    if (!respuesta.ok) {
      throw new Error("Error " + respuesta.status + ": no se pudo cargar la lista de personajes.");
    }

    const data = await respuesta.json();
    const personajes = data.results;

    personajes.forEach(function(personaje) {
      listaPersonajes.push(personaje);
    });

    renderizarTarjetas(listaPersonajes);

  } catch (error) {
    console.error(error.message);
  }
}

cargarPersonajes();

function limpiarResultados() {
  document.getElementById('cardsContainer').innerHTML = '';
  document.getElementById('mensaje-no-resultados').style.display = 'none';
  document.getElementById('error-api').style.display = 'none';
}

function obtenerClaseEstado(estado) {
  if (estado === 'Alive') {
    return 'status-alive';
  } else {
    return 'status-deceased';
  }
}

function renderizarTarjetas(lista) {
  limpiarResultados();

  if (lista.length === 0) {
    document.getElementById('mensaje-no-resultados').style.display = 'block';
    return;
  }

  const contenedor = document.getElementById('cardsContainer');

  lista.forEach(function(personaje) {
    const columna = document.createElement('div');
    columna.className = 'col-md-4 mb-4';

    const claseEstado = obtenerClaseEstado(personaje.status);

    columna.innerHTML = `
      <div class="card h-100">
        <img src="${armarImagen(personaje.portrait_path)}" class="card-img-top" alt="${personaje.name}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${personaje.name}</h5>
          <p class="card-text mb-1"><strong>Ocupación:</strong> ${personaje.occupation}</p>
          <p class="card-text mb-3">
            <strong>Estado:</strong>
            <span class="${claseEstado}">${personaje.status}</span>
          </p>
          <button class="btn btn-warning mt-auto btn-detalle" data-id="${personaje.id}">
            Ver detalle
          </button>
        </div>
      </div>
    `;

    contenedor.appendChild(columna);
  });
}

function filtrarPersonajes() {
  const textoBuscado = document.getElementById('searchInput').value;

  if (textoBuscado.trim() === '') {
    return;
  }

  const textoEnMinusculas = textoBuscado.toLowerCase();

  const resultados = listaPersonajes.filter(function(personaje) {
    const nombreMinusculas = personaje.name.toLowerCase();
    return nombreMinusculas.includes(textoEnMinusculas);
  });

  renderizarTarjetas(resultados);
}

document.getElementById('searchBtn').addEventListener('click', filtrarPersonajes);

document.getElementById('searchInput').addEventListener('keyup', function(evento) {
  if (evento.key === 'Enter') {
    filtrarPersonajes();
  }
});

document.getElementById('clearBtn').addEventListener('click', function() {
  document.getElementById('searchInput').value = '';
  renderizarTarjetas(listaPersonajes);
});

async function obtenerDetallePersonaje(id) {
  try {
    const respuesta = await fetch(urlDetalle + id);

    if (!respuesta.ok) {
      throw new Error("Error " + respuesta.status + ": no se pudo cargar el detalle del personaje.");
    }

    const datos = await respuesta.json();
    mostrarModal(datos);

  } catch (error) {
    console.error("Hubo un error al buscar el detalle:", error.message);
  }
}

function obtenerFrase(personaje) {
  if (personaje.phrases && personaje.phrases.length > 0) {
    return '"' + personaje.phrases[0] + '"';
  } else {
    return 'Sin frase registrada.';
  }
}

function verificarDato(dato) {
  if (dato) {
    return dato;
  } else {
    return 'Desconocido';
  }
}

function mostrarModal(personaje) {
  const frase = obtenerFrase(personaje);

  document.getElementById('titulo-modal').textContent = personaje.name;
  document.getElementById('imagenModal').src = armarImagen(personaje.portrait_path);
  document.getElementById('imagenModal').alt = personaje.name;
  document.getElementById('edad-modal').textContent = verificarDato(personaje.age);
  document.getElementById('nacimientoModal').textContent = verificarDato(personaje.birthdate);
  document.getElementById('genero-modal').textContent = verificarDato(personaje.gender);
  document.getElementById('ocupacionModal').textContent = verificarDato(personaje.occupation);
  document.getElementById('estado-modal').textContent = personaje.status;
  document.getElementById('fraseModal').textContent = frase;

  const modal = new bootstrap.Modal(document.getElementById('modal-detalle'));
  modal.show();
}

document.getElementById('cardsContainer').addEventListener('click', function(evento) {
  if (evento.target.classList.contains('btn-detalle')) {
    const idBoton = evento.target.getAttribute('data-id');
    obtenerDetallePersonaje(idBoton);
  }
});