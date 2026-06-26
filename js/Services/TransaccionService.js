import { Categoria } from '../Entities/Categoria.js';
import { Transaccion } from '../Entities/Transaccion.js';

const categorias = [
    new Categoria(1, 'Supermercado', 'Gastos de alimentación y productos de primera necesidad', -1),
    new Categoria(2, 'Transporte', 'Gastos de transporte y combustible', -1),
    new Categoria(3, 'Deposito', 'Ingresos por depósitos', 1)
];

const transacciones = [
    new Transaccion(1, 'Compra de supermercado',  12500 , '2026-01-01', '2026-01-02', categorias[0]),
    new Transaccion(2, 'Gasolina', 8500, '2026-01-03', '2026-01-04', categorias[1]),
    new Transaccion(3, 'Depósito de sueldo', 50000, '2026-01-05', '2026-01-06', categorias[2])
];

const categoriasList = document.getElementById('categoriasList');
const transaccionesList = document.getElementById('transaccionesList');
const formCategoria = document.getElementById('formCategoria');
const inputCategoria = document.getElementById('categoriaNombre');

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

        const tdTipo = document.createElement('td');
        tdTipo.textContent = categoria.factor; 
        tr.appendChild(tdId);
        tr.appendChild(tdNombre);
        tr.appendChild(tdDescripcion);
        tr.appendChild(tdTipo);

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

function agregarCategoria(event) {
    event.preventDefault();

    const nombre = inputCategoria.value.trim();
    if (!nombre) return;

    categorias.push(new Categoria(Date.now(), nombre));

    inputCategoria.value = '';
    renderCategorias();
}

if (formCategoria) {
    formCategoria.addEventListener('submit', agregarCategoria);
}

renderCategorias();
renderTransacciones();


