/**
 * Adds a chatbot button to all sidebars in the application
 * This script should be included after the sidebar is loaded
 */

document.addEventListener('DOMContentLoaded', function() {
    // Find all sidebars by their common class names
    const sidebars = [
        ...document.querySelectorAll('.trivia-sidebar, .leccion-sidebar, .camino-sidebar')
    ];

    // Create the chatbot button HTML
    const chatbotButtonHTML = `
        <div class="sidebar-chatbot-container">
            <a href="chatbot.html" class="btn btn-chatbot" title="Chatbot de Ayuda">
                <i class="bi bi-robot"></i>
            </a>
        </div>
    `;

    // Add the chatbot button to each sidebar
    sidebars.forEach(sidebar => {
        // Find the logout container to insert the button before it
        const logoutContainer = sidebar.querySelector('.sidebar-logout-container');
        
        // Only add the button if the logout container exists and the chatbot button doesn't already exist
        if (logoutContainer && !sidebar.querySelector('.sidebar-chatbot-container')) {
            logoutContainer.insertAdjacentHTML('beforebegin', chatbotButtonHTML);
        }
    });
});
