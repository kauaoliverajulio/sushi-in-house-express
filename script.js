// DOM Elements
const searchInput = document.getElementById('searchInput');
const categoryButtons = document.querySelectorAll('.category-btn');
const menuSections = document.querySelectorAll('.menu-section');
const menuItems = document.querySelectorAll('.menu-item');

// Search functionality
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    menuItems.forEach(item => {
        const title = item.querySelector('h3').textContent.toLowerCase();
        const description = item.querySelector('.description');
        const descriptionText = description ? description.textContent.toLowerCase() : '';
        
        const matchesSearch = title.includes(searchTerm) || descriptionText.includes(searchTerm);
        
        if (matchesSearch || searchTerm === '') {
            item.style.display = 'block';
            item.classList.remove('hidden');
        } else {
            item.style.display = 'none';
            item.classList.add('hidden');
        }
    });
    
    // Hide/show sections based on visible items
    menuSections.forEach(section => {
        const visibleItems = section.querySelectorAll('.menu-item:not(.hidden)');
        if (visibleItems.length === 0 && searchTerm !== '') {
            section.style.display = 'none';
        } else {
            section.style.display = 'block';
        }
    });
}

// Category filtering
function handleCategoryFilter(selectedCategory) {
    // Update active button
    categoryButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeButton = document.querySelector(`[data-category="${selectedCategory}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    // Show/hide sections based on category
    if (selectedCategory === 'all') {
        menuSections.forEach(section => {
            section.style.display = 'block';
        });
        menuItems.forEach(item => {
            item.style.display = 'block';
            item.classList.remove('hidden');
        });
    } else {
        menuSections.forEach(section => {
            const sectionCategory = section.getAttribute('data-category');
            if (sectionCategory === selectedCategory) {
                section.style.display = 'block';
                // Show all items in this section
                const sectionItems = section.querySelectorAll('.menu-item');
                sectionItems.forEach(item => {
                    item.style.display = 'block';
                    item.classList.remove('hidden');
                });
            } else {
                section.style.display = 'none';
            }
        });
    }
    
    // Clear search when filtering by category
    searchInput.value = '';
}

// Smooth scroll to section
function scrollToSection(category) {
    if (category !== 'all') {
        const targetSection = document.querySelector(`[data-category="${category}"]`);
        if (targetSection) {
            setTimeout(() => {
                targetSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }, 100);
        }
    }
}

// Event listeners
searchInput.addEventListener('input', handleSearch);
searchInput.addEventListener('keyup', handleSearch);

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.getAttribute('data-category');
        handleCategoryFilter(category);
        scrollToSection(category);
    });
});

// Address buttons functionality
const ignorarBtn = document.querySelector('.btn-secondary');
const informarBtn = document.querySelector('.btn-primary');

ignorarBtn.addEventListener('click', () => {
    // Simulate skipping address input
    console.log('Endereço ignorado - continuando sem localização específica');
    
    // You could add a toast notification here
    showNotification('Continuando sem endereço específico', 'info');
});

informarBtn.addEventListener('click', () => {
    // Simulate address input
    console.log('Solicitando endereço do usuário');
    
    // Simple prompt for demonstration (in real app, this would be a modal)
    const address = prompt('Digite seu endereço para delivery:');
    if (address && address.trim()) {
        showNotification(`Endereço definido: ${address}`, 'success');
        // Here you would typically update the delivery area and available restaurants
    }
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        font-weight: 500;
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add animation keyframes if not already added
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Menu item click handlers (for future cart functionality)
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        const itemName = item.querySelector('h3').textContent;
        const itemPrice = item.querySelector('.price').textContent;
        
        console.log(`Item selecionado: ${itemName} - ${itemPrice}`);
        
        // Add visual feedback
        item.style.transform = 'scale(0.98)';
        setTimeout(() => {
            item.style.transform = '';
        }, 150);
        
        // Show notification
        showNotification(`${itemName} selecionado!`, 'success');
        
        // Here you would typically add the item to cart
        // addToCart(itemName, itemPrice);
    });
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    console.log('Sushi in House Express - Página carregada');
    
    // Set initial active category
    const allButton = document.querySelector('[data-category="all"]');
    if (allButton) {
        allButton.classList.add('active');
    }
    
    // Add loading animation to menu items
    menuItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
});

// Utility function to format currency (Brazilian Real)
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Utility function to extract price from text
function extractPrice(priceText) {
    const match = priceText.match(/R\$\s*([\d,]+)/);
    if (match) {
        return parseFloat(match[1].replace(',', '.'));
    }
    return 0;
}

// Future cart functionality placeholder
const cart = {
    items: [],
    total: 0,
    
    add(item) {
        this.items.push(item);
        this.updateTotal();
        console.log('Item adicionado ao carrinho:', item);
    },
    
    remove(index) {
        if (index >= 0 && index < this.items.length) {
            const removed = this.items.splice(index, 1)[0];
            this.updateTotal();
            console.log('Item removido do carrinho:', removed);
        }
    },
    
    updateTotal() {
        this.total = this.items.reduce((sum, item) => sum + item.price, 0);
    },
    
    clear() {
        this.items = [];
        this.total = 0;
        console.log('Carrinho limpo');
    }
};

// Export for potential use in other scripts
window.SushiApp = {
    cart,
    showNotification,
    formatCurrency,
    extractPrice
};
