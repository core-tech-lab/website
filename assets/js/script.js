document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animations
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Load site data from JSON
    loadSiteData();

    // Navbar scroll behavior
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('main-navbar');
        if (window.scrollY > 50) {
            navbar.style.padding = '10px 0';
            navbar.style.backgroundColor = 'rgba(15, 23, 42, 0.95)';
        } else {
            navbar.style.padding = '20px 0';
            navbar.style.backgroundColor = 'rgba(15, 23, 42, 0.8)';
        }
    });

    // Form submission handler (prevent default for demo)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('This is a demo website. Message submission is not enabled.');
        });
    }
});

// Load site data from JSON file
function loadSiteData() {
    fetch('assets/js/data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Once data is loaded, populate the DOM
            populateSiteContent(data);
        })
        .catch(error => {
            console.error('Error loading site data:', error);
        });
}

// Populate website content from JSON data
function populateSiteContent(data) {
    // Site Info
    document.title = data.siteInfo.title;
    document.getElementById('navbar-title').textContent = data.siteInfo.title;
    document.getElementById('navbar-logo').src = data.siteInfo.logo;
    document.getElementById('hero-tagline').textContent = data.siteInfo.tagline;
    document.getElementById('mission-statement').textContent = data.siteInfo.missionStatement;

    // Navigation
    populateNavigation(data.navigation);

    // Hero section
    document.getElementById('hero').style.backgroundImage = `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.9)), url('${data.hero.backgroundImage}')`;
    const heroCta = document.getElementById('hero-cta');
    heroCta.href = data.hero.ctaButton.link;
    document.getElementById('hero-cta-text').textContent = data.hero.ctaButton.text;

    // About section
    document.getElementById('professor-name').textContent = data.about.professorName;
    document.getElementById('professor-title').textContent = data.about.title;
    document.getElementById('professor-image').src = data.about.profileImage;
    document.getElementById('professor-bio').textContent = data.about.biography;
    document.getElementById('professor-philosophy').textContent = data.about.philosophy;
    document.getElementById('professor-quote').textContent = data.about.quote;
    
    // Professor achievements
    const achievementsList = document.getElementById('professor-achievements');
    data.about.achievements.forEach(achievement => {
        const li = document.createElement('li');
        li.textContent = achievement;
        achievementsList.appendChild(li);
    });

    // Courses section
    populateCourses(data.courses);

    // Bots section
    populateBots(data.bots);

    // Tech Stack section
    populateTechStack(data.techStack);

    // Join section
    populateJoinSection(data.join);

    // Contact section
    populateContactSection(data.contact);

    // After all content is loaded, refresh AOS
    AOS.refresh();

    // Initialize Bootstrap components
    initializeBootstrapComponents();
}

// Populate navigation links
function populateNavigation(navItems) {
    const navLinksContainer = document.getElementById('nav-links');
    navLinksContainer.innerHTML = '';

    navItems.forEach(item => {
        const li = document.createElement('li');
        li.className = 'nav-item';
        
        const a = document.createElement('a');
        a.className = 'nav-link';
        a.href = item.link;
        a.textContent = item.name;
        
        li.appendChild(a);
        navLinksContainer.appendChild(li);
    });
}

// Populate courses section
function populateCourses(courses) {
    const coursesContainer = document.getElementById('courses-container');
    coursesContainer.innerHTML = '';

    courses.forEach((course, index) => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';
        col.setAttribute('data-aos', 'fade-up');
        col.setAttribute('data-aos-delay', 100 + (index * 100));

        col.innerHTML = `
            <div class="course-card">
                <div class="position-relative">
                    <img src="${course.image}" class="card-img-top" alt="${course.title}">
                    <span class="course-level">${course.level}</span>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${course.title}</h5>
                    <p class="card-text">${course.description}</p>
                    <span class="course-duration">
                        <i class="bi bi-clock me-1"></i> ${course.duration}
                    </span>
                </div>
            </div>
        `;

        coursesContainer.appendChild(col);
    });
}

// Populate bots section
function populateBots(bots) {
    const botsContainer = document.getElementById('bots-container');
    botsContainer.innerHTML = '';

    bots.forEach((bot, index) => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-3';
        col.setAttribute('data-aos', 'fade-up');
        col.setAttribute('data-aos-delay', 100 + (index * 100));

        col.innerHTML = `
            <div class="bot-card">
                <div class="bot-image-container">
                    <img src="${bot.image}" alt="${bot.name}">
                    <div class="bot-nickname">${bot.nickname}</div>
                </div>
                <div class="card-body p-3">
                    <h5 class="card-title">${bot.name}</h5>
                    <span class="bot-role">${bot.role}</span>
                    <p class="card-text mt-2">${bot.story}</p>
                </div>
            </div>
        `;

        botsContainer.appendChild(col);
    });
}

// Populate tech stack section
function populateTechStack(techStack) {
    const techStackTabs = document.getElementById('tech-stack-tabs');
    const techStackContent = document.getElementById('tech-stack-content');
    
    techStackTabs.innerHTML = '';
    techStackContent.innerHTML = '';

    // Create tabs and content for each category
    techStack.forEach((category, index) => {
        // Create tab
        const li = document.createElement('li');
        li.className = 'nav-item';
        li.innerHTML = `
            <button class="nav-link ${index === 0 ? 'active' : ''}" 
                    id="tech-tab-${index}" 
                    data-bs-toggle="pill" 
                    data-bs-target="#tech-content-${index}" 
                    type="button" 
                    role="tab" 
                    aria-controls="tech-content-${index}" 
                    aria-selected="${index === 0 ? 'true' : 'false'}">
                ${category.category}
            </button>
        `;
        techStackTabs.appendChild(li);

        // Create content
        const tabPane = document.createElement('div');
        tabPane.className = `tab-pane fade ${index === 0 ? 'show active' : ''}`;
        tabPane.id = `tech-content-${index}`;
        tabPane.setAttribute('role', 'tabpanel');
        tabPane.setAttribute('aria-labelledby', `tech-tab-${index}`);

        // Create row for items
        const row = document.createElement('div');
        row.className = 'row g-4';

        // Add items to row
        category.items.forEach((item, itemIndex) => {
            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4';
            col.setAttribute('data-aos', 'fade-up');
            col.setAttribute('data-aos-delay', 100 + (itemIndex * 100));

            col.innerHTML = `
                <div class="tech-item">
                    <div class="tech-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="p-3">
                        <h5>${item.name}</h5>
                        <p>${item.description}</p>
                    </div>
                </div>
            `;

            row.appendChild(col);
        });

        tabPane.appendChild(row);
        techStackContent.appendChild(tabPane);
    });
}

// Populate join section
function populateJoinSection(joinData) {
    // Why join list
    const whyJoinList = document.getElementById('why-join-list');
    whyJoinList.innerHTML = '';
    joinData.whyJoin.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        whyJoinList.appendChild(li);
    });

    // What you'll learn list
    const whatYouLearnList = document.getElementById('what-you-learn-list');
    whatYouLearnList.innerHTML = '';
    joinData.whatYouLearn.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        whatYouLearnList.appendChild(li);
    });

    // Welcome message
    document.getElementById('welcome-message').textContent = joinData.welcomeMessage;

    // CTA button
    const joinCta = document.getElementById('join-cta');
    joinCta.href = joinData.ctaButton.link;
    document.getElementById('join-cta-text').textContent = joinData.ctaButton.text;
}

// Populate contact section
function populateContactSection(contactData) {
    document.getElementById('contact-email').textContent = contactData.email;
    document.getElementById('contact-phone').textContent = contactData.phone;
    document.getElementById('contact-address').textContent = contactData.address;

    // Social media icons
    const socialIcons = document.getElementById('social-icons');
    socialIcons.innerHTML = '';
    
    contactData.socialMedia.forEach(social => {
        const a = document.createElement('a');
        a.href = social.link;
        a.className = 'social-icon';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.innerHTML = `<i class="bi ${social.icon}"></i>`;
        socialIcons.appendChild(a);
    });
}

// Initialize Bootstrap components
function initializeBootstrapComponents() {
    // Enable all tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for navbar
                    behavior: 'smooth'
                });
            }
            
            // Close mobile menu if open
            const navbarToggler = document.querySelector('.navbar-toggler');
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    });
}