document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Add the header accent line
    const headerAccent = document.createElement('div');
    headerAccent.className = 'header-accent';
    document.body.appendChild(headerAccent);
    
    // Digital Globe Background Effect
    const createDigitalGlobe = () => {
        // Create container for the canvas
        const globeContainer = document.createElement('div');
        globeContainer.className = 'digital-globe-container';
        document.body.appendChild(globeContainer);
        
        // Create canvas element
        const canvas = document.createElement('canvas');
        canvas.id = 'digital-globe-canvas';
        globeContainer.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        // Call once to initialize
        resizeCanvas();
        
        // Resize on window resize
        window.addEventListener('resize', resizeCanvas);
        
        // Globe parameters
        const globeRadius = Math.min(canvas.width, canvas.height) * 0.3;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Points and connections
        const points = [];
        const numPoints = 50;
        const connections = [];
        const maxConnections = 40;
        
        // Define globe color from CSS variables
        const computedStyle = getComputedStyle(document.documentElement);
        const globeColor = computedStyle.getPropertyValue('--globe-color') || 'rgba(230, 57, 70, 0.4)';
        const lineColor = computedStyle.getPropertyValue('--globe-line-color') || 'rgba(248, 150, 30, 0.4)';
        
        // Create points on the globe surface
        for (let i = 0; i < numPoints; i++) {
            // Generate a random point on a sphere (using spherical coordinates)
            const theta = Math.random() * 2 * Math.PI; // longitude
            const phi = Math.acos(2 * Math.random() - 1); // latitude
            
            // Convert to Cartesian coordinates
            const x = globeRadius * Math.sin(phi) * Math.cos(theta);
            const y = globeRadius * Math.sin(phi) * Math.sin(theta);
            const z = globeRadius * Math.cos(phi);
            
            // Store the point
            points.push({
                x: x,
                y: y,
                z: z,
                size: Math.random() * 2 + 1,
                theta: theta,    // Save for rotation
                phi: phi,        // Save for rotation
                speedMultiplier: Math.random() * 0.5 + 0.5
            });
        }
        
        // Create random connections between points
        for (let i = 0; i < maxConnections; i++) {
            const pointA = Math.floor(Math.random() * numPoints);
            const pointB = Math.floor(Math.random() * numPoints);
            
            // Avoid self-connections and duplicates
            if (pointA !== pointB && 
                !connections.some(conn => 
                    (conn.a === pointA && conn.b === pointB) || 
                    (conn.a === pointB && conn.b === pointA))) {
                connections.push({
                    a: pointA,
                    b: pointB,
                    progress: 0,
                    speed: Math.random() * 0.01 + 0.005,
                    active: false,
                    delay: Math.floor(Math.random() * 200)
                });
            }
        }
        
        // Animation function
        let rotationSpeed = 0.0005;
        let animationFrame;
        let frameCount = 0;
        
        function animate() {
            frameCount++;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Rotation angle based on time
            const rotationAngle = performance.now() * rotationSpeed;
            
            // Update points position based on rotation
            points.forEach(point => {
                // Rotate around Y axis
                const newTheta = point.theta + rotationAngle * point.speedMultiplier;
                
                // Recalculate x and z based on new theta
                point.x = globeRadius * Math.sin(point.phi) * Math.cos(newTheta);
                point.z = globeRadius * Math.cos(point.phi);
                
                // Project 3D to 2D
                const scale = 400 / (400 + point.z); // Perspective projection
                const x2d = centerX + point.x * scale;
                const y2d = centerY + point.y * scale;
                
                // Draw points only if they're on the visible side of the globe
                if (point.z < globeRadius * 0.2) {
                    // Draw points
                    ctx.beginPath();
                    ctx.arc(x2d, y2d, point.size * scale, 0, Math.PI * 2);
                    ctx.fillStyle = globeColor;
                    ctx.fill();
                }
                
                // Store projected coordinates for line drawing
                point.x2d = x2d;
                point.y2d = y2d;
                point.visible = (point.z < globeRadius * 0.2);
                point.scale = scale;
            });
            
            // Draw connections
            connections.forEach(connection => {
                const pointA = points[connection.a];
                const pointB = points[connection.b];
                
                // Only draw connections if at least one point is visible
                if (pointA.visible || pointB.visible) {
                    // Start animation with delay
                    if (frameCount > connection.delay) {
                        connection.active = true;
                    }
                    
                    if (connection.active) {
                        connection.progress += connection.speed;
                        if (connection.progress > 1) {
                            connection.progress = 1;
                        }
                        
                        // Draw line with progress animation
                        const startX = pointA.x2d;
                        const startY = pointA.y2d;
                        const endX = pointB.x2d;
                        const endY = pointB.y2d;
                        
                        const currentX = startX + (endX - startX) * connection.progress;
                        const currentY = startY + (endY - startY) * connection.progress;
                        
                        ctx.beginPath();
                        ctx.moveTo(startX, startY);
                        ctx.lineTo(currentX, currentY);
                        
                        // Line style
                        ctx.strokeStyle = lineColor;
                        ctx.lineWidth = Math.min(pointA.scale, pointB.scale) * 1.5;
                        ctx.stroke();
                        
                        // Draw small pulsing circle at the progress point
                        if (connection.progress < 1) {
                            ctx.beginPath();
                            const pulseSize = (Math.sin(performance.now() * 0.01) + 1) * 2 + 2;
                            ctx.arc(currentX, currentY, pulseSize * Math.min(pointA.scale, pointB.scale), 0, Math.PI * 2);
                            ctx.fillStyle = lineColor;
                            ctx.fill();
                        }
                    }
                }
                
                // Reset completed connections with random delay
                if (connection.progress >= 1 && Math.random() < 0.005) {
                    connection.progress = 0;
                    connection.active = false;
                    connection.delay = frameCount + Math.floor(Math.random() * 100);
                }
            });
            
            animationFrame = requestAnimationFrame(animate);
        }
        
        // Start animation
        animate();
        
        // Cleanup function to cancel animation when needed
        return function cleanup() {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    };
    
    // Initialize the digital globe effect
    const cleanupGlobe = createDigitalGlobe();
    
    // Professional fade-in typing effect for headings (if any)
    const typeWriterElements = document.querySelectorAll('.typewriter');
    
    typeWriterElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        
        let i = 0;
        const speed = 70; // typing speed in ms
        
        function typeWriter() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            }
        }
        
        // Start typing with a slight delay for better effect
        setTimeout(typeWriter, 300);
    });
    
    // Add active class to current page link
    const currentLocation = window.location.pathname;
    const navLinks2 = document.querySelectorAll('.nav-link');
    
    navLinks2.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentLocation || 
            (linkPath === '/' && currentLocation === '/index.html') || 
            (linkPath === '/' && currentLocation === '/')) {
            link.style.color = getComputedStyle(document.documentElement).getPropertyValue('--accent-color');
            link.classList.add('active');
        }
    });
    
    // Subtle parallax effect for elements with .parallax class
    const parallaxElements = document.querySelectorAll('.parallax');
    
    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', function() {
            const scrollY = window.scrollY;
            
            parallaxElements.forEach(element => {
                const speed = element.getAttribute('data-speed') || 0.2;
                element.style.transform = `translateY(${scrollY * speed}px)`;
            });
        });
    }
    
    // Add reveal animation for sections as they come into view
    const revealElements = document.querySelectorAll('.reveal-element');
    
    function revealOnScroll() {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;
        
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('revealed');
            }
        });
    }
    
    // Add CSS for reveal animation
    const revealStyle = document.createElement('style');
    revealStyle.textContent = `
        .reveal-element {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .reveal-element.revealed {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(revealStyle);
    
    // Call reveal function on scroll and on load
    window.addEventListener('scroll', revealOnScroll);
    window.addEventListener('load', revealOnScroll);
    
    // Elegant hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            element.style.transition = 'all 0.3s ease';
        });
    });
    
    // Subtle background gradient animation
    const body = document.querySelector('body');
    if (body) {
        const gradientOverlay = document.createElement('div');
        gradientOverlay.className = 'gradient-overlay';
        gradientOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 50% 50%, rgba(29, 53, 87, 0.3), rgba(10, 10, 10, 0));
            pointer-events: none;
            z-index: -1;
            opacity: 0.7;
        `;
        body.appendChild(gradientOverlay);
    }
    
    // Add subtle hover effect for paragraphs that aren't in forms
    const paragraphs = Array.from(document.querySelectorAll('p')).filter(p => {
        return !p.closest('form') && 
              !p.querySelector('input') && 
              !p.querySelector('textarea') && 
              !p.querySelector('select') &&
              !p.querySelector('button');
    });
    
    paragraphs.forEach(p => {
        p.addEventListener('mouseenter', function() {
            p.style.transition = 'transform 0.3s ease, color 0.3s ease';
            p.style.color = getComputedStyle(document.documentElement).getPropertyValue('--hover-color');
        });
        
        p.addEventListener('mouseleave', function() {
            p.style.transition = 'transform 0.3s ease, color 0.3s ease';
            p.style.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
        });
    });
    
    // Subtle audio feedback for navigation elements - modern and professional
    const allLinks = document.querySelectorAll('a');
    
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only play sound if it's not a regular page navigation
            if (link.getAttribute('target') === '_blank' || link.getAttribute('href').startsWith('#')) {
                const audio = new Audio();
                audio.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHCMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq19fX19fX19fX19fX19fX19fX19fX19fX1////////////////////wAAAABMYXZjNTguMTM0AAAAAAAAAAAAAAAAJAXoAAAAAAAAtmDHE5MAAAAAAAAAAAAAAAAAAAAAP+MYxAANEAK1/TQAAPL7Jvwf+kf5H/ke+kf5Hu0v8ArE3NLrmvt193voe7t3Vu7vJcKggCAIZO5M9M+ru5OXMzM0M3cyGiIeIjue6+iefLVVVVVVVVVVVVVVVVVVVVVVVVVRERERzPd3d/ERERET7u7u70REREQ==';
                audio.volume = 0.05;
                audio.play();
            }
        });
    });
    
    // IMPORTANT: Prevent any effects from affecting form elements
    const formElements = document.querySelectorAll('form, form *, input, textarea, select, button, label');
    formElements.forEach(el => {
        el.classList.add('no-effect');
    });
});