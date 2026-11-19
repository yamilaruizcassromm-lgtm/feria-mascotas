// 1. Configuración de conexión a Supabase
const SUPABASE_URL = 'https://drsuhxaqkrnbuynswjzw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_cA23nFzIl4dstDZcw2XdTQ_EiLvj73R';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Referencias del DOM
const form = document.getElementById('form-animal');
const inputId = document.getElementById('animal-id');
const inputNombre = document.getElementById('nombre');
const inputEspecie = document.getElementById('especie');
const inputEdad = document.getElementById('edad_meses');
const inputFecha = document.getElementById('fecha_ingreso');
const inputEstado = document.getElementById('estado');
const btnCancelar = document.getElementById('btn-cancelar');
const tituloForm = document.getElementById('titulo-formulario');
const filtroEstado = document.getElementById('filtro-estado');
const tablaBody = document.getElementById('tabla-animales');

let animalesCargados = [];

// Cargar registros al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    obtenerAnimales();
});

// Escuchar cambios en el filtro
filtroEstado.addEventListener('change', () => {
    obtenerAnimales();
});

// Función para LISTAR y FILTRAR registros desde Supabase
async function obtenerAnimales() {
    const estadoSeleccionado = filtroEstado.value;

    let consulta = supabaseClient
        .from('animales')
        .select('*')
        .order('id', { ascending: true });

    if (estadoSeleccionado !== 'todos') {
        consulta = consulta.eq('estado', estadoSeleccionado);
    }

    const { data, error } = await consulta;

    if (error) {
        console.error('Error al cargar animales:', error.message);
        alert('Error al conectar con Supabase. Revisá tu URL y Key.');
        return;
    }

    animalesCargados = data || [];
    renderizarTabla(animalesCargados);
}

// Dibujar filas en la tabla HTML
function renderizarTabla(animales) {
    tablaBody.innerHTML = '';

    if (animales.length === 0) {
        tablaBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No hay registros para mostrar.</td></tr>';
        return;
    }

    animales.forEach(animal => {
        const fila = document.createElement('tr');
        const claseBadge = animal.estado === 'disponible' ? 'badge-disponible' : 'badge-adoptado';

        fila.innerHTML = `
            <td><strong>${escaparHTML(animal.nombre)}</strong></td>
            <td>${escaparHTML(animal.especie)}</td>
            <td>${animal.edad_meses} meses</td>
            <td>${animal.fecha_ingreso}</td>
            <td><span class="badge ${claseBadge}">${animal.estado}</span></td>
            <td>
                <button type="button" class="btn-editar" onclick="cargarParaEditar(${animal.id})">Editar</button>
                <button type="button" class="btn-eliminar" onclick="eliminarAnimal(${animal.id})">Eliminar</button>
            </td>
        `;
        tablaBody.appendChild(fila);
    });
}

// Evitar que caracteres especiales rompan la tabla HTML
function escaparHTML(texto) {
    return String(texto)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Función para CREAR o MODIFICAR un registro
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const datosAnimal = {
        nombre: inputNombre.value.trim(),
        especie: inputEspecie.value.trim(),
        edad_meses: parseInt(inputEdad.value, 10),
        fecha_ingreso: inputFecha.value,
        estado: inputEstado.value
    };

    const idEdicion = inputId.value;

    if (idEdicion) {
        const { error } = await supabaseClient
            .from('animales')
            .update(datosAnimal)
            .eq('id', idEdicion);

        if (error) {
            alert('Error al actualizar: ' + error.message);
            return;
        }
    } else {
        const { error } = await supabaseClient
            .from('animales')
            .insert([datosAnimal]);

        if (error) {
            alert('Error al registrar: ' + error.message);
            return;
        }
    }

    resetearFormulario();
    obtenerAnimales();
});

// Preparar el formulario con los datos del animal seleccionado
window.cargarParaEditar = (id) => {
    const animal = animalesCargados.find(item => item.id === id);
    if (!animal) return;

    inputId.value = animal.id;
    inputNombre.value = animal.nombre;
    inputEspecie.value = animal.especie;
    inputEdad.value = animal.edad_meses;
    inputFecha.value = animal.fecha_ingreso;
    inputEstado.value = animal.estado;

    tituloForm.textContent = 'Modificar Animal';
    btnCancelar.classList.remove('oculto');
};

// Cancelar edición
btnCancelar.addEventListener('click', resetearFormulario);

function resetearFormulario() {
    form.reset();
    inputId.value = '';
    tituloForm.textContent = 'Registrar Nuevo Animal';
    btnCancelar.classList.add('oculto');
}

// Función para ELIMINAR registro
window.eliminarAnimal = async (id) => {
    const confirmar = confirm('¿Estás seguro de eliminar este registro?');
    if (!confirmar) return;

    const { error } = await supabaseClient
        .from('animales')
        .delete()
        .eq('id', id);

    if (error) {
        alert('Error al eliminar: ' + error.message);
        return;
    }

    obtenerAnimales();
};