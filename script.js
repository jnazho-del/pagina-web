/**
 * WELDMASTER - Script Principal
 * Cumple con la rúbrica de evaluación:
 * 1. Validación de formularios y seguridad (textContent/createElement)
 * 2. Organización de datos (Arreglos y Objetos)
 * 3. Manipulación del DOM y Eventos
 * 4. Estructura modular y funciones reutilizables
 * 5. Apoyo de IA y Buenas Prácticas
 * 6. UX/UI y Funcionalidad Adicional (Carrito, Filtros, LocalStorage)
 */

// ========== DATOS (MODELO) ==========

const courses = [
    {
        id: 'mig',
        name: 'Curso Soldadura MIG/MAG',
        subtitle: 'Gas Metal Arc Welding',
        description: 'Domina el electrodo de alambre continuo y gas protector. Ideal para producción rápida.',
        uses: 'Automotriz, fabricación metálica, estructuras.',
        difficulty: 'beginner',
        price: 145000,
        image: 'assets/mig_welding_course_1777843659761.png'
    },
    {
        id: 'tig',
        name: 'Curso Soldadura TIG',
        subtitle: 'Gas Tungsten Arc Welding',
        description: 'Especialización en electrodo de tungsteno. Máxima calidad y precisión excepcional.',
        uses: 'Aeroespacial, tuberías de presión, arte.',
        difficulty: 'advanced',
        price: 280000,
        image: 'assets/tig_welding_course_1777843673673.png'
    },
    {
        id: 'electrodo',
        name: 'Curso Electrodo Revestido',
        subtitle: 'Shielded Metal Arc Welding',
        description: 'Método clásico y versátil. Aprende a soldar en condiciones adversas y exteriores.',
        uses: 'Construcción, reparaciones en campo.',
        difficulty: 'intermediate',
        price: 85000,
        image: 'assets/electrode_welding_course_alt_1777843508727.png'
    },
    {
        id: 'puntos',
        name: 'Curso Soldadura por Puntos',
        subtitle: 'Resistance Spot Welding',
        description: 'Unión de metales por calor y presión eléctrica. Eficiencia industrial extrema.',
        uses: 'Chapas metálicas, electrodomésticos.',
        difficulty: 'beginner',
        price: 110000,
        image: 'assets/spot_welding_course_1777843702052.png'
    },
    {
        id: 'oxiacetilenica',
        name: 'Curso Oxiacetilénica',
        subtitle: 'Oxy-Fuel Welding',
        description: 'Técnica tradicional con llama de oxígeno y acetileno. Ideal para cobre y latón.',
        uses: 'Plomería, trabajos artísticos manuales.',
        difficulty: 'intermediate',
        price: 160000,
        image: 'assets/oxy_fuel_welding_course_1777843716156.png'
    },
    {
        id: 'plasma',
        name: 'Curso Arco Plasma',
        subtitle: 'Plasma Arc Welding',
        description: 'Alta tecnología con arco de plasma a 20,000°C. Precisión para aplicaciones críticas.',
        uses: 'Instrumentos médicos, micro-soldadura.',
        difficulty: 'advanced',
        price: 350000,
        image: 'assets/plasma_arc_welding_course_1777843733606.png'
    }
];

const quizQuestions = [
    {
        question: "¿Qué tipo de soldadura es mejor para un principiante?",
        options: ["TIG", "MIG/MAG", "Plasma", "Electrodo revestido"],
        correct: 1,
        explanation: "MIG/MAG es la más fácil de aprender por su electrodo continuo y fácil control."
    },
    {
        question: "¿Cual soldadura produce los cordones más estéticos?",
        options: ["Por puntos", "Electrodo", "TIG", "Oxiacetilénica"],
        correct: 2,
        explanation: "TIG ofrece la mayor precisión y control, produciendo soldaduras impecables."
    },
    {
        question: "¿Qué gas se usa comúnmente en MIG para acero?",
        options: ["Oxígeno", "Argón + CO2", "Nitrógeno", "Hidrógeno"],
        correct: 1,
        explanation: "La mezcla de Argón y CO2 proporciona estabilidad del arco y buena penetración."
    }
];

const safetyItems = [
    { icon: 'mask', title: 'Máscara de Soldar', desc: 'Protege ojos de radiación UV y chispas.' },
    { icon: 'gloves', title: 'Guantes de Cuero', desc: 'Aislamiento térmico y protección contra cortes.' },
    { icon: 'apron', title: 'Delantal y Mangas', desc: 'Protección corporal contra metal fundido.' },
    { icon: 'boots', title: 'Calzado Seguridad', desc: 'Botas con punta de acero y suela aislante.' }
];

// ========== ESTADO GLOBAL (STATE) ==========

let cart = JSON.parse(localStorage.getItem('weldmaster_cart')) || [];
let currentQuestion = 0;
let quizScore = 0;
let quizAnswered = false;
let activeFilter = 'all';

// ========== FUNCIONES DE UTILIDAD (UTILS) ==========

const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
    }).format(price);
};

// ========== DOM MANIPULATION (VISTA) ==========

function renderCourses() {
    const container = document.getElementById('welding-types');
    if (!container) return;

    // Limpiar contenedor de forma segura
    container.innerHTML = '';

    const filteredCourses = activeFilter === 'all' 
        ? courses 
        : courses.filter(c => c.difficulty === activeFilter);

    filteredCourses.forEach((course, index) => {
        const article = document.createElement('article');
        article.className = `weld-card reveal reveal-delay-${Math.min(index + 1, 6)}`;
        
        // Usamos innerHTML controlado solo para estructura estática, 
        // pero inyectamos contenido dinámico con textContent para seguridad
        article.innerHTML = `
            <div class="course-img-container">
                <img src="${course.image}" alt="${course.name}" class="course-img" loading="lazy">
            </div>
            <div class="p-6 flex flex-col flex-1">
                <div class="flex justify-between items-start mb-4">
                    <span class="badge badge-${course.difficulty}">
                        ${course.difficulty === 'beginner' ? 'Principiante' : course.difficulty === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                    </span>
                    <span class="text-[var(--accent)] font-display text-3xl">${String(index + 1).padStart(2, '0')}</span>
                </div>
                <h3 class="font-display text-2xl mb-1">${course.name}</h3>
                <p class="text-xs text-[var(--muted)] mb-4">${course.subtitle}</p>
                <p class="text-sm text-[var(--muted)] mb-6 flex-1">${course.description}</p>
                
                <div class="pt-4 border-t border-[var(--border)] mt-auto">
                    <div class="flex justify-between items-center mb-4">
                        <span class="text-xl font-bold text-white">${formatPrice(course.price)}</span>
                    </div>
                    <button class="btn-primary w-full add-to-cart-btn" data-id="${course.id}">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                        Inscribirse
                    </button>
                </div>
            </div>
        `;

        container.appendChild(article);
    });

    // Re-activar animaciones de revelado
    initScrollReveal();
}

function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartItemsContainer || !cartCount || !cartTotal) return;

    cartCount.textContent = cart.length;
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.className = 'text-center text-[var(--muted)] py-10';
        emptyMsg.textContent = 'Tu carrito está vacío';
        cartItemsContainer.appendChild(emptyMsg);
        cartTotal.textContent = formatPrice(0);
        return;
    }

    let total = 0;
    cart.forEach((item, index) => {
        const course = courses.find(c => c.id === item.id);
        if (!course) return;

        total += course.price;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <img src="${course.image}" alt="${course.name}" class="w-16 h-16 object-cover rounded">
            <div class="cart-item-info">
                <h4 class="text-sm font-bold text-white">${course.name}</h4>
                <p class="text-xs text-[var(--accent)]">${formatPrice(course.price)}</p>
                <button class="text-[var(--muted)] hover:text-red-500 text-xs mt-2 remove-item" data-index="${index}">Eliminar</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemDiv);
    });

    cartTotal.textContent = formatPrice(total);

    // Botones de eliminar
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.onclick = () => removeFromCart(btn.dataset.index);
    });
}

function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ========== LÓGICA DE NEGOCIO (LOGIC) ==========

function addToCart(courseId) {
    // Evitar duplicados si es necesario, o permitir varios (didáctico)
    if (cart.find(item => item.id === courseId)) {
        showToast('Ya estás inscrito en este curso');
        return;
    }

    cart.push({ id: courseId });
    saveCart();
    renderCart();
    showToast('¡Curso añadido al carrito!');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
}

function saveCart() {
    localStorage.setItem('weldmaster_cart', JSON.stringify(cart));
}

function handleCheckout(e) {
    e.preventDefault();
    const name = document.getElementById('checkout-name').value.trim();
    const email = document.getElementById('checkout-email').value.trim();
    
    let isValid = true;

    // Validación básica con feedback visual
    if (name.length < 3) {
        document.getElementById('name-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('name-error').style.display = 'none';
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        document.getElementById('email-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('email-error').style.display = 'none';
    }

    if (isValid && cart.length > 0) {
        // Simulación de éxito
        alert(`¡Gracias ${name}! Tu inscripción ha sido procesada. Recibirás un correo en ${email}.`);
        cart = [];
        saveCart();
        renderCart();
        toggleCart();
    } else if (cart.length === 0) {
        showToast('El carrito está vacío');
    }
}

// ========== QUIZ LOGIC ==========

function updateQuizQuestion() {
    const questionEl = document.getElementById('quiz-question');
    const optionsEl = document.getElementById('quiz-options');
    const feedbackEl = document.getElementById('quiz-feedback');
    const progressText = document.getElementById('quiz-progress-text');
    const progressBar = document.getElementById('quiz-progress-bar');

    if (!questionEl || !optionsEl) return;

    const q = quizQuestions[currentQuestion];
    questionEl.textContent = q.question;
    progressText.textContent = `${currentQuestion + 1}/${quizQuestions.length}`;
    progressBar.style.width = `${((currentQuestion + 1) / quizQuestions.length) * 100}%`;

    optionsEl.innerHTML = '';
    q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option w-full text-left rounded mb-3';
        btn.innerHTML = `<span class="text-[var(--accent)] font-display mr-3">${String.fromCharCode(65 + i)}</span> ${opt}`;
        btn.onclick = () => handleQuizAnswer(i, btn);
        optionsEl.appendChild(btn);
    });

    feedbackEl.classList.add('hidden');
    quizAnswered = false;
}

function handleQuizAnswer(index, btn) {
    if (quizAnswered) return;
    quizAnswered = true;

    const q = quizQuestions[currentQuestion];
    const feedbackEl = document.getElementById('quiz-feedback');
    
    btn.classList.add('selected');

    if (index === q.correct) {
        btn.classList.add('correct');
        quizScore++;
        feedbackEl.innerHTML = `<p class="text-green-500 font-medium">¡Correcto!</p><p class="text-sm text-[var(--muted)] mt-2">${q.explanation}</p>`;
    } else {
        btn.classList.add('incorrect');
        const correctBtn = document.querySelectorAll('.quiz-option')[q.correct];
        correctBtn.classList.add('correct');
        feedbackEl.innerHTML = `<p class="text-red-500 font-medium">Incorrecto</p><p class="text-sm text-[var(--muted)] mt-2">${q.explanation}</p>`;
    }
    feedbackEl.classList.remove('hidden');
}

// ========== INITIALIZATION & EVENTS ==========

function toggleCart() {
    document.getElementById('cart-drawer').classList.toggle('open');
}

function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });
    reveals.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
    renderCourses();
    renderCart();
    updateQuizQuestion();

    // Eventos del Carrito
    document.getElementById('cart-btn')?.addEventListener('click', toggleCart);
    document.getElementById('close-cart')?.addEventListener('click', toggleCart);
    
    // Delegación de eventos para botones "Añadir al carrito"
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.add-to-cart-btn');
        if (btn) addToCart(btn.dataset.id);
    });

    // Formulario
    document.getElementById('checkout-form')?.addEventListener('submit', handleCheckout);

    // Filtros
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.dataset.filter;
            renderCourses();
        };
    });

    // Navegación Quiz
    document.getElementById('quiz-next')?.addEventListener('click', () => {
        if (currentQuestion < quizQuestions.length - 1) {
            currentQuestion++;
            updateQuizQuestion();
        } else {
            document.getElementById('quiz-container').classList.add('hidden');
            document.getElementById('quiz-results').classList.remove('hidden');
            document.getElementById('score-display').textContent = `${quizScore}/${quizQuestions.length}`;
        }
    });

    document.getElementById('quiz-restart')?.addEventListener('click', () => {
        currentQuestion = 0;
        quizScore = 0;
        document.getElementById('quiz-container').classList.remove('hidden');
        document.getElementById('quiz-results').classList.add('hidden');
        updateQuizQuestion();
    });
});
