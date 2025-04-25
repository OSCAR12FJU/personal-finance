export const checkStringText = (message) => {
    if (typeof message !== 'string') {
        throw new Error("El mensaje debe ser una cadena de texto");
    }
    const arrayMessage = message.split(' ');
    return arrayMessage;
};
export const checkNumberText = (arrayMessage) => {
    const montoStr = arrayMessage[1].replace(/\./g, '').replace(',', '.');
    const monto = parseFloat(montoStr);
    return monto;
};
//Validación del tipo mensaje que recibimos.
export const validateInput = (text) => {
    try {
        const arrayMessage = checkStringText(text);
        if (!arrayMessage.length)
            throw new Error('Formato incorrecto. Usa: "Descripción y monto"');
        const amount = checkNumberText(arrayMessage);
        if (isNaN(amount))
            throw new Error('El monto debe ser número válido');
        return { description: arrayMessage[0], amount: amount };
    }
    catch (error) {
        throw new Error("❌ Error en la validación de texto recibido.");
    }
};
//# sourceMappingURL=check_messsage.js.map