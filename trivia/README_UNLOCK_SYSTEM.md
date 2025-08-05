# Sistema de Desbloqueo Automático de Lecciones - Finx

## 📋 Resumen del Sistema

El sistema de desbloqueo automático de lecciones permite que los estudiantes progresen a través del curso completando quizzes con una puntuación mínima del 60%. Al aprobar un quiz, automáticamente se desbloquea la siguiente lección en la secuencia.

## 🎯 Características Implementadas

### ✅ Sistema de Progresión Secuencial
- **Lección 1**: Ahorro Inteligente (siempre desbloqueada)
- **Lección 2**: Savings Ninja (se desbloquea al completar Ahorro Inteligente)
- **Lección 3**: Investment Wizard (se desbloquea al completar Savings Ninja)

### ✅ Puntuación Mínima
- **Umbral de aprobación**: 60%
- **XP base por completar**: 50 puntos
- **Bonus por puntuación alta (≥80%)**: +20 XP
- **Bonus por puntuación perfecta (100%)**: +30 XP adicionales

### ✅ Notificaciones Visuales
- Notificaciones animadas cuando se desbloquea una nueva lección
- Efectos visuales en la interfaz principal
- Indicadores de estado en tiempo real

### ✅ Sistema de Persistencia
- Progreso guardado en localStorage
- Sincronización entre páginas
- Recuperación automática del progreso

## 🗂️ Archivos Modificados

### 1. **Quiz Files** (Actualizados)
- `quiz_ahorro_inteligente.html`
- `quiz_savings_ninja.html` 
- `quiz_investment_wizard.html`

**Cambios realizados:**
```javascript
// Al final de la función saveQuizProgress en cada quiz
if (percentage >= 60) {
    // Desbloquear siguiente lección
    unlockNextLesson(currentLessonId);
}
```

### 2. **Utility Library** (Nuevo)
- `lesson-progress.js`

**Funciones principales:**
- `isLessonUnlocked(lessonId)`: Verifica si una lección está desbloqueada
- `isQuizPassed(lessonId)`: Verifica si un quiz fue aprobado
- `unlockNextLesson(lessonId)`: Desbloquea la siguiente lección en secuencia
- `getUserProgress()`: Obtiene el progreso completo del usuario
- `showUnlockNotification()`: Muestra notificaciones de desbloqueo

### 3. **Main Interface** (Actualizado)
- `trivia.html`

**Mejoras implementadas:**
- Sistema dinámico de módulos con estados visuales
- Inicialización automática del progreso de lecciones
- Integración con sistema de traducciones
- Indicadores de progreso en tiempo real

### 4. **Test System** (Nuevo)
- `test_unlock_system.html`

**Funcionalidades de prueba:**
- Simulación de completar quizzes con diferentes puntajes
- Visualización del estado actual del progreso
- Herramientas de reseteo y debugging

## 🚀 Cómo Funciona

### Flujo de Desbloqueo:
1. **Usuario completa un quiz** → Sistema evalúa puntaje
2. **Si puntaje ≥ 60%** → Quiz marcado como aprobado
3. **Sistema automáticamente** → Desbloquea siguiente lección
4. **Notificación visual** → Informa al usuario del desbloqueo
5. **Actualización UI** → Refleja nuevo estado en interfaz principal

### Configuración de Secuencia:
```javascript
const LESSON_SEQUENCE = {
    'ahorro_inteligente': {
        next: 'savings_ninja',
        file: 'quiz_ahorro_inteligente.html',
        alwaysUnlocked: true
    },
    'savings_ninja': {
        next: 'investment_wizard', 
        file: 'quiz_savings_ninja.html',
        prerequisite: 'ahorro_inteligente'
    },
    'investment_wizard': {
        next: null,
        file: 'quiz_investment_wizard.html', 
        prerequisite: 'savings_ninja'
    }
};
```

## 🧪 Testing

### Usar el Sistema de Pruebas:
1. Abrir `test_unlock_system.html`
2. Simular completar quizzes con diferentes puntajes
3. Verificar que los desbloqueos funcionen correctamente
4. Probar el flujo completo de progresión

### Casos de Prueba Recomendados:
- ✅ Completar Ahorro Inteligente con 80% → Debería desbloquear Savings Ninja
- ✅ Completar Savings Ninja con 75% → Debería desbloquear Investment Wizard  
- ❌ Completar con 45% → No debería desbloquear siguiente lección
- ✅ Completar con 100% → Debería otorgar XP bonus

## 🎨 Estados Visuales

### Módulos Desbloqueados:
- Borde verde/azul
- Icono animado
- Acceso completo al quiz

### Módulos Bloqueados:
- Escala de grises
- Cursor "not-allowed"
- Tooltip explicativo al hacer clic

### Módulos Completados:
- Borde verde
- Indicador de "✅ Completado"
- Barra de progreso al 100%

## 📱 Compatibilidad

- ✅ Sistema responsive
- ✅ Funciona en modo claro/oscuro
- ✅ Compatible con sistema de traducciones (ES/EN)
- ✅ Persistencia de datos entre sesiones

## 🔧 Mantenimiento

### Para Agregar Nuevas Lecciones:
1. Actualizar `LESSON_SEQUENCE` en `lesson-progress.js`
2. Crear nuevo archivo de quiz
3. Agregar a la interfaz principal en `trivia.html`
4. Actualizar traducciones si es necesario

### Para Modificar Umbral de Aprobación:
Cambiar el valor `60` en las funciones de evaluación por el nuevo umbral deseado.

---

**Estado Actual**: ✅ Sistema completamente implementado y funcional
**Próximos Pasos**: Agregar más lecciones, implementar achievements, mejorar animaciones
