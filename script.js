// scripts.js - handles cursor, particles, navbar, scroll objects, parallax, canvas controls

/* ---------- Cursor ---------- */
let cursor = null;
let cursorFollower = null;
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

function initCursor() {
    cursor = document.querySelector('.cursor');
    cursorFollower = document.querySelector('.cursor-follower');

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (cursor) {
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        }
    });

    function animateFollower() {
        let distX = mouseX - followerX;
        let distY = mouseY - followerY;
        followerX += distX * 0.1;
        followerY += distY * 0.1;
        if (cursorFollower) {
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';
        }
        requestAnimationFrame(animateFollower);
    }
    animateFollower();
}


/* ---------- Particles ---------- */
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
    particle.style.animationDelay = Math.random() * 2 + 's';
    document.getElementById('particles').appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, 20000);
}

/* ---------- Navbar + Scroll Progress ---------- */
let lastScrollY = window.scrollY || 0;
function initNavbar() {
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        const scrollProgress = document.querySelector('.scroll-progress');
        const currentScrollY = window.scrollY;

        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScrollY = currentScrollY;

        const scrollPercent = (currentScrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        if (scrollProgress) scrollProgress.style.width = scrollPercent + '%';
    });
}

/* ---------- Scroll Objects (floating decorative shapes) ---------- */
const scrollObjectsState = [];

function createScrollObjects() {
    const scrollContainer = document.getElementById('scrollObjects');
    const objectTypes = ['lotus-pattern', 'mandala-wheel', 'geometric-shape', 'spiral-pattern', 'traditional-kolam'];
    
    for (let i = 0; i < 12; i++) {
        const object = document.createElement('div');
        const objectType = objectTypes[Math.floor(Math.random() * objectTypes.length)];
        
        object.className = `scroll-object ${objectType}`;
        object.style.left = Math.random() * 120 - 10 + '%';
        object.style.top = Math.random() * 120 - 10 + '%';
        object.style.animationDelay = Math.random() * 10 + 's';
        object.style.animationDuration = (15 + Math.random() * 10) + 's';
        
        scrollContainer.appendChild(object);
    }
}

function initScrollObjects() {
    const container = document.getElementById('scrollObjects');
    const objects = container.querySelectorAll('.scroll-object');
    
    objects.forEach((obj, index) => {
        scrollObjectsState.push({
            element: obj,
            initialX: parseFloat(obj.style.left),
            initialY: parseFloat(obj.style.top),
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.3,
            rotationSpeed: (Math.random() - 0.5) * 0.8,
            scaleSpeed: 0.1 + Math.random() * 0.2,
            initialRotation: 0,
            initialScale: 1
        });
    });
}

function updateScrollObjects() {
    const scrollY = window.pageYOffset;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollProgress = scrollY / (maxScroll || 1);
    
    scrollObjectsState.forEach((obj, index) => {
        const element = obj.element;
        const moveX = obj.initialX + (scrollY * obj.speedX * 0.1);
        const moveY = obj.initialY + (scrollY * obj.speedY * 0.1);
        const rotation = obj.initialRotation + (scrollY * obj.rotationSpeed);
        const scale = obj.initialScale + (Math.sin(scrollProgress * Math.PI * 2 + index) * obj.scaleSpeed);
        const opacity = 0.05 + Math.abs(Math.sin(scrollProgress * Math.PI * 3 + index)) * 0.25;

        const wrappedX = ((moveX % 120) + 120) % 120;
        const wrappedY = ((moveY % 120) + 120) % 120;

        element.style.transform = `
            translateX(${wrappedX - obj.initialX}vw) 
            translateY(${wrappedY - obj.initialY}vh) 
            rotate(${rotation}deg) 
            scale(${Math.max(0.5, scale)})
        `;
        element.style.opacity = opacity;
    });
}

/* ---------- Parallax + mouse-based moves ---------- */
function initParallaxAndScrollEffects() {
    window.addEventListener('scroll', () => {
        updateScrollObjects();
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.section-bg, .mandala-center, .geo-shape');
        parallaxElements.forEach((element, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });

        // 3D transform for feature cards
        const features = document.querySelectorAll('.feature-card');
        features.forEach((card) => {
            const rect = card.getBoundingClientRect();
            const centerY = rect.top + rect.height / 2;
            const screenCenter = window.innerHeight / 2;
            const distance = (centerY - screenCenter) / screenCenter;
            card.style.transform = `
                rotateX(${distance * 10}deg) 
                rotateY(${distance * 5}deg) 
                translateZ(${Math.abs(distance) * 50}px)
            `;
        });
    });

    document.addEventListener('mousemove', (e) => {
        const mx = (e.clientX / window.innerWidth) - 0.5;
        const my = (e.clientY / window.innerHeight) - 0.5;

        const geoShapes = document.querySelectorAll('.geo-shape');
        geoShapes.forEach((shape, index) => {
            const intensity = 30 + (index * 10);
            const x = mx * intensity;
            const y = my * intensity;
            // keep existing transform rotation animations by appending translate
            shape.style.transform = (shape.style.transform || '') + ` translate(${x}px, ${y}px)`;
        });

        const mandala = document.querySelector('.mandala-center');
        if (mandala) {
            const x = mx * 20;
            const y = my * 20;
            mandala.style.transform = `translateY(-50%) translate(${x}px, ${y}px)`;
        }
    });
}

/* ---------- Smooth link scroll ---------- */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* ---------- Intersection observer for reveal animations ---------- */
function initObservers() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .gallery-item, .section-title, .section-subtitle').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px) rotateX(10deg)';
        el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });
}

/* ---------- Canvas (interactive dots) ---------- */
let isDrawing = false;
let symmetryMode = false;
const dots = [];
let canvasEl = null;

function initCanvas() {
    canvasEl = document.getElementById('mainCanvas');
    if (!canvasEl) return;
    canvasEl.innerHTML = '';
    dots.length = 0;

    for (let i = 0; i < 100; i++) {
        const dot = document.createElement('div');
        dot.style.position = 'absolute';
        dot.style.width = '6px';
        dot.style.height = '6px';
        dot.style.backgroundColor = 'rgba(255, 107, 53, 0.4)';
        dot.style.borderRadius = '50%';
        dot.style.left = Math.random() * 95 + '%';
        dot.style.top = Math.random() * 95 + '%';
        dot.style.transition = 'all 0.3s ease';
        dot.style.cursor = 'pointer';
        
        dot.addEventListener('mouseenter', () => {
            dot.style.backgroundColor = '#ff6b35';
            dot.style.transform = 'scale(2)';
            dot.style.boxShadow = '0 0 20px rgba(255, 107, 53, 0.8)';
        });
        
        dot.addEventListener('mouseleave', () => {
            setTimeout(() => {
                dot.style.backgroundColor = 'rgba(255, 107, 53, 0.4)';
                dot.style.transform = 'scale(1)';
                dot.style.boxShadow = 'none';
            }, 200);
        });
        
        canvasEl.appendChild(dot);
        dots.push(dot);
    }
}

/* Canvas control functions used in markup */
function clearCanvas() {
    initCanvas();
}

function toggleSymmetry(btn) {
    symmetryMode = !symmetryMode;
    if (!btn) return;
    btn.textContent = symmetryMode ? 'Symmetry: ON' : 'Toggle Symmetry';
    btn.style.background = symmetryMode ? 'rgba(255, 107, 53, 0.6)' : 'rgba(255, 107, 53, 0.2)';
}

function randomPattern() {
    dots.forEach((dot, index) => {
        setTimeout(() => {
            dot.style.backgroundColor = '#ff6b35';
            dot.style.transform = 'scale(1.5)';
            dot.style.boxShadow = '0 0 15px rgba(255, 107, 53, 0.8)';
            
            setTimeout(() => {
                dot.style.backgroundColor = 'rgba(255, 107, 53, 0.6)';
                dot.style.transform = 'scale(1)';
            }, 500);
        }, index * 20);
    });
}

function saveArt() {
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');
    tempCanvas.width = 800;
    tempCanvas.height = 600;
    
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    
    dots.forEach(dot => {
        const rect = dot.getBoundingClientRect();
        const canvasRect = canvasEl.getBoundingClientRect();
        const x = ((rect.left - canvasRect.left) / canvasRect.width) * tempCanvas.width;
        const y = ((rect.top - canvasRect.top) / canvasRect.height) * tempCanvas.height;
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ff6b35';
        ctx.fill();
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff6b35';
    });
    
    const link = document.createElement('a');
    link.download = 'my-kolam-creation.png';
    link.href = tempCanvas.toDataURL();
    link.click();
}

/* ---------- Hover effects for buttons ---------- */
function initButtonHoverEffects() {
    document.querySelectorAll('.btn, .control-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            if (cursor) {
                cursor.style.transform = 'scale(2)';
                cursor.style.backgroundColor = 'rgba(255, 107, 53, 0.3)';
            }
        });
        
        btn.addEventListener('mouseleave', () => {
            if (cursor) {
                cursor.style.transform = 'scale(1)';
                cursor.style.backgroundColor = '#ff6b35';
            }
        });
    });
}

/* ---------- Initialization on load ---------- */
window.addEventListener('load', () => {
    initCursor();
    initNavbar();
    createScrollObjects();
    initScrollObjects();
    initParallaxAndScrollEffects();
    initSmoothScroll();
    initObservers();
    initButtonHoverEffects();
    initCanvas();

    // Add initial particles
    for (let i = 0; i < 20; i++) {
        setTimeout(() => createParticle(), i * 100);
    }

    // Create particles continuously
    setInterval(createParticle, 300);
});
