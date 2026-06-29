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
    
    data.forEach(function(personaje) {
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
        <img src="${armarImagen(personaje.image)}" class="card-img-top" alt="${personaje.name}">
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