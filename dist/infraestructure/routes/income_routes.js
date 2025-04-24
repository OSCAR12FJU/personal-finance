import { handleDayIncome, handleListIncomes, handleMonthyIncome, incomeState, processIncome } from "../controllers/income_comtroller.js";
export const incomeRoutes = (bot) => {
    //Menu Principal de gastos
    bot.action('income_btn', (ctx) => ctx.reply('¿Qué tipo de ingreso?', {
        reply_markup: {
            inline_keyboard: [
                [{ text: '📋 Lista de ingresos', callback_data: 'list_btn_income' }],
                [
                    { text: '🗓️ Mensual', callback_data: 'monthly_btn_income' },
                    { text: '📍 Día', callback_data: 'day_btn_income' }
                ]
            ]
        }
    }));
    //Función de la selección de de uno de los botones a selecciónar
    bot.action('day_btn_income', handleDayIncome);
    bot.action('monthy_btn_income', handleMonthyIncome);
    //Esta es lo mismo pero de la lista
    bot.action('list_btn_income', handleListIncomes);
    bot.on('text', async (ctx) => {
        if (incomeState.waitingForDayIncome) {
            await processIncome(ctx, false);
        }
        else if (incomeState.waitingForMonthyIncome) {
            await processIncome(ctx, true);
        }
    });
};
