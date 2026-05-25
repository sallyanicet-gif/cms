// ============================================
// SOFT WEST - JavaScript App with Supabase
// ============================================

// ⚠️ À REMPLACER avec vos vraies clés Supabase !
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_KEY = 'your-anon-key';

let supabase = null;
let currentUser = null;

class SoftWestApp {
    constructor() {
        this.currentPage = 'accueil';
        this.isDarkMode = localStorage.getItem('darkMode') === 'true';
        this.cartCount = 0;
        this.products = [];
        this.editingProductId = null;
        this.init();
    }

    async init() {
        this.setupSupabase();
        this.setupDarkMode();
        this.setupNavigation();
        this.setupSearch();
        this.setupFAQ();
        this.setupCarousel();
        this.setupContactForm();
        this.setupAdmin();
        await this.loadProducts();
        await this.checkAuthStatus();
    }

    // ============ Supabase Setup ============
    setupSupabase() {
        const { createClient } = window.supabase;
        supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    }

    async checkAuthStatus() {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            currentUser = session?.user || null;
            this.updateAdminUI();
        } catch (error) {
            console.error('Auth check error:', error);
        }
    }

    // ============ Dark Mode ============
    setupDarkMode() {
        const themeToggle = document.getElementById('themeToggle');
        
        if (this.isDarkMode) {
            document.documentElement.classList.add('dark');
        }

        themeToggle.addEventListener('click', () => {
            this.isDarkMode = !this.isDarkMode;
            document.documentElement.classList.toggle('dark');
            localStorage.setItem('darkMode', this.isDarkMode);
        });
    }

    // ============ Navigation ============
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                const page = link.dataset.page;
                this.navigateTo(page);
            });
        });
    }

    navigateTo(page) {
        // Empêcher l'accès à l'admin sans connexion
        if (page === 'admin' && !currentUser) {
            this.openLoginModal();
            return;
        }

        // Hide all pages
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        
        // Show selected page
        const targetPage = document.getElementById(`page-${page}`);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === page) {
                link.classList.add('active');
            }
        });

        this.currentPage = page;

        // Load admin data if needed
        if (page === 'admin') {
            this.loadAdminProducts();
        }

        // Scroll to top
        window.scrollTo(0, 0);
    }

    // ============ Products ============
    async loadProducts() {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error loading products:', error);
                this.loadDefaultProducts();
                return;
            }

            this.products = data || [];
            this.renderProducts();
        } catch (error) {
            console.error('Load products error:', error);
            this.loadDefaultProducts();
        }
    }

    loadDefaultProducts() {
        this.products = [
            {
                id: 1,
                name: 'Low Battery Mood',
                category: 'Porte-clés',
                price: 12.90,
                mood: 'lowbattery',
                emoji: '😴',
                badge: 'Chaud'
            },
            {
                id: 2,
                name: 'Overthinker Peluche',
                category: 'Porte-clés',
                price: 12.90,
                mood: 'overthink',
                emoji: '🤔',
                badge: null
            },
            {
                id: 3,
                name: 'Grumpy Cloud',
                category: 'Peluche',
                price: 12.90,
                mood: 'grumpy',
                emoji: '😠',
                badge: null
            },
            {
                id: 4,
                name: 'Happy Beam Peluche',
                category: 'Peluche',
                price: 18.90,
                mood: 'happy',
                emoji: '😊',
                badge: null
            }
        ];
        this.renderProducts();
    }

    renderProducts() {
        const featuredContainer = document.getElementById('featured-products');
        const allProductsContainer = document.getElementById('all-products');

        if (featuredContainer) {
            featuredContainer.innerHTML = this.products.slice(0, 4).map(p => this.createProductCard(p)).join('');
        }

        if (allProductsContainer) {
            allProductsContainer.innerHTML = this.products.map(p => this.createProductCard(p)).join('');
        }

        // Setup product buttons
        document.querySelectorAll('.product-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.addToCart();
            });
        });
    }

    createProductCard(product) {
        return `
            <div class="product-card" data-mood="${product.mood}">
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
                <div class="product-image">${product.emoji || '👽'}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-category">${product.category}</div>
                <div class="product-price">${product.price.toFixed(2)} €</div>
                <button class="product-btn">Ajouter au panier</button>
            </div>
        `;
    }

    addToCart() {
        this.cartCount++;
        document.querySelector('.cart-count').textContent = this.cartCount;
        
        const btn = event.target;
        btn.textContent = '✓ Ajouté';
        btn.style.opacity = '0.6';
        
        setTimeout(() => {
            btn.textContent = 'Ajouter au panier';
            btn.style.opacity = '1';
        }, 1000);
    }

    // ============ Search ============
    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            this.filterProducts(query);
        });
    }

    filterProducts(query) {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            const name = card.querySelector('.product-name').textContent.toLowerCase();
            const category = card.querySelector('.product-category').textContent.toLowerCase();
            
            if (name.includes(query) || category.includes(query) || query === '') {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // ============ FAQ ============
    setupFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                faqItems.forEach(other => {
                    if (other !== item) {
                        other.classList.remove('open');
                    }
                });
                item.classList.toggle('open');
            });
        });
    }

    // ============ Carousel ============
    setupCarousel() {
        const carousel = document.querySelector('.reviews-carousel');
        const prevBtn = document.querySelector('.carousel-arrow.prev');
        const nextBtn = document.querySelector('.carousel-arrow.next');
        const dots = document.querySelectorAll('.carousel-dot');

        if (!carousel) return;

        let currentIndex = 0;
        const items = carousel.querySelectorAll('.review-card');
        const totalItems = items.length;

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        prevBtn?.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalItems) % totalItems;
            updateCarousel();
        });

        nextBtn?.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalItems;
            updateCarousel();
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
        });
    }

    // ============ Contact Form ============
    setupContactForm() {
        const form = document.getElementById('contactForm');
        
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const name = form.querySelector('input[type="text"]').value;
                const email = form.querySelector('input[type="email"]').value;
                const message = form.querySelector('textarea').value;

                try {
                    // Simuler l'envoi (à remplacer par API réelle)
                    console.log('Message envoyé:', { name, email, message });
                    
                    alert('Merci ! Votre message a été envoyé. Nous vous recontacterons bientôt.');
                    form.reset();
                    this.navigateTo('accueil');
                } catch (error) {
                    alert('Erreur lors de l\'envoi du message');
                    console.error(error);
                }
            });
        }
    }

    // ============ Admin ============
    setupAdmin() {
        const adminBtn = document.getElementById('adminBtn');
        const addProductBtn = document.getElementById('addProductBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const closeFormBtn = document.getElementById('closeFormBtn');
        const cancelFormBtn = document.getElementById('cancelFormBtn');
        const closeLoginBtn = document.getElementById('closeLoginBtn');
        const productForm = document.getElementById('productForm');

        adminBtn?.addEventListener('click', () => {
            if (currentUser) {
                this.navigateTo('admin');
            } else {
                this.openLoginModal();
            }
        });

        addProductBtn?.addEventListener('click', () => {
            this.openProductForm();
        });

        logoutBtn?.addEventListener('click', () => {
            this.logout();
        });

        closeFormBtn?.addEventListener('click', () => {
            this.closeProductForm();
        });

        cancelFormBtn?.addEventListener('click', () => {
            this.closeProductForm();
        });

        closeLoginBtn?.addEventListener('click', () => {
            this.closeLoginModal();
        });

        productForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProduct();
        });

        // Setup filters
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filterProductsByMood(btn.dataset.mood);
            });
        });
    }

    updateAdminUI() {
        const adminBtn = document.getElementById('adminBtn');
        if (currentUser) {
            adminBtn.innerHTML = '<i class="fas fa-lock-open"></i>';
            adminBtn.style.opacity = '1';
        } else {
            adminBtn.innerHTML = '<i class="fas fa-lock"></i>';
            adminBtn.style.opacity = '0.5';
        }
    }

    openLoginModal() {
        const modal = document.getElementById('loginModal');
        modal.classList.remove('hidden');

        const form = document.getElementById('loginForm');
        const errorMsg = document.getElementById('loginError');

        form.onsubmit = async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });

                if (error) {
                    errorMsg.textContent = error.message;
                    errorMsg.classList.add('show');
                    return;
                }

                currentUser = data.user;
                this.updateAdminUI();
                this.closeLoginModal();
                this.navigateTo('admin');
            } catch (error) {
                errorMsg.textContent = 'Erreur de connexion';
                errorMsg.classList.add('show');
            }
        };
    }

    closeLoginModal() {
        const modal = document.getElementById('loginModal');
        modal.classList.add('hidden');
        document.getElementById('loginForm').reset();
        document.getElementById('loginError').classList.remove('show');
    }

    openProductForm(productId = null) {
        const modal = document.getElementById('productFormModal');
        const form = document.getElementById('productForm');
        const title = document.getElementById('formTitle');

        form.reset();

        if (productId) {
            const product = this.products.find(p => p.id === productId);
            if (product) {
                title.textContent = 'Modifier le produit';
                document.getElementById('productName').value = product.name;
                document.getElementById('productCategory').value = product.category;
                document.getElementById('productPrice').value = product.price;
                document.getElementById('productEmoji').value = product.emoji;
                document.getElementById('productMood').value = product.mood;
                document.getElementById('productBadge').value = product.badge || '';
                this.editingProductId = productId;
            }
        } else {
            title.textContent = 'Nouveau produit';
            this.editingProductId = null;
        }

        modal.classList.remove('hidden');
    }

    closeProductForm() {
        const modal = document.getElementById('productFormModal');
        modal.classList.add('hidden');
        document.getElementById('productForm').reset();
        this.editingProductId = null;
    }

    async saveProduct() {
        if (!currentUser) {
            alert('Vous devez être connecté');
            return;
        }

        const name = document.getElementById('productName').value;
        const category = document.getElementById('productCategory').value;
        const price = parseFloat(document.getElementById('productPrice').value);
        const emoji = document.getElementById('productEmoji').value;
        const mood = document.getElementById('productMood').value;
        const badge = document.getElementById('productBadge').value || null;

        try {
            if (this.editingProductId) {
                // Modifier
                const { error } = await supabase
                    .from('products')
                    .update({ name, category, price, emoji, mood, badge })
                    .eq('id', this.editingProductId);

                if (error) throw error;
            } else {
                // Créer
                const { error } = await supabase
                    .from('products')
                    .insert([{ name, category, price, emoji, mood, badge }]);

                if (error) throw error;
            }

            await this.loadProducts();
            this.loadAdminProducts();
            this.closeProductForm();
            alert('Produit sauvegardé avec succès');
        } catch (error) {
            alert('Erreur: ' + error.message);
            console.error(error);
        }
    }

    async loadAdminProducts() {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            const tbody = document.getElementById('productsTableBody');
            tbody.innerHTML = (data || []).map(product => `
                <tr>
                    <td>${product.emoji} ${product.name}</td>
                    <td>${product.category}</td>
                    <td>${product.price.toFixed(2)} €</td>
                    <td>${product.mood}</td>
                    <td>
                        <div class="table-actions">
                            <button class="btn-edit" onclick="app.editProduct(${product.id})">
                                <i class="fas fa-edit"></i> Éditer
                            </button>
                            <button class="btn-delete" onclick="app.deleteProduct(${product.id})">
                                <i class="fas fa-trash"></i> Supprimer
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error loading admin products:', error);
        }
    }

    editProduct(productId) {
        this.openProductForm(productId);
    }

    async deleteProduct(productId) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            return;
        }

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', productId);

            if (error) throw error;

            await this.loadProducts();
            this.loadAdminProducts();
            alert('Produit supprimé avec succès');
        } catch (error) {
            alert('Erreur: ' + error.message);
            console.error(error);
        }
    }

    async logout() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            currentUser = null;
            this.updateAdminUI();
            this.navigateTo('accueil');
            alert('Déconnecté avec succès');
        } catch (error) {
            alert('Erreur: ' + error.message);
        }
    }

    filterProductsByMood(mood) {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            if (mood === 'all' || card.dataset.mood === mood) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// ============ Initialize App ============
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new SoftWestApp();
});
