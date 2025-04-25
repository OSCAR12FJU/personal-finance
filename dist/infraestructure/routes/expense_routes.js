import { handleListExpenses } from "../controllers/expense_controller.js";
import { stateAction } from "../../application/stateAction.js";
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
    //Acciòn del btn Gasto del dia
    const handleDayExpense = async (ctx) => {
        // expenseState.waitingForDayExpense = true;
        stateAction.waitingInput = "dayExpense";
        await ctx.reply('📝 Escribe el gasto del día en formato "Descripción y monto":');
    };
    //Acciòn del btn Gasto del mes
    const handleMonthyExpense = async (ctx) => {
        // expenseState.waitingForMonthyExpense = true;
        stateAction.waitingInput = "monthlyExpense";
        await ctx.reply('📝 Escribe el gasto mensual en formato "Descripción y monto":');
    };
    //Función de la selección de de uno de los botones a selecciónar
    bot.action('day_btn_expense', handleDayExpense);
    bot.action('monthly_btn_expense', handleMonthyExpense);
    //Esta es lo mismo pero de la lista
    bot.action('list_btn_expense', handleListExpenses);
    //La logica que usamos ahora para manejar la logica de las acciònes de los botones es con una inyecciòn de valor booleano. 
    //Como ya vimmos al componentes "action" le podemos pasar una funciòn directa desde el aprametro o un componente de funciòn. En este caso vamos a usar el componente el cual segùn el que elija esa acciòn va a llamr a la funciòn del controlador del gasto pero la logica de este va a depender de la acciòn que se realize al selcciònar un boton ya uqe desde la primera acciòn del bton este va mostrar un texto en especifico y va mandar con un verdadero o falso que funciòn elegir. en el cual en la acciòn para controlar el texto segun lo que hayamos habilitado en la primera acciòn va hacer ese la funciòn que realizemos. Segùn esa valiaciòn depsues vamos a amndar la funciòn controladora para manejar el texto que recibimos.
    // bot.on('text', async (ctx: Context) =>{
    //     if(expenseState.waitingForDayExpense){
    //         await controllerExpense(ctx, false);
    //     }
    //     else if(expenseState.waitingForMonthyExpense){
    //         await controllerExpense(ctx, true)
    //     }
    // })
};
//# sourceMappingURL=expense_routes.js.map