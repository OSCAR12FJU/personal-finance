import { stateAction } from "../stateAction.js";
import { controllerIncome } from "../../infraestructure/controllers/income_comtroller.js";
import { controllerExpense } from "../../infraestructure/controllers/expense_controller.js";
export const conditionText = (bot) => {
    bot.use(async (ctx, next) => {
        console.log('📩 Mensaje recibido:', ctx.message?.chat); // Debug
        await next();
    });
    bot.on('text', async (ctx) => {
        if (!stateAction.waitingInput)
            return;
        switch (stateAction.waitingInput) {
            case 'dayIncome':
                await controllerIncome(ctx, false);
                break;
            case 'monthlyIncome':
                await controllerIncome(ctx, true);
                break;
            case 'dayExpense':
                await controllerExpense(ctx, false);
                break;
            case 'monthlyExpense':
                await controllerExpense(ctx, true);
                break;
        }
        stateAction.waitingInput = null; // Resetear estado
    });
};
//# sourceMappingURL=condition_text.js.map