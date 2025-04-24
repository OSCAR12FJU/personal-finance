// import path from "path";
// import fs from "fs"
// import { FinanceItem } from "../../application/store/financeStore.js";
// import {pool} from "../db.js";
// import { IncomeModel } from "../models/income_model.js";


// export class FinanceRepository{
//     private static instance: FinanceRepository;
//     private filePath: string;

    
//     public static getInstance(): FinanceRepository{
//         if (!FinanceRepository.instance){
//             FinanceRepository.instance = new FinanceRepository();
//         }
//         return FinanceRepository.instance
//     }

    
//     private constructor(){
//        this.filePath = path.join(process.cwd(), "database","finance_data.json");

//        if(!fs.existsSync(this.filePath)){
//         fs.mkdirSync(path.dirname(this.filePath), {recursive:true});
//         fs.writeFileSync(this.filePath, JSON.stringify([],null, 2), "utf-8");
//        }

       
//     }
    
    

    //POR AHORA NO VAMOS A USAR BASE DE DATOS
    //Insertar a la BD
    // async insertIncome(item: IncomeModel):Promise<void>{
    //     const {description, amount, date, typeIncome} = item;

    //     const query = `INSERT INTO incomes (description, amount, date, type_income) VALUES ($1, $2, $3, $4)`;

    //     await pool.query(query, [description, amount, date, typeIncome ?? false]);
    // }

    // async insertExpense(item: FinanceItem):Promise<void>{
    //     const {description, amount, date, typeExpense} = item;

    //     const query = `INSERT INTO expenses (description, amount, date, type_expense) VALUES ($1, $2, $3, $4)`;

    //     await pool.query(query, [description, amount, date, typeExpense ?? false]);
    // }

    //Estas consultas son especificas de la BD
    // async getIncomeMonth(year:number,  month:number): Promise<IncomeModel[]>{
    //     const monthKey = `${year}-${String(month).padStart(2, '0')}`;

    //     const {rows} = await pool.query(
    //         `SELECT * from incomes WHERE TO_CHAR(date, 'YYY-MM') = $1`, [monthKey]
    //     );

    //     return rows
    // }

    // async getExpenseMonth(year:number,  month:number): Promise<FinanceItem[]>{
    //     const monthKey = `${year}-${String(month).padStart(2, '0')}`;

    //     const {rows} = await pool.query(
    //         `SELECT * from expenses WHERE TO_CHAR(date, 'YYY-MM') = $1`, [monthKey]
    //     );

    //     return rows
    // }

    // async getIncome(): Promise<IncomeModel[]>{
    //     const {rows} = await pool.query(
    //        ` SELECT * FROM incomes WHERE description IS NOT NULL AND LENGTH(description) > 0;`
    //     );

    //     return rows
    // }

    // async getExpense(year:number,  month:number): Promise<FinanceItem[]>{
    //     const {rows} = await pool.query(
    //         `SELECT * FROM expenses WHERE description IS NOT NULL AND LENGTH(description) > 0;`
    //     );

    //     return rows
    // }


    // async reset(): Promise<void> {
    //     await prisma.ingreso.deleteMany();
    //     await prisma.gasto.deleteMany();
    //   }



// }