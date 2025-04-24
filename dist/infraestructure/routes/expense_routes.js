import { expenseState, handleDayExpense, handleListExpenses, handleMonthyExpense, processExpense } from "../controllers/expense_controller.js";
export const expenseRoutes = (bot) => {
    //Menu Principal de gastos
    bot.action('expense_btn', (ctx) => ctx.reply('¿Qué tipo de gasto?', {
        reply_markup: {
            inline_keyboard: [
                [{ text: '📋 Lista de gastos', callback_data: 'list_btn_expense' }],
                [
                    { text: '🗓️ Mensual', callback_data: 'monthly_btn_expense' },
                    { text: '📍 Día', callback_data: 'day_btn_expense' }
                ]
            ]
        }
    }));
    //Función de la selección de de uno de los botones a selecciónar
    bot.action('day_btn_expense', handleDayExpense);
    bot.action('monthy_btn_expense', handleMonthyExpense);
    //Esta es lo mismo pero de la lista
    bot.action('list_btn_expense', handleListExpenses);
    bot.on('text', async (ctx) => {
        if (expenseState.waitingForDayExpense) {
            await processExpense(ctx, false);
        }
        else if (expenseState.waitingForMonthyExpense) {
            await processExpense(ctx, true);
        }
    });
};
