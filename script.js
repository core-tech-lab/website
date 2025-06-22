document.addEventListener("DOMContentLoaded", function () {
  // Initialize AOS animations
  AOS.init({
    duration: 800,
    easing: "ease-in-out",
    once: true,
    mirror: false,
  });

  // Set current year in footer
  document.getElementById("current-year").textContent =
    new Date().getFullYear();

  // Load site data from JSON
  loadSiteData();

  // Navbar scroll behavior
  window.addEventListener("scroll", function () {
    const navbar = document.getElementById("main-navbar");
    if (window.scrollY > 50) {
      navbar.style.padding = "10px 0";
      navbar.style.backgroundColor = "rgba(15, 23, 42, 0.95)";
    } else {
      navbar.style.padding = "20px 0";
      navbar.style.backgroundColor = "rgba(15, 23, 42, 0.8)";
    }
  });

  // Form submission handler (prevent default for demo)
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("This is a demo website. Message submission is not enabled.");
    });
  }
});

// Load site data from JSON file
function loadSiteData() {
  fetch("data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Once data is loaded, populate the DOM
      populateSiteContent(data);
    })
    .catch((error) => {
      console.error("Error loading site data:", error);
    });
}

// Populate website content from JSON data
function populateSiteContent(data) {
  // Site Info
  document.title = data.siteInfo.title;
  document.getElementById("navbar-title").textContent = data.siteInfo.title;
  document.getElementById("navbar-logo").src = data.siteInfo.logo;
  document.getElementById("hero-tagline").textContent = data.siteInfo.tagline;
  document.getElementById("mission-statement").textContent =
    data.siteInfo.missionStatement;

  // Navigation
  populateNavigation(data.navigation);

  // Hero section
  document.getElementById(
    "hero"
  ).style.backgroundImage = `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.9)), url('${data.hero.backgroundImage}')`;
  const heroCta = document.getElementById("hero-cta");
  heroCta.href = data.hero.ctaButton.link;
  document.getElementById("hero-cta-text").textContent =
    data.hero.ctaButton.text;

  // Strategy section population
  populateStrategy(data.strategy);

  // Courses section
  populateCourses(data.courses);

  // Bots section
  populateBots(data.bots);

  // Tech Stack section
  const display = createProductRotationDisplay(data.techStack); 


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
  const navLinksContainer = document.getElementById("nav-links");
  navLinksContainer.innerHTML = "";

  navItems.forEach((item) => {
    const li = document.createElement("li");
    li.className = "nav-item";

    const a = document.createElement("a");
    a.className = "nav-link";
    a.href = item.link;
    a.textContent = item.name;

    li.appendChild(a);
    navLinksContainer.appendChild(li);
  });
}

// Populate strategy section
function populateStrategy(strategy) {
  document.getElementById("club-objective-title").textContent =
    strategy.clubObjective.title;
  document.getElementById("club-objective-description").textContent =
    strategy.clubObjective.description;

  document.getElementById("formation-continue-title").textContent =
    strategy.formationContinue.title;
  document.getElementById("formation-continue-description").textContent =
    strategy.formationContinue.description;

  // Tech Stack badges
  const techStackContainer = document.getElementById("technologies");
  strategy.formationContinue.technologies.forEach((tech) => {
    const badge = document.createElement("span");
    badge.className = "tech-badge";
    badge.textContent = tech;
    techStackContainer.appendChild(badge);
  });

  document.getElementById("formations-personnalisees-title").textContent =
    strategy.formationsPersonnalisees.title;
  document.getElementById("formations-personnalisees-intro").textContent =
    strategy.formationsPersonnalisees.intro;

  // Formation cards
  const formationsContainer = document.getElementById(
    "personalized-formations"
  );
  strategy.formationsPersonnalisees.formations.forEach((formation) => {
    const formationCard = document.createElement("div");
    formationCard.className = "formation-card";
    formationCard.innerHTML = `
        <h6 class="highlight-text">${formation.title}</h6>
        <p class="mb-0">${formation.description}</p>
    `;
    formationsContainer.appendChild(formationCard);
  });

  document.getElementById("team-spirit-title").textContent =
    strategy.teamSpirit.title;
  document.getElementById("team-spirit-description").textContent =
    strategy.teamSpirit.description;
}

// Populate courses section
function populateCourses(courses) {
  const coursesContainer = document.getElementById("courses-container");
  coursesContainer.innerHTML = "";

  courses.forEach((course, index) => {
    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-4";
    col.setAttribute("data-aos", "fade-up");
    col.setAttribute("data-aos-delay", 100 + index * 100);

    col.innerHTML = `
            <div class="course-card" data-course-id="${course.id}">
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

  // Add event listeners to all course cards
  const courseCards = document.querySelectorAll(".course-card");
  courseCards.forEach((card) => {
    card.addEventListener("click", function () {
      const courseId = this.getAttribute("data-course-id");
      openWorkshopDetails(courseId, courses);
    });
  });
}

// Function to handle opening the expanded workshop view
function openWorkshopDetails(courseId, courses) {
  // Find the course with the matching ID
  const course = courses.find((c) => c.id === parseInt(courseId));
  if (!course) return;

  // Get overlay elements
  const overlay = document.getElementById("workshop-overlay");
  const content = overlay.querySelector(".workshop-expanded-content");

  // Prevent body scrolling
  document.body.style.overflow = "hidden";

  // Populate expanded content
  content.innerHTML = `
    <div class="workshop-hero">
        <img src="${course.image}" alt="${course.title}">
        <div class="workshop-hero-content">
            <h1 class="workshop-title">${course.title}</h1>
            <div class="workshop-tags">
                <span class="workshop-tag"><i class="bi bi-bar-chart me-1"></i>${
                  course.level
                }</span>
                <span class="workshop-tag"><i class="bi bi-clock me-1"></i>${
                  course.duration
                }</span>
                ${
                  course.tags
                    ? course.tags
                        .map(
                          (tag) =>
                            `<span class="workshop-tag"><i class="bi bi-tag me-1"></i>${tag}</span>`
                        )
                        .join("")
                    : ""
                }
            </div>
        </div>
    </div>
    
    <div class="workshop-body">
        <!-- Timeline Section -->
        <div class="workshop-section">
            <h3 class="workshop-section-title"><i class="bi bi-diagram-3"></i>Planning de l'atelier</h3>
            <div class="workshop-timeline">
                <div class="timeline-container">
                    ${
                      course.timeline
                        ? course.timeline
                            .map(
                              (phase) => `
                        <div class="timeline-phase">
                            <div class="timeline-icon">
                                <i class="bi bi-${phase.icon}"></i>
                            </div>
                            <h4 class="timeline-title">${phase.title}</h4>
                            <p class="timeline-desc">${phase.description}</p>
                        </div>
                    `
                            )
                            .join("")
                        : "<p>Informations sur le planning non disponibles</p>"
                    }
                </div>
            </div>
        </div>
        
        <!-- Learning Outcomes -->
        <div class="workshop-section">
            <h3 class="workshop-section-title"><i class="bi bi-trophy"></i>Objectifs d'apprentissage</h3>
            <div class="learning-outcomes">
                ${
                  course.learningOutcomes
                    ? course.learningOutcomes
                        .map(
                          (outcome) => `
                    <div class="outcome-item">
                        <i class="bi bi-check-circle-fill"></i>
                        <div>${outcome}</div>
                    </div>
                `
                        )
                        .join("")
                    : "<p>Objectifs d'apprentissage non spécifiés</p>"
                }
            </div>
        </div>
        
        <!-- Media Gallery -->
        ${
          course.gallery && course.gallery.length > 0
            ? `
        <div class="workshop-section">
            <h3 class="workshop-section-title"><i class="bi bi-images"></i>Galerie multimédia</h3>
            <div class="media-gallery">
                <button class="gallery-nav gallery-prev">
                    <i class="bi bi-chevron-left"></i>
                </button>
                <div class="gallery-container">
                    ${course.gallery
                      .map(
                        (item) => `
                        <div class="gallery-item">
                            <img src="${item}" alt="Image de la galerie de l'atelier">
                        </div>
                    `
                      )
                      .join("")}
                </div>
                <button class="gallery-nav gallery-next">
                    <i class="bi bi-chevron-right"></i>
                </button>
            </div>
        </div>
        `
            : ""
        }
        
        <!-- Tools & Components -->
        ${
          course.tools && course.tools.length > 0
            ? `
        <div class="workshop-section">
            <h3 class="workshop-section-title"><i class="bi bi-tools"></i>Outils & Composants</h3>
            <div class="tools-grid">
                ${course.tools
                  .map(
                    (tool) => `
                    <div class="tool-item">
                        <div class="tool-icon">
                            <i class="bi bi-${tool.icon}"></i>
                        </div>
                        <div class="tool-name">${tool.name}</div>
                        ${
                          tool.description
                            ? `<div class="tool-tooltip">${tool.description}</div>`
                            : ""
                        }
                    </div>
                `
                  )
                  .join("")}
            </div>
        </div>
        `
            : ""
        }
        
        <!-- Detailed Description -->
        <div class="workshop-section">
            <h3 class="workshop-section-title">
                <i class="bi bi-info-circle"></i>Description & Prérequis
                </h3>
            <div>
                <p class="course-description">${
                  course.detailedDescription || course.description
                }</p>
                ${
                  course.prerequisites
                    ? `
                <div class="mt-3">
                    <strong>Prérequis :</strong>
                    <p class="course-description">${course.prerequisites}</p>
                </div>
                `
                    : ""
                }
                ${
                  course.targetAudience
                    ? `
                <div class="mt-3">
                    <strong>Public cible :</strong>
                    <p class="course-description">${course.targetAudience}</p>
                </div>
                `
                    : ""
                }
            </div>
        </div>
        
        <!-- Logistics -->
        <div class="workshop-section">
            <h3 class="workshop-section-title"><i class="bi bi-geo-alt"></i>Informations pratiques</h3>
            <div class="logistics-items">
                ${
                  course.date
                    ? `
                <div class="logistics-item">
                    <div class="logistics-icon">
                        <i class="bi bi-calendar-event"></i>
                    </div>
                    <div class="logistics-details">
                        <div class="logistics-label">Date & Heure</div>
                        <div class="logistics-value">${course.date}</div>
                    </div>
                </div>
                `
                    : ""
                }
                
                ${
                  course.location
                    ? `
                <div class="logistics-item">
                    <div class="logistics-icon">
                        <i class="bi bi-geo-alt"></i>
                    </div>
                    <div class="logistics-details">
                        <div class="logistics-label">Lieu</div>
                        <div class="logistics-value">${course.location}</div>
                    </div>
                </div>
                `
                    : ""
                }
                
                ${
                  course.duration
                    ? `
                <div class="logistics-item">
                    <div class="logistics-icon">
                        <i class="bi bi-hourglass-split"></i>
                    </div>
                    <div class="logistics-details">
                        <div class="logistics-label">Durée</div>
                        <div class="logistics-value">${course.duration}</div>
                    </div>
                </div>
                `
                    : ""
                }
                
                ${
                  course.capacity
                    ? `
                <div class="logistics-item">
                    <div class="logistics-icon">
                        <i class="bi bi-people"></i>
                    </div>
                    <div class="logistics-details">
                        <div class="logistics-label">Capacité</div>
                        <div class="logistics-value">${course.capacity}</div>
                    </div>
                </div>
                `
                    : ""
                }
            </div>
        </div>
        
        <!-- Registration CTA -->
        <div class="registration-cta">
            ${
              course.registrationStatus === "open"
                ? `
            <button class="register-btn" data-course-id="${course.id}">S'inscrire maintenant</button>
            `
                : `
            <div class="register-status">${
              course.registrationStatus === "closed"
                ? "Inscriptions clôturées"
                : "Bientôt disponible"
            }</div>
            `
            }
            ${
              course.nextSession
                ? `<div class="register-status">Prochaine session : ${course.nextSession}</div>`
                : ""
            }
        </div>
    </div>
`;

  // Show the overlay with animation
  overlay.classList.add("active");

  // Setup gallery navigation if gallery exists
  if (course.gallery && course.gallery.length > 0) {
    const galleryContainer = overlay.querySelector(".gallery-container");
    const prevBtn = overlay.querySelector(".gallery-prev");
    const nextBtn = overlay.querySelector(".gallery-next");

    if (prevBtn && nextBtn && galleryContainer) {
      prevBtn.addEventListener("click", () => {
        galleryContainer.scrollBy({ left: -270, behavior: "smooth" });
      });

      nextBtn.addEventListener("click", () => {
        galleryContainer.scrollBy({ left: 270, behavior: "smooth" });
      });
    }
  }

  // Handle registration button click
const registerBtn = overlay.querySelector(".register-btn");
if (registerBtn) {
  registerBtn.addEventListener("click", () => {
    if (course.formsLink) {
      window.open(course.formsLink, "_blank"); // Opens the link in a new tab
    } else {
      alert("Registration link is not available.");
    }
  });
}
}

// Function to close the workshop details
function closeWorkshopDetails() {
  const overlay = document.getElementById("workshop-overlay");
  overlay.classList.remove("active");
  document.body.style.overflow = "auto"; // Re-enable scrolling
}

// Initialize event listeners for overlay
document.addEventListener("DOMContentLoaded", function () {
  const closeBtn = document.getElementById("close-workshop");
  const overlay = document.getElementById("workshop-overlay");

  if (closeBtn) {
    closeBtn.addEventListener("click", closeWorkshopDetails);
  }

  // Close when clicking outside the content
  if (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) {
        closeWorkshopDetails();
      }
    });
  }

  // Close on escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeWorkshopDetails();
    }
  });
});

// Populate bots section
function populateBots(bots) {
  const botsContainer = document.getElementById("bots-container");
  botsContainer.innerHTML = "";

  bots.forEach((bot, index) => {
    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-3";
    col.setAttribute("data-aos", "fade-up");
    col.setAttribute("data-aos-delay", 100 + index * 100);

    col.innerHTML = `
            <div class="bot-card">
                <div class="bot-image-container">
                    <img src="${bot.image}" alt="${bot.name}">
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

/**
 * Creates an interactive rotating product display
 * @param {Array} techStack - Array of product categories with items
 * @param {Object} options - Configuration options
 */
function createProductRotationDisplay(techStack, options = {}) {
    // Default configuration
    const config = {
        containerId: 'wheel-container',
        controlsId: 'category-controls',
        centerLogoId: 'center-logo',
        categoryNameId: 'category-name',
        rotationSpeed: 0.4,
        rotationInterval: 40,
        radius: 350,
        categoryIcons: {
            'Contrôleurs': '🔧',
            'Capteurs': '📡',
            'Actionneurs': '⚙️'
        },
        ...options
    };

    // Convert tech stack to the format expected by the display
    const productData = {};
    techStack.forEach(category => {
        productData[category.category] = category.items;
    });

    // State variables
    let currentCategory = Object.keys(productData)[0] || "Contrôleurs";
    let rotationAngle = 0;
    let isRotating = true;
    let rotationInterval;

    /**
     * Initialize the product display
     */
    function initialize() {
        populateCategories();
        populateWheel(currentCategory);
        return {
            selectCategory,
            startRotation,
            stopRotation,
            getCurrentCategory: () => currentCategory,
            destroy
        };
    }

    /**
     * Populate category control buttons
     */
    function populateCategories() {
        const controlsContainer = document.getElementById(config.controlsId);
        if (!controlsContainer) {
            console.error(`Container with id '${config.controlsId}' not found`);
            return;
        }

        controlsContainer.innerHTML = '';

        Object.keys(productData).forEach((category, index) => {
            const button = document.createElement('button');
            button.className = `category-btn ${index === 0 ? 'active' : ''}`;
            button.textContent = category;
            button.addEventListener('click', () => selectCategory(category, button));
            controlsContainer.appendChild(button);
        });
    }

    /**
     * Select a product category
     * @param {string} category - Category name
     * @param {HTMLElement} button - Button element
     */
    function selectCategory(category, button) {
        // Update active button
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        if (button) {
            button.classList.add('active');
        }

        // Update current category
        currentCategory = category;
        
        // Update center info with appropriate icon
        const centerLogo = document.getElementById(config.centerLogoId);
        const categoryName = document.getElementById(config.categoryNameId);
        
        if (centerLogo) {
            const iconElement = centerLogo.querySelector('.center-logo-icon');
            if (iconElement) {
                iconElement.textContent = config.categoryIcons[category] || '🔧';
            }
        }
        
        if (categoryName) {
            categoryName.textContent = category;
        }
        
        // Stop current rotation and populate wheel with new products
        stopRotation();
        populateWheel(category);
    }

    /**
     * Populate the rotating wheel with products
     * @param {string} category - Category name
     */
    function populateWheel(category) {
        const wheelContainer = document.getElementById(config.containerId);
        if (!wheelContainer) {
            console.error(`Container with id '${config.containerId}' not found`);
            return;
        }

        const products = productData[category] || [];
        
        // Clear existing products
        wheelContainer.innerHTML = '';
        
        if (products.length === 0) {
            console.warn(`No products found for category: ${category}`);
            return;
        }
        
        // Calculate positions for circular arrangement on Y-axis
        const angleStep = 360 / products.length;
        
        products.forEach((product, index) => {
            const angle = (index * angleStep) * (Math.PI / 180);
            const z = Math.cos(angle) * config.radius;
            const x = Math.sin(angle) * config.radius;
            
            const productCard = createProductCard(product, index);
            productCard.style.transform = `translate3d(${x}px, 0, ${z}px)`;
            productCard.style.left = '50%';
            productCard.style.top = '50%';
            productCard.style.marginLeft = '-140px';
            productCard.style.marginTop = '-175px';
            
            // Add hover event listeners to stop/start rotation
            productCard.addEventListener('mouseenter', stopRotation);
            productCard.addEventListener('mouseleave', startRotation);
            
            wheelContainer.appendChild(productCard);
        });
        
        // Start rotation animation
        startRotation();
    }

    /**
     * Create a product card element
     * @param {Object} product - Product data
     * @param {number} index - Product index
     * @returns {HTMLElement} Product card element
     */
    function createProductCard(product, index) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <div class="price-tag">${product.price}</div>
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
            </div>
        `;
        
        return card;
    }

    /**
     * Start the rotation animation
     */
    function startRotation() {
        if (rotationInterval) {
            clearInterval(rotationInterval);
        }
        
        isRotating = true;
        const wheelContainer = document.getElementById(config.containerId);
        if (!wheelContainer) return;
        
        rotationInterval = setInterval(() => {
            if (isRotating) {
                rotationAngle += config.rotationSpeed;
                wheelContainer.style.transform = `rotateY(${rotationAngle}deg)`;
                
                // Counter-rotate product cards to keep text upright
                const productCards = wheelContainer.querySelectorAll('.product-card');
                productCards.forEach(card => {
                    const currentTransform = card.style.transform;
                    const baseTransform = currentTransform.split(' rotateY')[0];
                    card.style.transform = `${baseTransform} rotateY(${-rotationAngle}deg)`;
                });
            }
        }, config.rotationInterval);
    }

    /**
     * Stop the rotation animation
     */
    function stopRotation() {
        isRotating = false;
    }

    /**
     * Clean up and destroy the display
     */
    function destroy() {
        if (rotationInterval) {
            clearInterval(rotationInterval);
        }
        
        const controlsContainer = document.getElementById(config.controlsId);
        const wheelContainer = document.getElementById(config.containerId);
        
        if (controlsContainer) {
            controlsContainer.innerHTML = '';
        }
        
        if (wheelContainer) {
            wheelContainer.innerHTML = '';
        }
    }

    // Return the initialize function to start the display
    return initialize();
}

/**
 * Global function to handle product purchases
 * @param {string} productName - Name of the product
 */
function buyProduct(productName) {
    alert(`Vous avez sélectionné: ${productName}\nRedirection vers la page d'achat...`);
    // Here you would typically redirect to a purchase page or open a modal
}


// Populate join section
function populateJoinSection(joinData) {
  // Why join list
  const whyJoinList = document.getElementById("why-join-list");
  whyJoinList.innerHTML = "";
  joinData.whyJoin.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    whyJoinList.appendChild(li);
  });

  // What you'll learn list
  const whatYouLearnList = document.getElementById("what-you-learn-list");
  whatYouLearnList.innerHTML = "";
  joinData.whatYouLearn.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    whatYouLearnList.appendChild(li);
  });

  // Welcome message
  document.getElementById("welcome-message").textContent =
    joinData.welcomeMessage;

  // CTA button
  const joinCta = document.getElementById("join-cta");
  joinCta.href = joinData.ctaButton.link;
  document.getElementById("join-cta-text").textContent =
    joinData.ctaButton.text;
}

// Populate contact section
function populateContactSection(contactData) {
  document.getElementById("contact-email").textContent = contactData.email;
  document.getElementById("contact-phone").textContent = contactData.phone;
  document.getElementById("contact-address").textContent = contactData.address;

  // Social media icons

  // const socialIcons = document.getElementById("social-icons");
  // socialIcons.innerHTML = "";

  // contactData.socialMedia.forEach((social) => {
  //   const a = document.createElement("a");
  //   a.href = social.link;
  //   a.className = "social-icon";
  //   a.target = "_blank";
  //   a.rel = "noopener noreferrer";
  //   a.innerHTML = `<i class="bi ${social.icon}"></i>`;
  //   socialIcons.appendChild(a);
  // });
}

// Initialize Bootstrap components
function initializeBootstrapComponents() {
  // Enable all tooltips
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Add smooth scrolling to all links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Offset for navbar
          behavior: "smooth",
        });
      }

      // Close mobile menu if open
      const navbarToggler = document.querySelector(".navbar-toggler");
      const navbarCollapse = document.querySelector(".navbar-collapse");
      if (navbarCollapse.classList.contains("show")) {
        navbarToggler.click();
      }
    });
  });
}
