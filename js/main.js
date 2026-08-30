// ============================================
// NJ DEV — PORTFOLIO
// JavaScript minimal : juste ce qu'il faut
// pour rendre le site interactif, rien de plus.
// ============================================

// ---- Menu mobile (hamburger) ----
// On récupère le bouton et la liste de liens,
// et on ajoute/enlève une classe "open" au clic.
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    // On met à jour aria-expanded pour l'accessibilité
    // (utile pour les lecteurs d'écran)
    navToggle.setAttribute('aria-expanded', isOpen);
  });
}

// ---- Révélation douce au scroll ----
// Chaque élément avec la classe "panel" apparaît
// en fondu quand il entre dans l'écran.
// IntersectionObserver = API native du navigateur
// qui "observe" quand un élément devient visible.
const revealTargets = document.querySelectorAll('.panel, .project-card');

if ('IntersectionObserver' in window && revealTargets.length > 0) {
  revealTargets.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target); // on n'observe plus une fois révélé
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach((el) => observer.observe(el));
}

// ---- Formulaire de contact (envoi via Formspree, sans recharger la page) ----
// On intercepte la soumission normale du formulaire, on envoie les
// données nous-mêmes avec fetch(), puis on affiche un message selon
// le résultat. Ce bloc ne s'exécute que sur la page contact.html
// (là où #contactForm existe) — sur les autres pages, il ne fait rien.
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // on empêche le rechargement de page par défaut

    const submitButton = contactForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Envoi en cours...';
    formStatus.textContent = '';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' } // demande une réponse JSON à Formspree
      });

      if (response.ok) {
        formStatus.textContent = 'Message envoyé ! Je te réponds dès que possible.';
        formStatus.style.color = '#FFD23F';
        contactForm.reset(); // on vide le formulaire après succès
      } else {
        formStatus.textContent = "Erreur lors de l'envoi. Réessaie ou écris-moi directement par email.";
        formStatus.style.color = '#C1443C';
      }
    } catch (error) {
      formStatus.textContent = 'Connexion impossible. Vérifie ta connexion internet et réessaie.';
      formStatus.style.color = '#C1443C';
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Envoyer le message';
    }
  });
}
