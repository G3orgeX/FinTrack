export class Transaccion {
    constructor(id,descripcion, monto, fechaRegistro, fechaMovimiento, categoria) {
        this.id = id;
        this.descripcion = descripcion;
        this.monto = monto;
        this.fechaRegistro = fechaRegistro;
        this.fechaMovimiento = fechaMovimiento;
        this.categoria = categoria;
    }
}