# Sistema de Quizzes Específicos por Lección - Finx

## Resumen de Implementación

Se han creado **3 quizzes específicos** para cada lección, cada uno con preguntas basadas en el contenido de sus respectivos videos educativos.

## 📚 Estructura de Quizzes

### 1. Quiz: Ahorro Inteligente (`quiz_ahorro_inteligente.html`)
- **Video Base**: "Basic Concepts of Personal Finances_1080p.mp4"
- **Lección**: `leccion.html`
- **Tema**: Conceptos básicos de finanzas personales
- **Preguntas**: 7 preguntas sobre presupuesto, ahorros, gastos fijos/variables, fondos de emergencia
- **ID Lección**: `ahorro_inteligente`

### 2. Quiz: Savings Ninja (`quiz_savings_ninja.html`)
- **Video Base**: "Understanding Savings A Guide for Young People_1080p.mp4"
- **Lección**: `savings_master.html`
- **Tema**: Técnicas avanzadas de ahorro
- **Preguntas**: 8 preguntas sobre regla 50/30/20, automatización, fondos de emergencia, interés compuesto
- **ID Lección**: `savings_ninja`

### 3. Quiz: Investment Wizard (`quiz_investment_wizard.html`)
- **Video Base**: "Understanding Investment A Guide for Young People_1080p.mp4"
- **Lección**: `investment_wizard.html`
- **Tema**: Fundamentos de inversiones
- **Preguntas**: 8 preguntas sobre diversificación, riesgo, fondos mutuos, estrategias de inversión
- **ID Lección**: `wealth_wizard`

## 🔄 Flujo de Usuario

1. **Completar Lección**: Usuario ve el video y hace clic en "Mark as Complete"
2. **Redirección Automática**: Se redirige al quiz específico de esa lección
3. **Mensaje de Confirmación**: Aparece mensaje personalizado confirmando la lección completada
4. **Tomar Quiz**: Usuario responde preguntas específicas del contenido del video
5. **Resultados**: Obtiene puntuación y XP al completar el quiz

## 🎯 Características Técnicas

### Sistema de Traducciones
- **Español e Inglés** completos para cada quiz
- Traducciones dinámicas para preguntas, opciones y explicaciones
- Soporte para cambio de idioma en tiempo real

### Sistema de Progreso
- **XP Rewards**: 75 XP por completar cada quiz
- **Almacenamiento Local**: Progreso guardado en localStorage
- **Badges Únicos**: Cada quiz otorga un badge temático

### Diseño Responsive
- **Tema Personalizado**: Cada quiz tiene su propia paleta de colores
- **Animaciones**: Transiciones suaves y efectos visuales
- **Modo Oscuro/Claro**: Soporte completo para ambos temas

## 📁 Archivos Modificados/Creados

### Nuevos Archivos
- `quiz_ahorro_inteligente.html` - Quiz para lección básica
- `quiz_savings_ninja.html` - Quiz para lección de ahorro
- `quiz_investment_wizard.html` - Quiz para lección de inversiones

### Archivos Modificados
- `leccion.html` - Redirección actualizada
- `savings_master.html` - Redirección actualizada
- `investment_wizard.html` - Redirección actualizada
- `camino_ahorro.html` - Botón de quiz actualizado
- `test_lesson_completion.html` - Testing actualizado

## 🧪 Testing

Use `test_lesson_completion.html` para probar:
- ✅ Flujo completo de lección → quiz
- ✅ Quizzes específicos directamente
- ✅ Cambio de idiomas
- ✅ Mensajes de lección completada

## 🎨 Temas Visuales

### Ahorro Inteligente
- **Colores**: Azul/Púrpura clásico (#6366f1, #8b5cf6)
- **Estilo**: Profesional y educativo

### Savings Ninja
- **Colores**: Azul marino (#1e40af, #3730a3)
- **Estilo**: Temática ninja, sigiloso y elegante

### Investment Wizard
- **Colores**: Púrpura mágico (#7c3aed, #5b21b6)
- **Estilo**: Temática mágica, místico y poderoso

## 📊 Contenido de Preguntas

Cada quiz contiene preguntas específicamente diseñadas para evaluar la comprensión del video correspondiente:

- **Conceptos Clave** del video específico
- **Aplicación Práctica** de los conocimientos
- **Explicaciones Detalladas** para reforzar el aprendizaje
- **Diferentes Niveles** de dificultad

## 🚀 Beneficios del Sistema

1. **Aprendizaje Dirigido**: Cada quiz evalúa contenido específico del video
2. **Mejor Retención**: Preguntas inmediatamente después del contenido
3. **Experiencia Personalizada**: Temas visuales únicos por lección
4. **Progreso Claro**: Sistema de XP y badges motivacional
5. **Bilingüe**: Accesible en español e inglés

## 🔧 Mantenimiento

Para agregar nuevas preguntas o modificar existentes, editar el array `quizQuestions` en cada archivo de quiz. Las preguntas siguen esta estructura:

```javascript
{
    question: {
        es: "Pregunta en español",
        en: "Question in English"
    },
    options: [
        { es: "Opción 1 ES", en: "Option 1 EN" },
        { es: "Opción 2 ES", en: "Option 2 EN" },
        // ...
    ],
    correct: 1, // Índice de respuesta correcta
    explanation: {
        es: "Explicación en español",
        en: "Explanation in English"
    }
}
```
