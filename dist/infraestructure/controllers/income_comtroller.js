import useFinanceStore from "src/store/financeStore";
import { checkNumberText, checkStringText } from "src/util/check_messsage";
//Instanciamos los valores de arranque para no cruzar información.
export const incomeState = {
    waitingForDayIncome: false,
    waitingForMonthyIncome: false,
};
//Validación del tipo mensaje que recibimos.
const validateIncomeInput = (text) => {
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
export const handleDayIncome = async (ctx) => {
    incomeState.waitingForDayIncome = true;
    await ctx.reply('📝 Escribe el ingreso del día en formato "Descripción y monto":');
};
export const handleMonthyIncome = async (ctx) => {
    incomeState.waitingForMonthyIncome = true;
    await ctx.reply('📝 Escribe el ingreso mensual en formato "Descripción y monto":');
};
export const processIncome = async (ctx, isMonthy) => {
    try {
        if (!incomeState.waitingForDayIncome || !incomeState.waitingForMonthyIncome)
            return;
        if (!ctx.message || !("text" in ctx.message)) {
            throw new Error("❌ Debes enviar un mensaje de texto válido.");
        }
        const { description, amount } = validateIncomeInput(ctx.message.text);
        const newIncome = {
            description: description,
            amount: amount,
            typeIncome: isMonthy,
            date: new Date(ctx.message.date * 1000)
        };
        //Aca vamos a colocar aparte un inyección con services.
        useFinanceStore.agregarIngreso(newIncome);
        await ctx.reply(`✅ ${isMonthy ? 'Ingreso mensual' : 'Ingreso diario'} registrado:
        Nombre: ${description}
        Monto: $${amount}`);
    }
    catch (error) {
        await ctx.reply(`❌ Error: ${error.message}`);
    }
    finally {
        incomeState.waitingForDayIncome = false;
        incomeState.waitingForMonthyIncome = false;
    }
};
//Logica para hacer el listado en el mensaje.
export const handleListIncomes = async (ctx) => {
    try {
        const timestamp = ctx.callbackQuery?.message?.date;
        if (!timestamp)
            throw new Error("No se pudo obtener la fecha");
        const date = new Date(timestamp * 1000);
        const income = await useFinanceStore.getIngresosDelMes(date.getFullYear(), date.getMonth() + 1);
        if (!income.items.length) {
            return ctx.reply("📭 No hay ingresos este mes");
        }
        const formated = income.items.map((inc, index) => `${index + 1}. ${inc.description}: $${inc.amount}`).join("\n");
        await ctx.reply(`📋Ingreso del mes:\n\n${formated}`);
    }
    catch (error) {
        await ctx.reply("⚠️ Error al listar ingreso");
        console.error(error);
    }
};
