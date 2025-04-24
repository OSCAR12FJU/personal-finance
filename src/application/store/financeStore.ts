import { IncomeModel } from "../../domains/models/income_model.js";
import path from "path";
import fs from "fs";

export interface FinanceItem {
  description: string;
  amount: number;
  date: Date | string;
  typeExpense?: boolean;
}

interface MonthyData {
  ingresos: IncomeModel[];
  gastos: FinanceItem[];
  totalIngresos: number;
  totalGastos: number;
}

type FinanceData = Record<string, MonthyData>; // Por ejemplo: { "2024-08": {...} }

class FinanceStore {
  private static instance: FinanceStore;
  private dirPath: string;
  private filePath: string;
  private data: FinanceData = {};

  public static getInstance(): FinanceStore {
    if (!FinanceStore.instance) {
      FinanceStore.instance = new FinanceStore();
    }
    return FinanceStore.instance;
  }

  private constructor() {
    this.dirPath = path.join(process.cwd(), "database");
    this.filePath = path.join(this.dirPath, "finance_data.json");

    this.ensureFileExists();
    this.loadData();
  }
  //VErificación de existencia de la carpeta y el archivo
  private ensureFileExists(): void {
    if (!fs.existsSync(this.dirPath)) {
      fs.mkdirSync(this.dirPath, { recursive: true });
    }

    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify({}, null, 2), "utf-8");
    }
  }
  ///////////////////////////

  //Funciones que incializa las propiedades de la esturctura, usando el metodo para leer lo qeu hay en el archivo. 
  private loadData(): void {
    this.data = JSON.parse(fs.readFileSync(this.filePath, "utf-8"));
  }

  //Funcion para actualizar el arch de JSON, no metiendo sino lo que actualmente en ese momento tiene la pripiedad data que esta en la estructura se agrega al arch JSON.
  private saveData(): void {
    fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), "utf-8");
  }
  /////////////////////////
  
  //En esta función como por defecto el metodo DATE() nos devuelve una esturctura rara y confusa, aca la editamos y tomamos la data de el DATE que queremos.(esto es para usarlos como key)
  private getMonthKey(date: Date | string): string {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }

  //Hacemos otra conversión de la fecha pero más exacta. (los metodos qeu usamos son metodos especificos de la estructura DATE())
  private getDiasEnMes(year: number, month: number): number {
    return new Date(year, month, 0).getDate();
  }


  agregarIngreso({ description, amount, date, typeIncome }: IncomeModel): void {
    if (!description || !amount || !date) {
      console.log("Error en parámetros:", description, amount, date);
      return;
    }

    const monthKey = this.getMonthKey(date);
    //Si el mes el cual estamos agregando la data, no existe dentro del objeto declaramos una propiedad más con ese valor de date instanciando todo pero vacio.
    if (!this.data[monthKey]) {
      this.data[monthKey] = {
        ingresos: [],
        gastos: [],
        totalIngresos: 0,
        totalGastos: 0
      };
    }

    const newIncome: IncomeModel = {
      description,
      amount,
      date,
      typeIncome
    };

    //Aca si pasa la condición tomamos el objeto principal y hacemos de especificación por nombre de la propiedad que queremos ingresar y insertar el valor
    this.data[monthKey].ingresos.push(newIncome);

    //Aca otra operación qeu hacemos haciendo la desturcturación al objeto principal es la operación de sumar los montos, osea tenemos otra popiedad la cual hacemos la cuenta, obvio guiandonos de lo qeu ingresamos.
    this.data[monthKey].totalIngresos += amount;

    this.saveData();
  }

  agregarGasto({ description, amount, date, typeExpense }: FinanceItem): void {
    if (!description || !amount || !date) {
      console.log("Error en parámetros:", description, amount, date);
      return;
    }

    const monthKey = this.getMonthKey(date);

    if (!this.data[monthKey]) {
      this.data[monthKey] = {
        ingresos: [],
        gastos: [],
        totalIngresos: 0,
        totalGastos: 0
      };
    }

    const newExpense: FinanceItem = {
      description,
      amount,
      date,
      typeExpense
    };

    this.data[monthKey].gastos.push(newExpense);
    this.data[monthKey].totalGastos += amount;

    this.saveData();
  }

  getIngresosDelMes(year: number, month: number): MonthyData {
    const key = `${year}-${String(month).padStart(2, "0")}`;
    return (
      this.data[key] || {
        ingresos: [],
        gastos: [],
        totalIngresos: 0,
        totalGastos: 0
      }
    );
  }

  getGastosDelMes(year: number, month: number): MonthyData {
    const key = `${year}-${String(month).padStart(2, "0")}`;
    return (
      this.data[key] || {
        ingresos: [],
        gastos: [],
        totalIngresos: 0,
        totalGastos: 0
      }
    );
  }

  getBalanceDelMes(year: number, month: number): number {
    const data = this.getIngresosDelMes(year, month);
    return data.totalIngresos - data.totalGastos;
  }

  promediosMensual(
    year: number,
    month: number,
    limiteMensual: number
  ): {
    excedido: boolean;
    gastosTotal: number;
    promedioDiario: number;
    diaEnMes: number;
  } {
    const diaEnMes = this.getDiasEnMes(year, month);
    const gastosTotal = this.getGastosDelMes(year, month).totalGastos;
    const promedioDiario = gastosTotal / diaEnMes;

    return {
      excedido: gastosTotal > limiteMensual,
      gastosTotal,
      promedioDiario,
      diaEnMes
    };
  }

  getTotalIngresos(): number {
    return Object.values(this.data).reduce(
      (sum, month) => sum + month.totalIngresos,
      0
    );
  }

  getTotalGastos(): number {
    return Object.values(this.data).reduce(
      (sum, month) => sum + month.totalGastos,
      0
    );
  }

  reset(): void {
    this.data = {};
    this.saveData();
  }
}

// Instancia única global
const useFinanceStore = FinanceStore.getInstance();

export default useFinanceStore;



//CODIGO A COMPARAR
// import { IncomeModel } from "../../domains/models/income_model.js";
// import path from "path";
// import fs from "fs";


// export interface FinanceItem{
//   description: string;
//   amount: number;
//   date: Date | string;
//   typeExpense?: boolean; 
// }

// interface MonthyData{
//   total: number;
//   items: FinanceItem[];
// }

// class FinanceStore {
//     private static instance: FinanceStore;
//     private dirPath: string;
//     private filePathExpense: string;
//     private filePathIncome: string;

//     private ingresos: IncomeModel[] = [];
//     private gastos: FinanceItem[] = [];
//     private ingresosPorMes: Record<string, MonthyData> = {};
//     private gastosPorMes: Record<string, MonthyData> = {};

//     public static getInstance() : FinanceStore{
//       if(!FinanceStore.instance){
//         FinanceStore.instance = new FinanceStore();
//       }
//       return FinanceStore.instance;
//     }
    

//     //Creamos la estructura de las redireccón que leemos
//     private constructor() {
//       this.dirPath = path.join(process.cwd(), "database");
//       this.filePathExpense = path.join(this.dirPath, "expense_data.json");
//       this.filePathIncome = path.join(this.dirPath, "income_data.json");
  
//       this.ensureFilesExist();
//       this.loadData();
//     }
//     //Validación de existencia de los archivos
//     private ensureFilesExist(): void {
//       if (!fs.existsSync(this.dirPath)) {
//         fs.mkdirSync(this.dirPath, { recursive: true });
//       }
  
//       if (!fs.existsSync(this.filePathExpense)) {
//         fs.writeFileSync(this.filePathExpense, JSON.stringify([], null, 2), "utf-8");
//       }
  
//       if (!fs.existsSync(this.filePathIncome)) {
//         fs.writeFileSync(this.filePathIncome, JSON.stringify([], null, 2), "utf-8");
//       }
//     }

//     //Pedimos toda la data que haya en los archs JSON para cargarlo en los array que actuan como almacenameinto local
  
//     private loadData(): void {
//       this.gastos = JSON.parse(fs.readFileSync(this.filePathExpense, "utf-8"));
//       this.ingresos = JSON.parse(fs.readFileSync(this.filePathIncome, "utf-8"));
//     }

//     _getMesKey(dataString: Date | string): string{
//       const date = new Date(dataString);
//       return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
//     }
//     _getDiasEnMes(year:number, month:number):number{
//       return new Date(year, month, 0).getDate();
//     }
  
//     agregarIngreso({description, amount, date ,typeIncome}: IncomeModel):void{
//       if(!description || !amount || !date){
//         console.log("el error esta siendo en los parametros que recibimos:", date);
//       }

//       const monthKey = this._getMesKey(date);
//       if(!this.gastosPorMes[monthKey]){
//         this.gastosPorMes[monthKey] = {total: 0, items:[]};
//       }

//       const newIncome:IncomeModel = {
//         description,
//         amount,
//         date,
//         typeIncome
//       }

//       this.ingresos.push(newIncome);
//       this.ingresosPorMes[monthKey].items.push(newIncome);
//       this.ingresosPorMes[monthKey].total += amount;
//       console.log(this.ingresos)

//     }
  
//     agregarGasto({description, amount, date , typeExpense}: FinanceItem ): void {
//       if(!description || !amount || !date){
//         console.log("el error esta siendo en los parametros que recibimos:", date);
//       }

//       const monthKey = this._getMesKey(date);
//       if(!this.gastosPorMes[monthKey]){
//         this.gastosPorMes[monthKey] = {total: 0, items:[]};
//       }

//       const nuevoGasto:FinanceItem = {
//         description,
//         amount,
//         date,
//         typeExpense
//       }

//       this.gastos.push(nuevoGasto);
//       this.gastosPorMes[monthKey].items.push(nuevoGasto);
//       this.gastosPorMes[monthKey].total += amount;
//       console.log(this.gastos)
//     }
  
//     getIngresosDelMes(year: number, month:number):MonthyData {
//       const monthKey = `${year}-${String(month).padStart(2, '0')}`;
//       return this.ingresosPorMes[monthKey] || {total: 0, items:[]};
//     }

//     getGastosDelMes(year:number, month:number): MonthyData {
//       const monthKey = `${year}-${String(month).padStart(2, '0')}`;

//       return this.gastosPorMes[monthKey] || {total: 0, items:[]};
//     }

//     getBalanceDelMes(year:number, month:number): number {
//       const ingresos = this.getIngresosDelMes(year, month).total;
//       const gastos = this.getGastosDelMes(year, month).total;
//       return ingresos - gastos;
//     }

//     promediosMensual(year:number, month:number, limiteMensual:number):{excedido: boolean;
//       gastosTotal: number;
//       promedioDiario: number;
//       diaEnMes: number;}{
//       const diaEnMes = this._getDiasEnMes(year, month);
//       const gastosTotal = this.getGastosDelMes(year, month).total;
//       const promedioDiario = gastosTotal/diaEnMes;

//       return{
//         excedido: gastosTotal > limiteMensual,
//         gastosTotal, 
//         promedioDiario,
//         diaEnMes
//       }
//     }


//     ////////////////////////////////////////
//     getTotalIngresos():number {
//       return this.ingresos.reduce((sum, item) => sum + item.amount, 0);
//     }
  
//     getTotalGastos():number{
//       return this.gastos.reduce((sum, item) => sum + item.amount, 0); 
//     }
  
//     // getBalance() {
//     //   return this.getTotalIngresos() - this.getTotalGastos();
//     // }
  
//     // Método opcional para resetear
//     reset():void{
//       this.ingresos = [];
//       this.gastos = [];
//       this.ingresosPorMes = {};
//       this.gastosPorMes = {};
//     }
//   }
  
//   // Instancia única global
//   const useFinanceStore = FinanceStore.getInstance();
  
// export default useFinanceStore;