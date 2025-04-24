import useFinanceStore from "@/store/financeStore.js";
import { checkNumberText, checkStringText } from "@/util/check_messsage.js";
//Instanciamos los valores de arranque para no cruzar información.
export const expenseState = {
    waitingForDayExpense: false,
    waitingForMonthyExpense: false,
};
// export class
//Validación del tipo mensaje que recibimos.
const validateExpenseInput = (text) => {
    const arrayMessage = checkStringText(text);
    if (!arrayMessage.length)
        throw new Error('Formato incorrecto. Usa: "Descripción y monto"');
    const amount = checkNumberText(arrayMessage);
    if (isNaN(amount))
        throw new Error('El monto debe ser número válido');
    return { description: arrayMessage[0], amount: amount };
};
//Funcion controladora del mensaje de texto que recibimo
//Función para opción de dia.
export const handleDayExpense = async (ctx) => {
    expenseState.waitingForDayExpense = true;
    await ctx.reply('📝 Escribe el gasto del día en formato "Descripción y monto":');
};
export const handleMonthyExpense = async (ctx) => {
    expenseState.waitingForMonthyExpense = true;
    await ctx.reply('📝 Escribe el gasto mensual en formato "Descripción y monto":');
};
export const processExpense = async (ctx, isMonthy) => {
    try {
        if (!expenseState.waitingForDayExpense || !expenseState.waitingForMonthyExpense)
            return;
        if (!ctx.message || !("text" in ctx.message)) {
            throw new Error("❌ Debes enviar un mensaje de texto válido.");
        }
        const { description, amount } = validateExpenseInput(ctx.message.text);
        const newExpense = {
            description: description,
            amount: amount,
            typeExpense: isMonthy,
            date: new Date(ctx.message.date * 1000)
        };
        //Aca vamos a colocar aparte un inyección con services.
        useFinanceStore.agregarGasto(newExpense);
        await ctx.reply(`✅ ${isMonthy ? 'Gasto mensual' : 'Gasto diario'} registrado:
        Nombre: ${description}
        Monto: $${amount}`);
    }
    catch (error) {
        await ctx.reply(`❌ Error: ${error.message}`);
    }
    finally {
        expenseState.waitingForDayExpense = false;
        expenseState.waitingForMonthyExpense = false;
    }
};
//Logica para hacer el listado en el mensaje.
export const handleListExpenses = async (ctx) => {
    try {
        const timestamp = ctx.callbackQuery?.message?.date;
        if (!timestamp)
            throw new Error("No se pudo obtener la fecha");
        const date = new Date(timestamp * 1000);
        const gaste = await useFinanceStore.getGastosDelMes(date.getFullYear(), date.getMonth() + 1);
        if (!gaste.items.length) {
            return ctx.reply("📭 No hay gastos este mes");
        }
        const formated = gaste.items.map((g, i) => `${i + 1}. ${g.description}: $${g.amount}`).join("\n");
        await ctx.reply(`📋 Gastos del mes:\n\n${formated}`);
    }
    catch (error) {
        await ctx.reply("⚠️ Error al listar gastos");
        console.error(error);
    }
};
