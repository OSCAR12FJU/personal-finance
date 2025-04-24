import { expenseRoutes } from "./infraestructure/routes/expense_routes.js";
import { incomeRoutes } from "./infraestructure/routes/income_routes.js";
const setUpFinanceRoutes = (bot) => {
    expenseRoutes(bot);
    incomeRoutes(bot);
};
export default setUpFinanceRoutes;
