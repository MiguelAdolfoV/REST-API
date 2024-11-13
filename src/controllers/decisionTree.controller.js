const fs = require('fs');

// Cargar el modelo JSON
const model = JSON.parse(fs.readFileSync('../models/financial_advice_model.json', 'utf8'));

// Función para hacer predicciones usando el árbol de decisiones en JSON
function predict(input, node = model) {
    if (node.value) {
        // Estamos en una hoja, devuelve el valor de predicción
        const maxIndex = node.value[0].indexOf(Math.max(...node.value[0]));
        const classes = ["Reduce los egresos para ahorrar", "Mantén el buen ritmo de ahorro", "Considera invertir una parte", "Aumenta el ahorro con los ingresos actuales", "Prioriza gastos esenciales"];
        return classes[maxIndex];
    }

    // Determinar si vamos al nodo izquierdo o derecho
    if (input[node.feature] <= node.threshold) {
        return predict(input, node.left);
    } else {
        return predict(input, node.right);
    }
}

// Exportar la función predict para usarla en otros módulos
module.exports = { predict };
