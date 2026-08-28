const siteHeader = document.querySelector(".site-header");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const backToTopButton = document.getElementById("backToTop");
const toast = document.getElementById("toast");
const contactForm = document.getElementById("contactForm");
const messageField = document.getElementById("message");
const messageCount = document.getElementById("messageCount");
let toastTimer;

function showPage(pageName, clickedButton) {
    const page = document.getElementById(`page-${pageName}`);

    if (!page) {
        return;
    }

    document.querySelectorAll(".page").forEach((pageSection) => {
        pageSection.classList.toggle("active", pageSection === page);
    });

    document.querySelectorAll(".nav-btn").forEach((button) => {
        button.classList.toggle("active", button.dataset.page === pageName);
    });

    if (clickedButton && clickedButton.classList.contains("nav-btn")) {
        clickedButton.classList.add("active");
    }

    history.replaceState(null, "", window.location.pathname + window.location.search);
    closeMobileMenu();
    window.scrollTo({ top: 0, behavior: "smooth" });
    initializeRevealAnimations();
}

function closeMobileMenu() {
    if (!menuToggle || !navLinks) {
        return;
    }

    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    navLinks.classList.remove("open");
    document.body.classList.remove("menu-open");
}

function initializeRevealAnimations() {
    const revealItems = document.querySelectorAll(".page.active .reveal");

    if (!("IntersectionObserver" in window)) {
        revealItems.forEach((item) => item.classList.add("visible"));
        return;
    }

    const observer = new IntersectionObserver((entries, revealObserver) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealItems.forEach((item) => observer.observe(item));
}

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        menuToggle.classList.toggle("active", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
        document.body.classList.toggle("menu-open", isOpen);
    });
}

/* ==================================================
   CONTACT FORM HELPER FUNCTIONS
================================================== */

function setFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(fieldId + "Error");

    if (field) {
        field.classList.add("invalid");
    }

    if (error) {
        error.textContent = message;
    }
}

function markFieldValid(fieldId) {
    const field = document.getElementById(fieldId);

    if (field) {
        field.classList.remove("invalid");
        field.classList.add("valid");
    }
}

function clearFormErrors() {
    document
        .querySelectorAll(".error-message")
        .forEach((error) => {
            error.textContent = "";
        });

    document
        .querySelectorAll(
            "input, textarea, select"
        )
        .forEach((field) => {
            field.classList.remove("invalid");
            field.classList.remove("valid");
        });
}

function isValidEmail(email) {
    const regex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(email);
}

function isValidPhone(phone) {
    const normalizedPhone = phone.replace(/[\s()-]/g, "");
    const regex = /^(09|\+639)\d{9}$/;

    return regex.test(normalizedPhone);
}

/* ==================================================
   CHARACTER COUNTER
================================================== */

function updateMessageCount() {
    if (!messageField || !messageCount) {
        return;
    }

    const current =
        messageField.value.length;

    const max =
        messageField.maxLength;

    messageCount.textContent =
        `${current} / ${max}`;

    if (current >= max) {
        messageCount.style.color =
            "#c83d3d";
    } else {
        messageCount.style.color =
            "";
    }
}

if (messageField) {
    messageField.addEventListener(
        "input",
        updateMessageCount
    );
}

/* ==================================================
   FORM SUBMISSION
================================================== */

function submitForm(event) {

    event.preventDefault();

    clearFormErrors();

    const firstNameField = document.getElementById("firstName");
    const emailField = document.getElementById("email");
    const phoneField = document.getElementById("phone");
    const topicField = document.getElementById("topic");

    const firstName = firstNameField.value.trim();

    const email = emailField.value.trim();

    const phone = phoneField.value.trim();

    const topic = topicField.value;

    const message =
        document
        .getElementById("message")
        .value
        .trim();

    let valid = true;
    let firstErrorField = null;

    if (firstName.length < 2) {

        setFieldError(
            "firstName",
            "Please enter your first name."
        );

        valid = false;

        firstErrorField =
            firstErrorField ||
            document.getElementById(
                "firstName"
            );
    }
    else {
        markFieldValid("firstName");
    }

    if (!isValidEmail(email)) {

        setFieldError(
            "email",
            "Please enter a valid email."
        );

        valid = false;

        firstErrorField =
            firstErrorField ||
            document.getElementById(
                "email"
            );
    }
    else {
        markFieldValid("email");
    }

    if (
        phone &&
        !isValidPhone(phone)
    ) {

        setFieldError(
            "phone",
            "Invalid mobile number."
        );

        valid = false;

        firstErrorField =
            firstErrorField ||
            document.getElementById(
                "phone"
            );
    }
    else if (phone) {
        markFieldValid("phone");
    }

    if (!topic) {

        setFieldError(
            "topic",
            "Select an inquiry topic."
        );

        valid = false;

        firstErrorField =
            firstErrorField ||
            document.getElementById(
                "topic"
            );
    }
    else {
        markFieldValid("topic");
    }

    if (message.length < 10) {

        setFieldError(
            "message",
            "Message must be at least 10 characters."
        );

        valid = false;

        firstErrorField =
            firstErrorField ||
            document.getElementById(
                "message"
            );
    }
    else {
        markFieldValid("message");
    }

    if (!valid) {

        if (firstErrorField) {
            firstErrorField.focus();
        }

        return;
    }

    showToast();

    contactForm.reset();

    updateMessageCount();

    clearFormErrors();
}

/* ==================================================
   TOAST NOTIFICATION
================================================== */

function showToast() {

    if (!toast) {
        return;
    }

    clearTimeout(toastTimer);

    toast.classList.add("show");

    toastTimer = setTimeout(() => {

        hideToast();

    }, 4000);
}

function hideToast() {

    if (!toast) {
        return;
    }

    toast.classList.remove("show");
}

/* ==================================================
   BACK TO TOP
================================================== */

function scrollToTop() {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });
}

/* ==================================================
   WINDOW SCROLL EVENTS
================================================== */

window.addEventListener(
    "scroll",
    () => {

        if (window.scrollY > 100) {

            siteHeader?.classList.add("scrolled");

        } else {

            siteHeader?.classList.remove("scrolled");
        }

        if (
            window.scrollY > 500
        ) {

            backToTopButton?.classList.add("show");

        } else {

            backToTopButton?.classList.remove("show");
        }
    }
);

/* ==================================================
   IMAGE FALLBACKS
================================================== */

document
    .querySelectorAll("img")
    .forEach((image) => {

        image.addEventListener(
            "error",
            () => {

                image.style.display =
                    "none";
            }
        );
    });

/* ==================================================
   AUTO CLOSE MOBILE MENU
================================================== */

document
    .querySelectorAll(".nav-btn")
    .forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                closeMobileMenu();
            }
        );
    });

/* ==================================================
   PAGE LOAD
================================================== */

window.addEventListener(
    "DOMContentLoaded",
    () => {

        const currentYear =
            document.getElementById(
                "currentYear"
            );

        if (currentYear) {

            currentYear.textContent =
                new Date().getFullYear();
        }

        updateMessageCount();

        initializeRevealAnimations();

        showPage("home");
    }
);