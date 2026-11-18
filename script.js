// Data Resep Dummy Awal
const recipes = [
    {
        id: 1,
        title: "Nasi Goreng Spesial Kampung",
        category: "Nusantara",
        time: "20 Menit",
        servings: 2,
        image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80",
        ingredients: ["2 piring Nasi putih dingin", "3 siung Bawang merah", "2 siung Bawang putih", "5 buah Cabai rawit", "1 butir Telur", "Kecap manis secukupnya", "Garam & Kaldu bubuk"],
        steps: ["Ulek bawang merah, bawang putih, dan cabai.", "Panaskan minyak, orak-arik telur lalu sisihkan.", "Tumis bumbu halus hingga harum.", "Masukkan nasi putih, aduk rata dengan bumbu.", "Tambahkan kecap, garam, dan kaldu. Koreksi rasa, sajikan hangat."]
    },
    {
        id: 2,
        title: "Pankake Fluffy Klasik",
        category: "Dessert",
        time: "15 Menit",
        servings: 3,
        image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80",
        ingredients: ["150g Tepung terigu", "2 sdm Gula pasir", "1 sdt Baking powder", "1 buah Telur", "130ml Susu cair", "2 sdm Mentega cair"],
        steps: ["Campurkan bahan kering dalam mangkuk.", "Kocok telur dan susu cair, lalu tuang ke bahan kering.", "Aduk rata jangan terlalu lama, masukkan mentega cair.", "Panaskan pan anti lengket tanpa minyak.", "Tuang adonan, balik jika sudah muncul gelembung. Angkat."]
    },
    {
        id: 3,
        title: "Smoothie Bowl Buah Naga Sehat",
        category: "Sehat",
        time: "10 Menit",
        servings: 1,
        image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=600&q=80",
        ingredients: ["1 buah Buah naga merah (beku)", "1 buah Pisang", "100ml Yogurt plain", "Topping: Granola, Chia seeds, Potongan buah"],
        steps: ["Masukkan buah naga, pisang, dan yogurt ke dalam blender.", "Blender hingga tekstur kental dan lembut.", "Tuang ke mangkuk saji.", "Beri topping granola dan chia seeds di atasnya."]
    }
];

// State Aplikasi
let currentUser = JSON.parse(localStorage.getItem('resepmu_user')) || null;
let currentTheme = localStorage.getItem('resepmu_theme') || 'light';

// Inisialisasi DOM
document.addEventListener('DOMContentLoaded', () => {
    // Terapkan Tema Tersimpan
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();

    // Render Resep Awal
    renderRecipes(recipes);

    // Cek Status Login
    updateAuthUI();

    // Event Listeners
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('searchBtn').addEventListener('click', handleSearch);
    document.getElementById('searchInput').addEventListener('keyup', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // Kategori Filter
    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
            document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            e.target.classList.add('active');
            filterCategory(e.target.dataset.category);
        });
    });

    // Auth Modal Trigger
    document.getElementById('authBtn').addEventListener('click', openAuthModal);
    
    // Tutup Modal
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // Switch Login/Register Mode
    let isRegisterMode = false;
    document.getElementById('switchAuthMode').addEventListener('click', (e) => {
        e.preventDefault();
        isRegisterMode = !isRegisterMode;
        document.getElementById('authTitle').innerText = isRegisterMode ? "Daftar Akun Baru" : "Masuk ke Resepmu";
        document.getElementById('nameGroup').style.display = isRegisterMode ? "block" : "none";
        document.getElementById('authSubmitBtn').innerText = isRegisterMode ? "Daftar" : "Masuk";
        document.getElementById('switchText').innerText = isRegisterMode ? "Sudah punya akun?" : "Belum punya akun?";
        document.getElementById('switchAuthMode').innerText = isRegisterMode ? "Masuk" : "Daftar sekarang";
    });

    // Submit Auth Form
    document.getElementById('authForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('authEmail').value;
        const name = isRegisterMode ? document.getElementById('authName').value : "Pengguna";

        currentUser = { name, email };
        localStorage.setItem('resepmu_user', JSON.stringify(currentUser));
        
        updateAuthUI();
        closeModal();
        alert(`Berhasil ${isRegisterMode ? 'mendaftar' : 'masuk'}! Selamat datang, ${name}`);
    });
});

// Render Daftar Resep
function renderRecipes(list) {
    const grid = document.getElementById('recipeGrid');
    grid.innerHTML = '';

    if (list.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">Resep tidak ditemukan.</p>`;
        return;
    }

    list.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.innerHTML = `
            <div class="recipe-img" style="background-image: url('${recipe.image}')"></div>
            <div class="recipe-body">
                <div>
                    <span style="font-size: 0.8rem; color: var(--primary); font-weight: bold;">${recipe.category}</span>
                    <h3 class="recipe-title">${recipe.title}</h3>
                </div>
                <div class="recipe-meta">
                    <span><i class="far fa-clock"></i> ${recipe.time}</span>
                    <span><i class="fas fa-utensils"></i> ${recipe.servings} Porsi</span>
                </div>
            </div>
        `;
        card.addEventListener('click', () => openRecipeDetail(recipe));
        grid.appendChild(card);
    });
}

// Detail Resep Modal
function openRecipeDetail(recipe) {
    const modal = document.getElementById('recipeModal');
    const body = document.getElementById('modalBody');

    body.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.title}" style="width: 100%; height: 220px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem;">
        <span style="color: var(--primary); font-weight: bold;">${recipe.category}</span>
        <h2>${recipe.title}</h2>
        <p style="color: var(--text-muted); margin: 0.5rem 0 1rem 0;"><i class="far fa-clock"></i> ${recipe.time} &bull; <i class="fas fa-utensils"></i> ${recipe.servings} Porsi</p>
        
        <h3 style="margin-top: 1rem;">Bahan-bahan:</h3>
        <ul style="padding-left: 1.2rem; margin-top: 0.5rem;">
            ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>

        <h3 style="margin-top: 1.5rem;">Langkah Pembuatan:</h3>
        <ol style="padding-left: 1.2rem; margin-top: 0.5rem;">
            ${recipe.steps.map(step => `<li style="margin-bottom: 0.5rem;">${step}</li>`).join('')}
        </ol>
    `;

    modal.style.display = 'flex';
}

// Filter Kategori
function filterCategory(cat) {
    if (cat === 'all') {
        renderRecipes(recipes);
    } else {
        const filtered = recipes.filter(r => r.category === cat);
        renderRecipes(filtered);
    }
}

// Fitur Pencarian
function handleSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = recipes.filter(r => 
        r.title.toLowerCase().includes(query) || 
        r.category.toLowerCase().includes(query) ||
        r.ingredients.some(ing => ing.toLowerCase().includes(query))
    );
    renderRecipes(filtered);
}

// Tema Terang / Gelap
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('resepmu_theme', currentTheme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const icon = document.querySelector('#themeToggle i');
    icon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Manajemen Autentikasi UI
function updateAuthUI() {
    const authBtn = document.getElementById('authBtn');
    if (currentUser) {
        authBtn.innerHTML = `<i class="fas fa-user-check"></i> ${currentUser.name}`;
        authBtn.onclick = () => {
            if (confirm("Ingin keluar akun?")) {
                localStorage.removeItem('resepmu_user');
                currentUser = null;
                updateAuthUI();
            }
        };
    } else {
        authBtn.innerHTML = `<i class="fas fa-user"></i> Masuk`;
        authBtn.onclick = openAuthModal;
    }
}

// Kontrol Modal Umum
function openAuthModal() {
    document.getElementById('authModal').style.display = 'flex';
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        closeModal();
    }
}
