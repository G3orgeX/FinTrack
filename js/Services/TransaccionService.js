import { Categoria } from '../Entities/Categoria.js';
import { Transaccion } from '../Entities/Transaccion.js';

const STORAGE_KEY = 'fintrack.categorias';
const seedCategorias = [
    new Categoria(1, 'Supermercado', 'Gastos de alimentación y productos de primera necesidad', -1),
    new Categoria(2, 'Transporte', 'Gastos de transporte y combustible', -1),
    new Categoria(3, 'Deposito', 'Ingresos por depósitos', 1)
];

let categorias = [];

const transacciones = [
    new Transaccion(1, 'Compra de supermercado', 12500, '2026-01-01', '2026-01-02', seedCategorias[0]),
    new Transaccion(2, 'Gasolina', 8500, '2026-01-03', '2026-01-04', seedCategorias[1]),
    new Transaccion(3, 'Depósito de sueldo', 50000, '2026-01-05', '2026-01-06', seedCategorias[2])
];

const categoriasList = document.getElementById('categoriasList');
const transaccionesList = document.getElementById('transaccionesList');
const formCategoria = document.getElementById('formCategoria');
const inputNombre = document.getElementById('categoriaNombre');
const inputDescripcion = document.getElementById('categoriaDescripcion');
const inputFactor = document.getElementById('categoriaFactor');
const inputCategoriaId = document.getElementById('categoriaId');
const submitCategoriaButton = document.getElementById('submitCategoria');
const cancelButton = document.getElementById('cancelarEdicion');

function cargarCategorias() {
    const datosGuardados = localStorage.getItem(STORAGE_KEY);

    if (datosGuardados) {
        try {
            const categoriasParseadas = JSON.parse(datosGuardados);
            categorias = categoriasParseadas.map((categoria) => new Categoria(
                categoria.id,
                categoria.nombre,
                categoria.descripcion,
                categoria.factor
            ));
            return;
        } catch (error) {
            console.error('No se pudieron leer las categorías guardadas', error);
        }
    }

    categorias = seedCategorias.map((categoria) => new Categoria(
        categoria.id,
        categoria.nombre,
        categoria.descripcion,
        categoria.factor
    ));
    guardarCategorias();
}

function guardarCategorias() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categorias));
}

function resetearFormulario() {
    formCategoria.reset();
    inputCategoriaId.value = '';
    submitCategoriaButton.textContent = 'Agregar';
    cancelButton.hidden = true;
}

function prepararEdicion(id) {
    const categoria = categorias.find((item) => item.id === id);
    if (!categoria) return;

    inputCategoriaId.value = categoria.id;
    inputNombre.value = categoria.nombre;
    inputDescripcion.value = categoria.descripcion;
    inputFactor.value = categoria.factor > 0 ? 'positivo' : 'negativo';
    submitCategoriaButton.textContent = 'Guardar cambios';
    cancelButton.hidden = false;
}

function renderCategorias() {
    if (!categoriasList) return;

    categoriasList.innerHTML = '';

    categorias.forEach((categoria) => {
        const tr = document.createElement('tr');

        const tdId = document.createElement('td');
        tdId.textContent = categoria.id;

        const tdNombre = document.createElement('td');
        tdNombre.textContent = categoria.nombre;

        const tdDescripcion = document.createElement('td');
        tdDescripcion.textContent = categoria.descripcion;

        const tdFactor = document.createElement('td');
        tdFactor.textContent = categoria.factor > 0 ? 'Positivo' : 'Negativo';

        const tdAcciones = document.createElement('td');
        tdAcciones.className = 'actions-cell';

        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.className = 'edit-btn';
        btnEditar.addEventListener('click', () => prepararEdicion(categoria.id));

        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.className = 'delete-btn';
        btnEliminar.addEventListener('click', () => eliminarCategoria(categoria.id));

        tdAcciones.appendChild(btnEditar);
        tdAcciones.appendChild(btnEliminar);

        tr.appendChild(tdId);
        tr.appendChild(tdNombre);
        tr.appendChild(tdDescripcion);
        tr.appendChild(tdFactor);
        tr.appendChild(tdAcciones);

        categoriasList.appendChild(tr);
    });
}

function renderTransacciones() {
    if (!transaccionesList) return;

    transaccionesList.innerHTML = '';

    transacciones.forEach((transaccion) => {
        const li = document.createElement('li');
        const importe = transaccion.monto * transaccion.categoria.factor;
        const fecha = new Date(transaccion.fechaMovimiento).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        const tipo = transaccion.categoria.factor < 0 ? 'gasto' : 'ingreso';

        li.innerHTML = `${fecha} —
            <strong>${transaccion.descripcion}</strong> —
            ${transaccion.categoria.nombre} —
            <span class="${tipo}">$ ${importe}</span>
        `;
        transaccionesList.appendChild(li);
    });
}

function agregarOCambiarCategoria(event) {
    event.preventDefault();

    const nombre = inputNombre.value.trim();
    const descripcion = inputDescripcion.value.trim();
    const factorSeleccionado = inputFactor.value;

    if (!nombre || !descripcion || !factorSeleccionado) return;

    const factor = factorSeleccionado === 'positivo' ? 1 : -1;
    const idActual = inputCategoriaId.value;

    if (idActual) {
        const categoriaExistente = categorias.find((item) => item.id === Number(idActual));
        if (categoriaExistente) {
            categoriaExistente.nombre = nombre;
            categoriaExistente.descripcion = descripcion;
            categoriaExistente.factor = factor;
        }
    } else {
        categorias.push(new Categoria(Date.now(), nombre, descripcion, factor));
    }

    guardarCategorias();
    renderCategorias();
    resetearFormulario();
}

function eliminarCategoria(id) {
    categorias = categorias.filter((categoria) => categoria.id !== id);
    guardarCategorias();
    renderCategorias();

    if (inputCategoriaId.value && Number(inputCategoriaId.value) === id) {
        resetearFormulario();
    }
}

if (formCategoria) {
    formCategoria.addEventListener('submit', agregarOCambiarCategoria);
}

if (cancelButton) {
    cancelButton.addEventListener('click', resetearFormulario);
}

cargarCategorias();
renderCategorias();
renderTransacciones();


