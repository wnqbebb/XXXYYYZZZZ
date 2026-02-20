# Animaciones Basadas en Scroll

## Parallax Effects

### Parallax Básico

```typescript
// ✅ Parallax simple con Lenis
lenis.on('scroll', ({ scroll, velocity }) => {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  parallaxElements.forEach((el) => {
    const speed = parseFloat(el.dataset.parallax || '0.5');
    const yPos = scroll * speed;
    el.style.transform = `translate3d(0, ${yPos}px, 0)`;
  });
});
```

### Parallax con GSAP

```typescript
// ✅ Parallax suave con GSAP + Lenis
gsap.utils.toArray('[data-parallax]').forEach((element: HTMLElement) => {
  const speed = parseFloat(element.dataset.parallax || '0.5');
  
  gsap.to(element, {
    y: () => window.innerHeight * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
});
```

### Parallax Direccional

```typescript
// ✅ Parallax hacia arriba y abajo
const parallaxUp = document.querySelectorAll('.parallax-up');
const parallaxDown = document.querySelectorAll('.parallax-down');

parallaxUp.forEach((el) => {
  gsap.to(el, {
    y: -100,
    scrollTrigger: {
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
});

parallaxDown.forEach((el) => {
  gsap.to(el, {
    y: 100,
    scrollTrigger: {
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
});
```

---

## Velocity-Based Effects

### Skew Effect

```typescript
// ✅ Skew basado en velocidad
let currentSkew = 0;
const skewTarget = { value: 0 };

lenis.on('scroll', ({ velocity }) => {
  // Mapear velocidad a skew (-5 a 5 grados)
  skewTarget.value = Math.max(-5, Math.min(5, velocity * 0.1));
});

// Animar suavemente al target
function updateSkew() {
  currentSkew += (skewTarget.value - currentSkew) * 0.1;
  
  document.querySelectorAll('.skew-on-scroll').forEach((el) => {
    el.style.transform = `skewY(${currentSkew}deg)`;
  });
  
  requestAnimationFrame(updateSkew);
}
updateSkew();
```

### Scale on Velocity

```typescript
// ✅ Scale basado en velocidad
lenis.on('scroll', ({ velocity }) => {
  const scale = 1 + Math.abs(velocity) * 0.001;
  document.querySelector('.scale-element').style.transform = `scale(${scale})`;
});
```

### Opacity on Velocity

```typescript
// ✅ Opacity basada en velocidad
lenis.on('scroll', ({ velocity }) => {
  const opacity = Math.max(0.5, 1 - Math.abs(velocity) * 0.01);
  document.querySelector('.fade-on-speed').style.opacity = opacity;
});
```

---

## Scroll Progress Animations

### Reading Progress Bar

```typescript
// ✅ Barra de progreso de lectura
lenis.on('scroll', ({ progress }) => {
  const progressBar = document.querySelector('.reading-progress');
  progressBar.style.transform = `scaleX(${progress})`;
});
```

```css
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: #007bff;
  transform-origin: left;
  transform: scaleX(0);
  z-index: 9999;
}
```

### Section Progress

```typescript
// ✅ Progreso por sección
gsap.utils.toArray('.section').forEach((section: HTMLElement) => {
  const progressBar = section.querySelector('.section-progress');
  
  gsap.to(progressBar, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
    },
  });
});
```

---

## Reveal Animations

### Fade Up Reveal

```typescript
// ✅ Reveal al entrar en viewport
gsap.utils.toArray('.reveal').forEach((element: HTMLElement) => {
  gsap.fromTo(
    element,
    { y: 50, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    }
  );
});
```

### Stagger Reveal

```typescript
// ✅ Stagger reveal para listas
const lists = document.querySelectorAll('.stagger-list');

lists.forEach((list) => {
  const items = list.querySelectorAll('.stagger-item');
  
  gsap.fromTo(
    items,
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: list,
        start: 'top 75%',
      },
    }
  );
});
```

### Image Reveal

```typescript
// ✅ Reveal de imagen con clip-path
gsap.utils.toArray('.image-reveal').forEach((container: HTMLElement) => {
  const image = container.querySelector('img');
  
  gsap.fromTo(
    container,
    { clipPath: 'inset(100% 0 0 0)' },
    {
      clipPath: 'inset(0% 0 0 0)',
      duration: 1.2,
      ease: 'power3.inOut',
      scrollTrigger: {
        trigger: container,
        start: 'top 70%',
      },
    }
  );
  
  gsap.fromTo(
    image,
    { scale: 1.3 },
    {
      scale: 1,
      duration: 1.4,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 70%',
      },
    }
  );
});
```

---

## Pinning Effects

### Basic Pin

```typescript
// ✅ Pinear sección
gsap.to('.pinned-content', {
  scrollTrigger: {
    trigger: '.pin-section',
    start: 'top top',
    end: '+=500',
    pin: true,
    pinSpacing: true,
  },
});
```

### Pin with Animation

```typescript
// ✅ Pin con animación durante el scroll
gsap.to('.pinned-element', {
  rotation: 360,
  scale: 1.5,
  scrollTrigger: {
    trigger: '.pin-section',
    start: 'top top',
    end: '+=1000',
    pin: true,
    scrub: 1,
  },
});
```

### Stack Cards

```typescript
// ✅ Efecto de stack de tarjetas
const cards = gsap.utils.toArray('.stack-card');

cards.forEach((card: HTMLElement, i) => {
  gsap.to(card, {
    scale: 0.9,
    filter: 'brightness(0.5)',
    scrollTrigger: {
      trigger: card,
      start: 'top 20%',
      end: 'top top',
      scrub: true,
    },
  });
});
```

---

## Horizontal Scroll

### Horizontal Section

```typescript
// ✅ Scroll horizontal con Lenis
const lenis = new Lenis({
  orientation: 'horizontal',
  gestureOrientation: 'both',
});

// Animación horizontal
gsap.to('.horizontal-track', {
  x: () => -(document.querySelector('.horizontal-track').scrollWidth - window.innerWidth),
  ease: 'none',
  scrollTrigger: {
    trigger: '.horizontal-section',
    start: 'top top',
    end: () => '+=' + document.querySelector('.horizontal-track').scrollWidth,
    pin: true,
    scrub: 1,
  },
});
```

### Horizontal with Vertical

```typescript
// ✅ Scroll horizontal dentro de scroll vertical
const horizontalSection = document.querySelector('.horizontal-wrapper');
const horizontalContent = horizontalSection.querySelector('.horizontal-content');

gsap.to(horizontalContent, {
  x: () => -(horizontalContent.scrollWidth - window.innerWidth),
  ease: 'none',
  scrollTrigger: {
    trigger: horizontalSection,
    start: 'top top',
    end: () => '+=' + (horizontalContent.scrollWidth - window.innerWidth),
    pin: true,
    scrub: 1,
    invalidateOnRefresh: true,
  },
});
```

---

## Snap Points

### Basic Snap

```typescript
// ✅ Snap a secciones
lenis.on('scroll', ({ scroll, velocity }) => {
  // Solo snap cuando el scroll se detiene
  if (Math.abs(velocity) > 0.1) return;
  
  const sections = document.querySelectorAll('.snap-section');
  const windowHeight = window.innerHeight;
  
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const sectionCenter = rect.top + rect.height / 2;
    const viewportCenter = windowHeight / 2;
    
    if (Math.abs(sectionCenter - viewportCenter) < 100) {
      lenis.scrollTo(section, { duration: 0.8 });
    }
  });
});
```

### GSAP Snap Plugin Style

```typescript
// ✅ Snap con GSAP
ScrollTrigger.create({
  snap: {
    snapTo: (progress, self) => {
      const sections = gsap.utils.toArray('.snap-section');
      const sectionStarts = sections.map((section) => {
        const st = ScrollTrigger.create({ trigger: section, start: 'top top' });
        return st.start / ScrollTrigger.maxScroll(window);
      });
      
      return gsap.utils.snap(sectionStarts, progress);
    },
    duration: { min: 0.2, max: 0.5 },
    delay: 0,
    ease: 'power2.inOut',
  },
});
```

---

## Text Animations

### Split Text Reveal

```typescript
// ✅ Animación de texto letra por letra
const splitText = document.querySelectorAll('.split-text');

splitText.forEach((text) => {
  const chars = text.textContent.split('');
  text.innerHTML = chars.map(char => 
    `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`
  ).join('');
  
  gsap.fromTo(
    text.querySelectorAll('.char'),
    { y: 100, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.02,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: text,
        start: 'top 80%',
      },
    }
  );
});
```

### Scramble Text

```typescript
// ✅ Efecto de scramble al scroll
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function scrambleText(element: HTMLElement, finalText: string) {
  let iteration = 0;
  const interval = setInterval(() => {
    element.textContent = finalText
      .split('')
      .map((char, index) => {
        if (index < iteration) return finalText[index];
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join('');
    
    if (iteration >= finalText.length) clearInterval(interval);
    iteration += 1 / 3;
  }, 30);
}

// Trigger on scroll
ScrollTrigger.create({
  trigger: '.scramble-text',
  start: 'top 70%',
  onEnter: ({ trigger }) => {
    scrambleText(trigger, trigger.dataset.text);
  },
});
```

---

## Performance Tips

```yaml
ANIMATION_PERFORMANCE:
  MUST:
    - [ ] Usar transform y opacity (GPU accelerated)
    - [ ] Usar will-change antes de animar
    - [ ] Limitar número de elementos animados simultáneamente
    - [ ] Usar scrub: true en lugar de onUpdate cuando sea posible
    - [ ] Remover will-change después de animar
  
  FORBIDDEN:
    - [ ] Animar width, height, top, left (causa reflow)
    - [ ] Usar blur durante scroll
    - [ ] Animar más de 50 elementos a la vez
    - [ ] Usar setState en cada frame de scroll (React)
  
  OPTIMIZACIONES:
    - [ ] Usar contain: layout style paint
    - [ ] Virtualizar listas largas
    - [ ] Usar Intersection Observer para lazy animation
    - [ ] Throttle event handlers
```
