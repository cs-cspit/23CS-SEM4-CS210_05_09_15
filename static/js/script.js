document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Spy-themed typing effect for headings (if any)
    const typeWriterElements = document.querySelectorAll('.typewriter');
    
    typeWriterElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        
        let i = 0;
        const speed = 50; // typing speed in ms
        
        function typeWriter() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed + Math.random() * 100);
            }
        }
        
        typeWriter();
    });
    
    // Add active class to current page link
    const currentLocation = window.location.pathname;
    const navLinks2 = document.querySelectorAll('.nav-link');
    
    navLinks2.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentLocation || 
            (linkPath === '/' && currentLocation === '/index.html') || 
            (linkPath === '/' && currentLocation === '/')) {
            link.style.color = '#00ff8c';
            link.classList.add('active');
        }
    });
    
    // Cursor following effect - spy surveillance theme
    document.addEventListener('mousemove', function(e) {
        const cursor = document.createElement('div');
        cursor.className = 'cursor-trail';
        cursor.style.left = e.pageX + 'px';
        cursor.style.top = e.pageY + 'px';
        document.body.appendChild(cursor);
        
        setTimeout(() => {
            cursor.remove();
        }, 500);
    });
    
    // Add styles for cursor trail
    const style = document.createElement('style');
    style.textContent = `
        .cursor-trail {
            position: absolute;
            width: 5px;
            height: 5px;
            background-color: rgba(0, 255, 140, 0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            animation: pulse 0.5s linear forwards;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); opacity: 0.5; }
            100% { transform: scale(0); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Random code matrix effect in background (spy theme)
    function createMatrixEffect() {
        const matrix = document.createElement('div');
        matrix.className = 'matrix-bg';
        matrix.style.position = 'fixed';
        matrix.style.top = Math.random() * window.innerHeight + 'px';
        matrix.style.left = Math.random() * window.innerWidth + 'px';
        matrix.style.color = 'rgba(0, 255, 140, 0.1)';
        matrix.style.fontSize = '12px';
        matrix.style.fontFamily = 'monospace';
        matrix.style.zIndex = '-1';
        matrix.style.pointerEvents = 'none';
        matrix.style.userSelect = 'none';
        
        // Random code characters
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        const length = Math.floor(Math.random() * 15) + 5;
        let text = '';
        
        for (let i = 0; i < length; i++) {
            text += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        matrix.textContent = text;
        document.body.appendChild(matrix);
        
        setTimeout(() => {
            matrix.remove();
        }, 5000);
    }
    
    // Create matrix effect periodically
    setInterval(createMatrixEffect, 300);
    
    // Add cryptic decoding effect to paragraphs on hover - EXCLUDING ALL FORM CONTENT
    const mainContent = document.querySelector('main');
    if (mainContent) {
        // Only select paragraphs that are not inside forms and don't contain form elements
        const paragraphs = Array.from(mainContent.querySelectorAll('p')).filter(p => {
            return !p.closest('form') && 
                  !p.querySelector('input') && 
                  !p.querySelector('textarea') && 
                  !p.querySelector('select') &&
                  !p.querySelector('button');
        });
        
        paragraphs.forEach(p => {
            const originalText = p.textContent;
            
            p.addEventListener('mouseenter', function() {
                if (!p.classList.contains('decoding')) {
                    p.classList.add('decoding');
                    let iteration = 0;
                    const maxIterations = 3;
                    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
                    
                    const interval = setInterval(() => {
                        p.textContent = originalText.split('')
                            .map((char, index) => {
                                if (char === ' ') return ' ';
                                if (index < iteration / (maxIterations / originalText.length)) {
                                    return originalText[index];
                                }
                                return chars[Math.floor(Math.random() * chars.length)];
                            })
                            .join('');
                        
                        if (iteration >= maxIterations * originalText.length) {
                            clearInterval(interval);
                            p.textContent = originalText;
                            p.classList.remove('decoding');
                        }
                        
                        iteration += 1;
                    }, 30);
                }
            });
        });
    }
    
    // Audio feedback for navigation elements
    const allLinks = document.querySelectorAll('a');
    
    allLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            const audio = new Audio();
            audio.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHCMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq19fX19fX19fX19fX19fX19fX19fX19fX1////////////////////wAAAABMYXZjNTguMTM0AAAAAAAAAAAAAAAAJAXoAAAAAAAAtmDHE5MAAAAAAAAAAAAAAAAAAAAAP+MYxAANEAK1/TQAAPL7Jvwf+kf5H/ke+kf5Hu0v8ArE3NLrmvt193voe7t3Vu7vJcKggCAIZO5M9M+ru5OXMzM0M3cyGiIeIjue6+iefLVVVVVVVVVVVVVVVVVVVVVVVVVRERERzPd3d/ERERET7u7u70REREQ==';
            audio.volume = 0.1;
            audio.play();
        });
    });
    
    // IMPORTANT: Prevent any effects from affecting form elements
    const formElements = document.querySelectorAll('form, form *, input, textarea, select, button, label');
    formElements.forEach(el => {
        el.classList.add('no-effect');
    });
});document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Spy-themed typing effect for headings (if any)
    const typeWriterElements = document.querySelectorAll('.typewriter');
    
    typeWriterElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        
        let i = 0;
        const speed = 50; // typing speed in ms
        
        function typeWriter() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed + Math.random() * 100);
            }
        }
        
        typeWriter();
    });
    
    // Add active class to current page link
    const currentLocation = window.location.pathname;
    const navLinks2 = document.querySelectorAll('.nav-link');
    
    navLinks2.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentLocation || 
            (linkPath === '/' && currentLocation === '/index.html') || 
            (linkPath === '/' && currentLocation === '/')) {
            link.style.color = '#00ff8c';
            link.classList.add('active');
        }
    });
    
    // Cursor following effect - spy surveillance theme
    document.addEventListener('mousemove', function(e) {
        const cursor = document.createElement('div');
        cursor.className = 'cursor-trail';
        cursor.style.left = e.pageX + 'px';
        cursor.style.top = e.pageY + 'px';
        document.body.appendChild(cursor);
        
        setTimeout(() => {
            cursor.remove();
        }, 500);
    });
    
    // Add styles for cursor trail
    const style = document.createElement('style');
    style.textContent = `
        .cursor-trail {
            position: absolute;
            width: 5px;
            height: 5px;
            background-color: rgba(0, 255, 140, 0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            animation: pulse 0.5s linear forwards;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); opacity: 0.5; }
            100% { transform: scale(0); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Random code matrix effect in background (spy theme)
    function createMatrixEffect() {
        const matrix = document.createElement('div');
        matrix.className = 'matrix-bg';
        matrix.style.position = 'fixed';
        matrix.style.top = Math.random() * window.innerHeight + 'px';
        matrix.style.left = Math.random() * window.innerWidth + 'px';
        matrix.style.color = 'rgba(0, 255, 140, 0.1)';
        matrix.style.fontSize = '12px';
        matrix.style.fontFamily = 'monospace';
        matrix.style.zIndex = '-1';
        matrix.style.pointerEvents = 'none';
        matrix.style.userSelect = 'none';
        
        // Random code characters
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        const length = Math.floor(Math.random() * 15) + 5;
        let text = '';
        
        for (let i = 0; i < length; i++) {
            text += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        matrix.textContent = text;
        document.body.appendChild(matrix);
        
        setTimeout(() => {
            matrix.remove();
        }, 5000);
    }
    
    // Create matrix effect periodically
    setInterval(createMatrixEffect, 300);
    
    // Add cryptic decoding effect to paragraphs on hover (except form elements)
    const paragraphs = document.querySelectorAll('p:not(form p)');
    
    paragraphs.forEach(p => {
        const originalText = p.textContent;
        
        p.addEventListener('mouseenter', function() {
            if (!p.classList.contains('decoding')) {
                p.classList.add('decoding');
                let iteration = 0;
                const maxIterations = 3;
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
                
                const interval = setInterval(() => {
                    p.textContent = originalText.split('')
                        .map((char, index) => {
                            if (char === ' ') return ' ';
                            if (index < iteration / (maxIterations / originalText.length)) {
                                return originalText[index];
                            }
                            return chars[Math.floor(Math.random() * chars.length)];
                        })
                        .join('');
                    
                    if (iteration >= maxIterations * originalText.length) {
                        clearInterval(interval);
                        p.textContent = originalText;
                        p.classList.remove('decoding');
                    }
                    
                    iteration += 1;
                }, 30);
            }
        });
    });
    
    // Audio feedback for navigation elements
    const allLinks = document.querySelectorAll('a');
    
    allLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            const audio = new Audio();
            audio.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHCMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq19fX19fX19fX19fX19fX19fX19fX19fX1////////////////////wAAAABMYXZjNTguMTM0AAAAAAAAAAAAAAAAJAXoAAAAAAAAtmDHE5MAAAAAAAAAAAAAAAAAAAAAP+MYxAANEAK1/TQAAPL7Jvwf+kf5H/ke+kf5Hu0v8ArE3NLrmvt193voe7t3Vu7vJcKggCAIZO5M9M+ru5OXMzM0M3cyGiIeIjue6+iefLVVVVVVVVVVVVVVVVVVVVVVVVVRERERzPd3d/ERERET7u7u70REREQ==';
            audio.volume = 0.1;
            audio.play();
        });
    });
});