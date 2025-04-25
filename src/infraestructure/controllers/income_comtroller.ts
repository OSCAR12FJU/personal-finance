
import { Context } from "telegraf";
import { checkNumberText, checkStringText, validateInput } from "../../application/util/check_messsage.js";
import { IncomeModel } from "../../domains/models/income_model.js";
import useFinanceStore from "../../application/store/financeStore.js";


//Instanciamos los valores de arranque para no cruzar información.
// export const incomeState = {
//     waitingForDayIncome: false,
//     waitingForMonthyIncome: false,
// }

//Funcion controladora del mensaje de texto que recibimo
//Función para opción de dia.
export const controllerIncome = async (ctx:Context, isMonthy: boolean) =>{
    try{
        if (!ctx.message || !("text" in ctx.message)) {
            throw new Error("❌ Debes enviar un mensaje de texto válido.");
        }
        console.log(ctx.message)
        const {description, amount} = validateInput(ctx.message.text);
        console.log("Datos parseados",  {description, amount})
        const newIncome: IncomeModel = {
            description:description,
            amount:amount,
            typeIncome:isMonthy,
            date:new Date(ctx.message.date * 1000)
        };
        //Aca vamos a colocar aparte un inyección con services.
        useFinanceStore.agregarIngreso(newIncome);
        await ctx.reply(`✅ ${isMonthy ? 'Ingreso mensual' : 'Ingreso diario'} registrado:
        Nombre: ${description}
        Monto: $${amount}`)
    }catch(error: any){
        await ctx.reply(`❌ Error: ${error.message}`)
    }

}

//Logica para hacer el listado en el mensaje.
export const handleListIncomes = async (ctx: Context) =>{
    try{
        const timestamp = ctx.callbackQuery?.message?.date;
        if(!timestamp) throw new Error("No se pudo obtener la fecha");

        const date = new Date( timestamp * 1000);
        const income = await useFinanceStore.getIngresosDelMes(
            date.getFullYear(),
            date.getMonth() + 1
        );

        if(!income.ingresos.length){
            return ctx.reply("📭 No hay ingresos este mes");
        }

        const formated = income.ingresos.map((inc,index) =>
            `${index + 1}. ${inc.description}: $${inc.amount}`).join("\n")
        await ctx.reply(`📋Ingreso del mes:\n\n${formated}`);
    }catch(error){
        await ctx.reply("⚠️ Error al listar ingreso");
        console.error(error);
    }
}

