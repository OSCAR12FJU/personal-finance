

import { Context } from "telegraf";
import { checkNumberText, checkStringText, validateInput } from "../../application/util/check_messsage.js";
import { ExpenseModel } from "../../domains/models/expense_model.js";
import useFinanceStore from "../../application/store/financeStore.js";

//Instanciamos los valores de arranque para no cruzar información.
// export const expenseState = {
//     waitingForDayExpense: false,
//     waitingForMonthyExpense: false,
// }

//Funcion controladora del mensaje de texto que recibimo


export const controllerExpense = async (ctx:Context, isMonthy: boolean) =>{
    try{
        // if (!expenseState.waitingForDayExpense || !expenseState.waitingForMonthyExpense) return;
        if (!ctx.message || !("text" in ctx.message)) {
            throw new Error("❌ Debes enviar un mensaje de texto válido.");
        }

        const {description, amount} = validateInput(ctx.message.text);
        const newExpense: ExpenseModel ={
            description: description,
            amount: amount,
            typeExpense:isMonthy,
            date:new Date(ctx.message.date * 1000)
        }

        //Aca vamos a colocar aparte un inyección con services.
        useFinanceStore.agregarGasto(newExpense);
        await ctx.reply(`✅ ${isMonthy ? 'Gasto mensual' : 'Gasto diario'} registrado:
        Nombre: ${description}
        Monto: $${amount}`)
    }catch(error: any){
        await ctx.reply(`❌ Error: ${error.message}`)
    }
    // finally{
    //     expenseState.waitingForDayExpense = false
    //     expenseState.waitingForMonthyExpense = false
    // }
}

//Logica para hacer el listado en el mensaje.
export const handleListExpenses = async (ctx: Context) =>{
    try{
        const timestamp = ctx.callbackQuery?.message?.date;
        if(!timestamp) throw new Error("No se pudo obtener la fecha");

        const date = new Date( timestamp * 1000);
        const gaste = await useFinanceStore.getGastosDelMes(
            date.getFullYear(),
            date.getMonth() + 1
        );

        if(!gaste.gastos.length){
            return ctx.reply("📭 No hay gastos este mes");
        }

        const formated = gaste.gastos.map((g,i) =>
            `${i + 1}. ${g.description}: $${g.amount}`).join("\n")
        
        await ctx.reply(`📋 Gastos del mes:\n\n${formated}`);
    }catch(error){
        await ctx.reply("⚠️ Error al listar gastos");
        console.error(error);
    }
}

