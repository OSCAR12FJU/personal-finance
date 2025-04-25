import { expenseRoutes } from "./infraestructure/routes/expense_routes.js";
import { incomeRoutes } from "./infraestructure/routes/income_routes.js";
import useFinanceStore from "./application/store/financeStore.js";
import { conditionText } from "./application/util/condition_text.js";
const balanceAction = (bot) => {
    bot.action('balance_btn', async (ctx) => {
        try {
            const newDate = new Date;
            const dataYear = newDate.getFullYear();
            const dataMonth = newDate.getMonth() + 1;
            const balance = useFinanceStore.getBalanceDelMes(dataYear, dataMonth);
            const ingresosMonth = useFinanceStore.getIngresosDelMes(dataYear, dataMonth).totalIngresos;
            const expensesMonth = useFinanceStore.getGastosDelMes(dataYear, dataMonth).totalGastos;
            const responseMessage = `💼 Balance del mes actual:\n\n` +
                `📈 Ingresos: $${ingresosMonth.toFixed(2)}\n` +
                `📉 Gastos: $${expensesMonth.toFixed(2)}\n` +
                `──────────────────\n` +
                `💰 Balance total: $${balance.toFixed(2)}\n\n` +
                `ℹ️ Mes: ${dataMonth}/${dataYear}`;
            await ctx.reply(responseMessage);
        }
        catch (error) {
            console.error('Error al calcular balance:', error);
            await ctx.reply('❌ Ocurrió un error al calcular el balance del mes');
        }
    });
};
//Principal
const setUpFinanceRoutes = (bot) => {
    conditionText(bot);
    expenseRoutes(bot);
    incomeRoutes(bot);
    balanceAction(bot);
};
export default setUpFinanceRoutes;
//# sourceMappingURL=bot.js.map