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
