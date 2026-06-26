import { Categoria } from '../Entities/Categoria.js';
import { Transaccion } from '../Entities/Transaccion.js';

const CATEGORY_STORAGE_KEY = 'fintrack.categorias';
const TRANSACTION_STORAGE_KEY = 'fintrack.transacciones';

const seedCategorias = [
    new Categoria(1, 'Supermercado', 'Gastos de alimentación y productos de primera necesidad', -1),
    new Categoria(2, 'Transporte', 'Gastos de transporte y combustible', -1),
    new Categoria(3, 'Deposito', 'Ingresos por depósitos', 1)
];

const form = document.getElementById('formTransaccion');
const inputId = document.getElementById('transaccionId');
const inputDescripcion = document.getElementById('transaccionDescripcion');
const inputMonto = document.getElementById('transaccionMonto');
const inputFecha = document.getElementById('transaccionFecha');
const inputCategoria = document.getElementById('transaccionCategoria');
const inputEsCuota = document.getElementById('transaccionEsCuota');
const inputCantidadCuotas = document.getElementById('transaccionCantidadCuotas');
const cuotasContainer = document.getElementById('cuotasContainer');
const submitButton = document.getElementById('submitTransaccion');
const cancelButton = document.getElementById('cancelarEdicionTransaccion');
const tableBody = document.getElementById('transaccionesTablaBody');

let categorias = [];
let transacciones = [];

function cargarCategorias() {
    const guardadas = localStorage.getItem(CATEGORY_STORAGE_KEY);

    if (guardadas) {
        try {
            const parsed = JSON.parse(guardadas);
            categorias = parsed.map((categoria) => new Categoria(
                categoria.id,
                categoria.nombre,
                categoria.descripcion,
                categoria.factor
            ));
            return;
        } catch (error) {
            console.error('No se pudieron cargar las categorías', error);
        }
    }

    categorias = seedCategorias.map((categoria) => new Categoria(
        categoria.id,
        categoria.nombre,
        categoria.descripcion,
        categoria.factor
    ));
    localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(categorias));
}

function cargarTransacciones() {
    const guardadas = localStorage.getItem(TRANSACTION_STORAGE_KEY);

    if (guardadas) {
        try {
            const parsed = JSON.parse(guardadas);
            transacciones = parsed.map((transaccion) => new Transaccion(
                transaccion.id,
                transaccion.descripcion,
                transaccion.monto,
                transaccion.fechaRegistro,
                transaccion.fechaMovimiento,
                categorias.find((categoria) => categoria.id === transaccion.categoria?.id) || null,
                transaccion.esCuota ?? false,
                transaccion.cantCuotas ?? transaccion.cantidadCuotas ?? 1
            ));
            return;
        } catch (error) {
            console.error('No se pudieron cargar las transacciones', error);
        }
    }

    transacciones = [];
}

function guardarTransacciones() {
    localStorage.setItem(TRANSACTION_STORAGE_KEY, JSON.stringify(transacciones));
}

function renderCategoriasSelect() {
    if (!inputCategoria) return;

    inputCategoria.innerHTML = '<option value="">Seleccione una categoría</option>';

    categorias.forEach((categoria) => {
        const option = document.createElement('option');
        option.value = categoria.id;
        option.textContent = categoria.nombre;
        inputCategoria.appendChild(option);
    });
}

function resetFormulario() {
    if (form) {
        form.reset();
    }

    if (inputFecha) {
        inputFecha.value = new Date().toISOString().split('T')[0];
    }

    if (inputId) {
        inputId.value = '';
    }

    if (cuotasContainer) {
        cuotasContainer.hidden = true;
    }

    if (inputCantidadCuotas) {
        inputCantidadCuotas.value = '1';
    }

    if (submitButton) {
        submitButton.textContent = 'Guardar transacción';
    }

    if (cancelButton) {
        cancelButton.hidden = true;
    }
}

function renderTransacciones() {
    if (!tableBody) return;

    tableBody.innerHTML = '';

    if (transacciones.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="6">No hay transacciones cargadas todavía.</td>';
        tableBody.appendChild(row);
        return;
    }

    transacciones.forEach((transaccion) => {
        const row = document.createElement('tr');
        const fecha = new Date(transaccion.fechaMovimiento).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        row.innerHTML = `
            <td>${transaccion.id}</td>
            <td>${transaccion.descripcion}</td>
            <td>$ ${transaccion.monto}</td>
            <td>${transaccion.esCuota ? `$ ${(transaccion.monto / (transaccion.cantCuotas || 1)).toFixed(2)}` : '-'}</td>
            <td>${fecha}</td>
            <td>${transaccion.categoria ? transaccion.categoria.nombre : 'Sin categoría'}</td>
            <td>${transaccion.esCuota ? `${transaccion.cantCuotas || 1} cuota(s)` : 'No'}</td>
            <td>
                <div class="actions-cell">
                    <button type="button" class="edit-btn" data-id="${transaccion.id}">Editar</button>
                    <button type="button" class="delete-btn" data-id="${transaccion.id}">Eliminar</button>
                </div>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

function prepararEdicion(id) {
    const transaccion = transacciones.find((item) => item.id === id);
    if (!transaccion) return;

    if (inputId) {
        inputId.value = transaccion.id;
    }
    if (inputDescripcion) {
        inputDescripcion.value = transaccion.descripcion;
    }
    if (inputMonto) {
        inputMonto.value = transaccion.monto;
    }
    if (inputFecha) {
        inputFecha.value = transaccion.fechaMovimiento;
    }
    if (inputCategoria) {
        inputCategoria.value = transaccion.categoria?.id || '';
    }
    if (inputEsCuota) {
        inputEsCuota.checked = Boolean(transaccion.esCuota);
    }
    if (inputCantidadCuotas) {
        inputCantidadCuotas.value = transaccion.cantCuotas ?? transaccion.cantidadCuotas ?? '1';
    }
    if (cuotasContainer) {
        cuotasContainer.hidden = !Boolean(transaccion.esCuota);
    }
    if (submitButton) {
        submitButton.textContent = 'Actualizar transacción';
    }
    if (cancelButton) {
        cancelButton.hidden = false;
    }
}

function guardarTransaccion(event) {
    event.preventDefault();

    const descripcion = inputDescripcion.value.trim();
    const monto = Number(inputMonto.value);
    const fechaMovimiento = inputFecha.value;
    const categoriaId = Number(inputCategoria.value);
    const esCuota = Boolean(inputEsCuota.checked);
    const cantCuotas = esCuota ? Number(inputCantidadCuotas?.value || 1) : 1;

    if (!descripcion || !monto || !fechaMovimiento || !categoriaId) return;

    const categoria = categorias.find((item) => item.id === categoriaId);
    const idActual = inputId.value ? Number(inputId.value) : null;
    const fechaRegistro = new Date().toISOString().split('T')[0];

    if (idActual) {
        const transaccionExistente = transacciones.find((item) => item.id === idActual);
        if (transaccionExistente) {
            transaccionExistente.descripcion = descripcion;
            transaccionExistente.monto = monto;
            transaccionExistente.fechaRegistro = fechaRegistro;
            transaccionExistente.fechaMovimiento = fechaMovimiento;
            transaccionExistente.categoria = categoria;
            transaccionExistente.esCuota = esCuota;
            transaccionExistente.cantCuotas = cantCuotas;
        }
    } else {
        transacciones.push(new Transaccion(
            Date.now(),
            descripcion,
            monto,
            fechaRegistro,
            fechaMovimiento,
            categoria,
            esCuota,
            cantCuotas
        ));
    }

    guardarTransacciones();
    renderTransacciones();
    resetFormulario();
}

function eliminarTransaccion(id) {
    transacciones = transacciones.filter((item) => item.id !== id);
    guardarTransacciones();
    renderTransacciones();
}

function inicializar() {
    cargarCategorias();
    cargarTransacciones();
    renderCategoriasSelect();
    resetFormulario();
    renderTransacciones();
}

if (form) {
    form.addEventListener('submit', guardarTransaccion);
}

if (inputEsCuota && cuotasContainer) {
    inputEsCuota.addEventListener('change', () => {
        cuotasContainer.hidden = !inputEsCuota.checked;
    });
}

if (cancelButton) {
    cancelButton.addEventListener('click', resetFormulario);
}

tableBody?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) return;

    const id = Number(target.dataset.id);
    if (target.classList.contains('edit-btn')) {
        prepararEdicion(id);
    }

    if (target.classList.contains('delete-btn')) {
        eliminarTransaccion(id);
    }
});

inicializar();
