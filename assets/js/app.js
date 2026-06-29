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