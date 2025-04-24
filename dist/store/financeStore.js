class FinanceStore {
    static instance;
    ingresos = [];
    gastos = [];
    ingresosPorMes = {};
    gastosPorMes = {};
    static getInstance() {
        if (!FinanceStore.instance) {
            FinanceStore.instance = new FinanceStore();
        }
        return FinanceStore.instance;
    }
    constructor() { }
    _getMesKey(dataString) {
        const date = new Date(dataString);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }
    _getDiasEnMes(year, month) {
        return new Date(year, month, 0).getDate();
    }
    agregarIngreso({ description, amount, date, typeIncome }) {
        if (!description || !amount || !date) {
            console.log("el error esta siendo en los parametros que recibimos:", date);
        }
        const monthKey = this._getMesKey(date);
        if (!this.gastosPorMes[monthKey]) {
            this.gastosPorMes[monthKey] = { total: 0, items: [] };
        }
        const newIncome = {
            description,
            amount,
            date,
            typeIncome
        };
        this.ingresos.push(newIncome);
        this.ingresosPorMes[monthKey].items.push(newIncome);
        this.ingresosPorMes[monthKey].total += amount;
        console.log(this.ingresos);
        // const monthKey = this._getMesKey(date);
        // if(!this.ingresosPorMes[monthKey]){
        //   this.ingresosPorMes[monthKey] = {total: 0, items: []}
        // }
        // const nuevoIngreso: FinanceItem = {
        //   description,
        //   amount,
        //   date
        // }
        // this.ingresos.push(nuevoIngreso);
        // this.ingresosPorMes[monthKey].items.push(nuevoIngreso);
        // this.ingresosPorMes[monthKey].total += amount;
        // console.log("ingresos por mes",this.ingresosPorMes[monthKey].total)
    }
    agregarGasto({ description, amount, date, typeExpense }) {
        if (!description || !amount || !date) {
            console.log("el error esta siendo en los parametros que recibimos:", date);
        }
        const monthKey = this._getMesKey(date);
        if (!this.gastosPorMes[monthKey]) {
            this.gastosPorMes[monthKey] = { total: 0, items: [] };
        }
        const nuevoGasto = {
            description,
            amount,
            date,
            typeExpense
        };
        this.gastos.push(nuevoGasto);
        this.gastosPorMes[monthKey].items.push(nuevoGasto);
        this.gastosPorMes[monthKey].total += amount;
        console.log(this.gastos);
    }
    getIngresosDelMes(year, month) {
        const monthKey = `${year}-${String(month).padStart(2, '0')}`;
        return this.ingresosPorMes[monthKey] || { total: 0, items: [] };
    }
    getGastosDelMes(year, month) {
        const monthKey = `${year}-${String(month).padStart(2, '0')}`;
        return this.gastosPorMes[monthKey] || { total: 0, items: [] };
    }
    getBalanceDelMes(year, month) {
        const ingresos = this.getIngresosDelMes(year, month).total;
        const gastos = this.getGastosDelMes(year, month).total;
        return ingresos - gastos;
    }
    promediosMensual(year, month, limiteMensual) {
        const diaEnMes = this._getDiasEnMes(year, month);
        const gastosTotal = this.getGastosDelMes(year, month).total;
        const promedioDiario = gastosTotal / diaEnMes;
        return {
            excedido: gastosTotal > limiteMensual,
            gastosTotal,
            promedioDiario,
            diaEnMes
        };
    }
    ////////////////////////////////////////
    getTotalIngresos() {
        return this.ingresos.reduce((sum, item) => sum + item.amount, 0);
    }
    getTotalGastos() {
        return this.gastos.reduce((sum, item) => sum + item.amount, 0);
    }
    // getBalance() {
    //   return this.getTotalIngresos() - this.getTotalGastos();
    // }
    // Método opcional para resetear
    reset() {
        this.ingresos = [];
        this.gastos = [];
        this.ingresosPorMes = {};
        this.gastosPorMes = {};
    }
}
// Instancia única global
const useFinanceStore = FinanceStore.getInstance();
export default useFinanceStore;
