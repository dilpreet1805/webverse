"use strict";

const siteHeader = document.getElementById("site-header");
const menuToggle = document.getElementById("menu-toggle");
const mainNavigation = document.getElementById("main-navigation");
const menuOverlay = document.getElementById("menu-overlay");
const navigationLinks = document.querySelectorAll(".navigation-link");

function openMobileMenu() {
  mainNavigation.classList.add("active");
  menuToggle.classList.add("active");
  menuOverlay.classList.add("active");
  document.body.classList.add("menu-open");

  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Close navigation menu");
}

function closeMobileMenu() {
  mainNavigation.classList.remove("active");
  menuToggle.classList.remove("active");
  menuOverlay.classList.remove("active");
  document.body.classList.remove("menu-open");

  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
}

menuToggle.addEventListener("click", () => {
  const menuIsOpen = mainNavigation.classList.contains("active");

  if (menuIsOpen) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
});

menuOverlay.addEventListener("click", closeMobileMenu);

navigationLinks.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileMenu();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 992) {
    closeMobileMenu();
  }
});


/* =====================================
   Sticky Header Shadow
===================================== */

function updateHeaderOnScroll() {
  if (window.scrollY > 20) {
    siteHeader.classList.add("header-scrolled");
  } else {
    siteHeader.classList.remove("header-scrolled");
  }
}

window.addEventListener("scroll", updateHeaderOnScroll);
updateHeaderOnScroll();


/* =====================================
   Active Link According to Section
===================================== */

const pageSections = document.querySelectorAll(
  "section[id], footer[id]"
);

function updateActiveNavigationLink() {
  const scrollPosition = window.scrollY + 160;
  let currentSectionId = "home";

  pageSections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      currentSectionId = section.id;
    }
  });

  navigationLinks.forEach((link) => {
    link.classList.remove("active");

    if (link.getAttribute("href") === `#${currentSectionId}`) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", updateActiveNavigationLink);
window.addEventListener("load", updateActiveNavigationLink);

/* =====================================
   Template Slider
===================================== */

const templateSwiper = new Swiper(".templateSwiper", {
  loop: true,
  speed: 700,
  spaceBetween: 22,

  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true
  },

  navigation: {
    nextEl: ".template-next",
    prevEl: ".template-prev"
  },

  pagination: {
    el: ".template-pagination",
    clickable: true
  },

  breakpoints: {
    0: {
      slidesPerView: 1,
      spaceBetween: 16
    },

    576: {
      slidesPerView: 1.4,
      spaceBetween: 18
    },

    768: {
      slidesPerView: 2,
      spaceBetween: 20
    },

    992: {
      slidesPerView: 3,
      spaceBetween: 20
    },

    1200: {
      slidesPerView: 4,
      spaceBetween: 22
    }
  }
});

/* =====================================
   Contact Form
===================================== */

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("contact-form-status");

if (contactForm && formStatus) {

  const submitButton = contactForm.querySelector(".contact-submit");
  const submitText = contactForm.querySelector(".submit-text");
  const submitIcon = contactForm.querySelector(".contact-submit i");

  contactForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    submitButton.disabled = true;
    submitButton.classList.add("is-loading");

    submitText.textContent = "Sending...";
    submitIcon.className = "fa-solid fa-spinner";

    formStatus.className = "contact-form-status sending";
    formStatus.textContent = "Sending your message...";

    const formData = new FormData(contactForm);

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {

      const response = await fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: json
        }
      );

      const result = await response.json();

      if (result.success) {

        formStatus.className = "contact-form-status success";
        formStatus.textContent =
          "✅ Thank you! Your enquiry has been sent successfully.";

        contactForm.reset();

      } else {

        formStatus.className = "contact-form-status error";
        formStatus.textContent =
          result.message || "Something went wrong.";

      }

    } catch (error) {

      formStatus.className = "contact-form-status error";
      formStatus.textContent =
        "Unable to send message. Please try again.";

    }

    submitButton.disabled = false;
    submitButton.classList.remove("is-loading");

    submitText.textContent = "Send Message";
    submitIcon.className = "fa-regular fa-paper-plane";

  });

}


/* =====================================
   FAQ Accordion
===================================== */

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((faqItem) => {
  const faqButton = faqItem.querySelector(".faq-question");

  faqButton.addEventListener("click", () => {
    const itemIsOpen = faqItem.classList.contains("active");

    /*
     * Close all FAQ items first.
     * This keeps only one answer open at a time.
     */
    faqItems.forEach((item) => {
      const button = item.querySelector(".faq-question");

      item.classList.remove("active");
      button.setAttribute("aria-expanded", "false");
    });

    /*
     * Open the clicked item when it was previously closed.
     */
    if (!itemIsOpen) {
      faqItem.classList.add("active");
      faqButton.setAttribute("aria-expanded", "true");
    }
  });
});

/* =====================================
   Dynamic Footer Year
===================================== */

const currentYear = document.getElementById("current-year");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}