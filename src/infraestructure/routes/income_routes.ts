import { Context, Telegraf } from "telegraf";
import { controllerIncome, handleListIncomes } from "../controllers/income_comtroller.js";
import { stateAction } from "../../application/stateAction.js";

export const incomeRoutes = (bot: Telegraf) =>{
    //Menu Principal de gastos
    bot.action('income_btn', (ctx) => ctx.reply('¿Qué tipo de ingreso?', {
        reply_markup: {
          inline_keyboard: [
            [{ text: '📋 Lista de ingresos', callback_data: 'list_btn_income' }],
            [
              { text: '🗓️ Mensual', callback_data: 'monthy_btn_income' },
              { text: '📍 Día', callback_data: 'day_btn_income' }
            ]
          ]
        }
      }));
      //Acciòn del btn Gasto del dia
      const handleDayIncome = async (ctx: Context) =>{
        // incomeState.waitingForDayIncome = true;
        stateAction.waitingInput = "dayIncome";
        await ctx.reply('📝 Escribe el ingreso del día en formato "Descripción y monto":')
        }
      //Acciòn del btn Gasto del mes
      const handleMonthyIncome = async (ctx: Context) =>{
        //  incomeState.waitingForMonthyIncome = true;
        stateAction.waitingInput = "monthlyIncome";
        await ctx.reply('📝 Escribe el ingreso mensual en formato "Descripción y monto":')
        console.log('Estado actual - Day:', stateAction.waitingInput);
        }
    
    
    //Función de la selección de de uno de los botones a selecciónar
    bot.action('day_btn_income', handleDayIncome);
    bot.action('monthy_btn_income', handleMonthyIncome);
    //Esta es lo mismo pero de la lista
    bot.action('list_btn_income', handleListIncomes);


}