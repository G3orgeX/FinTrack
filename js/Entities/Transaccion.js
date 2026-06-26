export class Transaccion {
    constructor(id, descripcion, monto, fechaRegistro, fechaMovimiento, categoria, esCuota = false, cantCuotas = 1) {
        this.id = id;
        this.descripcion = descripcion;
        this.monto = monto;
        this.fechaRegistro = fechaRegistro;
        this.fechaMovimiento = fechaMovimiento;
        this.categoria = categoria;
        this.esCuota = esCuota;
        this.cantCuotas = cantCuotas;
    }
}