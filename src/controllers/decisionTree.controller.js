const fs = require('fs');

// Importar el modelo JSON directamente
import model from './financial_advice_model.json' assert { type: "json" };

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

export { predict };
