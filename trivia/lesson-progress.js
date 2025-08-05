// lesson-progress.js - Utilidades para gestionar el progreso de lecciones y desbloqueos

// Configuración del sistema de lecciones
const LESSON_CONFIG = {
    sequence: ['ahorro_inteligente', 'savings_ninja', 'wealth_wizard'],
    minimumPassingScore: 60,
    lessonInfo: {
        'ahorro_inteligente': {
            title: { es: 'Ahorro Inteligente', en: 'Smart Savings' },
            file: 'leccion.html',
            quiz: 'quiz_ahorro_inteligente.html',
            alwaysUnlocked: true
        },
        'savings_ninja': {
            title: { es: 'Savings Ninja', en: 'Savings Ninja' },
            file: 'savings_master.html',
            quiz: 'quiz_savings_ninja.html',
            alwaysUnlocked: false
        },
        'wealth_wizard': {
            title: { es: 'Investment Wizard', en: 'Investment Wizard' },
            file: 'investment_wizard.html',
            quiz: 'quiz_investment_wizard.html',
            alwaysUnlocked: false
        }
    }
};

// Función para obtener el progreso del usuario
function getUserProgress() {
    const progress = JSON.parse(localStorage.getItem('user_progress') || '{}');
    
    // Inicializar valores por defecto
    if (!progress.unlockedLessons) {
        progress.unlockedLessons = ['ahorro_inteligente']; // Primera lección siempre desbloqueada
        localStorage.setItem('user_progress', JSON.stringify(progress));
    }
    
    return progress;
}

// Función para verificar si una lección está desbloqueada
function isLessonUnlocked(lessonId) {
    const config = LESSON_CONFIG.lessonInfo[lessonId];
    if (!config) return false;
    
    // Siempre desbloqueado si está marcado en config
    if (config.alwaysUnlocked) return true;
    
    // Verificar en progreso del usuario
    const progress = getUserProgress();
    return progress.unlockedLessons && progress.unlockedLessons.includes(lessonId);
}

// Función para verificar si un quiz fue completado exitosamente
function isQuizPassed(lessonId) {
    const quizKey = `quiz_${lessonId}`;
    const quizProgress = JSON.parse(localStorage.getItem(quizKey) || '{}');
    
    return quizProgress.completed && 
           quizProgress.score >= LESSON_CONFIG.minimumPassingScore;
}

// Función para obtener el porcentaje del quiz
function getQuizScore(lessonId) {
    const quizKey = `quiz_${lessonId}`;
    const quizProgress = JSON.parse(localStorage.getItem(quizKey) || '{}');
    
    return quizProgress.score || 0;
}

// Función para verificar si una lección fue completada
function isLessonCompleted(lessonId) {
    const lessonKey = `lesson_${lessonId}`;
    const lessonProgress = JSON.parse(localStorage.getItem(lessonKey) || '{}');
    
    return lessonProgress.completed || false;
}

// Función para desbloquear la siguiente lección
function unlockNextLesson(currentLessonId) {
    const currentIndex = LESSON_CONFIG.sequence.indexOf(currentLessonId);
    if (currentIndex === -1 || currentIndex >= LESSON_CONFIG.sequence.length - 1) {
        return null; // No hay siguiente lección
    }
    
    const nextLessonId = LESSON_CONFIG.sequence[currentIndex + 1];
    const progress = getUserProgress();
    
    if (!progress.unlockedLessons.includes(nextLessonId)) {
        progress.unlockedLessons.push(nextLessonId);
        localStorage.setItem('user_progress', JSON.stringify(progress));
        return nextLessonId;
    }
    
    return null; // Ya estaba desbloqueada
}

// Función para obtener el estado completo del progreso
function getCompleteProgress() {
    const progress = getUserProgress();
    const result = {};
    
    LESSON_CONFIG.sequence.forEach(lessonId => {
        result[lessonId] = {
            unlocked: isLessonUnlocked(lessonId),
            lessonCompleted: isLessonCompleted(lessonId),
            quizCompleted: isQuizPassed(lessonId),
            quizScore: getQuizScore(lessonId),
            info: LESSON_CONFIG.lessonInfo[lessonId]
        };
    });
    
    return result;
}

// Función para aplicar estilos de bloqueo a elementos de lección
function applyLessonLockStyle(element, isLocked) {
    if (isLocked) {
        element.style.opacity = '0.5';
        element.style.pointerEvents = 'none';
        element.classList.add('lesson-locked');
        
        // Agregar icono de candado si no existe
        if (!element.querySelector('.lock-icon')) {
            const lockIcon = document.createElement('div');
            lockIcon.className = 'lock-icon position-absolute top-0 end-0 m-2';
            lockIcon.innerHTML = '<i class="bi bi-lock-fill text-warning" style="font-size: 1.5rem;"></i>';
            lockIcon.style.zIndex = '10';
            element.style.position = 'relative';
            element.appendChild(lockIcon);
        }
    } else {
        element.style.opacity = '1';
        element.style.pointerEvents = 'auto';
        element.classList.remove('lesson-locked');
        
        // Remover icono de candado
        const lockIcon = element.querySelector('.lock-icon');
        if (lockIcon) {
            lockIcon.remove();
        }
    }
}

// Función para mostrar tooltip de lección bloqueada
function showLockedLessonTooltip(element, requiredLesson) {
    const currentLang = localStorage.getItem('finx_lang') || 'es';
    const requiredLessonName = LESSON_CONFIG.lessonInfo[requiredLesson]?.title[currentLang] || requiredLesson;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip bs-tooltip-top show position-absolute';
    tooltip.style.zIndex = '1070';
    tooltip.innerHTML = `
        <div class="tooltip-inner">
            ${currentLang === 'es' 
                ? `Completa "${requiredLessonName}" primero` 
                : `Complete "${requiredLessonName}" first`
            }
        </div>
    `;
    
    document.body.appendChild(tooltip);
    
    // Posicionar tooltip
    const rect = element.getBoundingClientRect();
    tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
    tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
    
    // Remover tooltip después de 3 segundos
    setTimeout(() => {
        tooltip.remove();
    }, 3000);
}

// Exportar funciones para uso global
if (typeof window !== 'undefined') {
    window.LessonProgress = {
        getUserProgress,
        isLessonUnlocked,
        isQuizPassed,
        getQuizScore,
        isLessonCompleted,
        unlockNextLesson,
        getCompleteProgress,
        applyLessonLockStyle,
        showLockedLessonTooltip,
        LESSON_CONFIG
    };
}
