// import {Pool} from 'pg';

// //Encriptar las credenciales con variables de entorno
// export const pool = new Pool({
//     user:"postgress",
//     host:"localhost",
//     database:"financePersonal",
//     password:"Fuerzaabasto1@",
//     port:5432,
// });


// export async function initDB(){
//     try{
//         await pool.query(`
//           CREATE  TABLE IF NOT EXISTS incomes(
//             id SERIAL PRIMARY KEY,
//             description TEXT NOT NULL,
//             amount NUMERIC(10,2) NOT NULL,
//             date DATE NOT NULL
//             type_income BOOLEAN DEFAULT FALSE);`);

//         await pool.query(`
//           CREATE  TABLE IF NOT EXISTS expenses (
//             id SERIAL PRIMARY KEY,
//             description TEXT NOT NULL,
//             amount NUMERIC(10,2) NOT NULL,
//             date DATE NOT NULL,
//             type_expense BOOLEAN DEFAULT FALSE);`);
//         console.log("✅ Tablas creadas (si no existían)")
//     }catch(error){
//         console.error("❌ Error al inicializar la base de datos:", error)
//     }
    
// }