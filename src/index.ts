import { Telegraf, Markup, Context } from "telegraf";
import dotenv from "dotenv";
import setUpFinanceRoutes from "./bot.js";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN || '7727167193:AAEoX8ZJhevfUmHbOPptrQ6pCDe-UQimxsY');

// console.log(process.env.BOT_TOKEN);


// (async () =>{

//   await initDB();
  
  bot.start((ctx) => {
      return ctx.reply('Menú principal:', Markup.inlineKeyboard([
        [Markup.button.callback('📊Ver Balance', 'balance_btn')],
        [Markup.button.callback('💸Registrar Ingreso', 'income_btn'), 
         Markup.button.callback('💰Registrar Gasto', 'expense_btn')],
        [Markup.button.callback('📉Lista de Perdidas', 'reports_btn'),
        Markup.button.callback('📈Lista de Ganancias', 'reports_btn')]
      ]));
    });
  
    setUpFinanceRoutes(bot);
  
    bot.launch();
    console.log("🤖 Bot funcionando correctamente");

// })();

  //Agragar la funcionalidad de ingreso/gasto mensual
  //-Fijo mensual(marcar el monto)
  //Cambiar el valor del fijo mensual.
