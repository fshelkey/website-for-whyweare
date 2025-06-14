let validationInitialized = false;
export function initFormValidation() {
  if (validationInitialized) return;
  validationInitialized = true;
  const form = document.querySelector('#contactForm');
  if (!form) {
    console.error('initFormValidation: #contactForm not found');
    return;
  }
  const formAction = form.getAttribute('action');
  if (!formAction) {
    console.error('initFormValidation: form action attribute is missing');
    return;
  }
  let actionURL;
  try {
    actionURL = new URL(formAction, window.location.href);
  } catch (error) {
    console.error('initFormValidation: form action is not a valid URL', error);
    return;
  }
  if (!['http:', 'https:'].includes(actionURL.protocol)) {
    console.error('initFormValidation: form action must be HTTP/HTTPS');
    return;
  }
  let feedbackEl = form.querySelector('.form-feedback');
  if (!feedbackEl) {
    feedbackEl = document.createElement('div');
    feedbackEl.className = 'form-feedback mb-3';
    feedbackEl.setAttribute('aria-live', 'polite');
    form.insertBefore(feedbackEl, form.firstChild);
  }
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('is-invalid');
      const feedback = input.parentElement.querySelector('.invalid-feedback');
      if (feedback) feedback.textContent = '';
    });
  });
  form.addEventListener('submit', async e => {
    e.preventDefault();
    feedbackEl.textContent = '';
    feedbackEl.classList.remove('text-success', 'text-danger');
    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const companyInput = form.querySelector('input[name="company"]');
    const messageInput = form.querySelector('textarea[name="message"]');
    if (!nameInput || !emailInput || !messageInput) {
      console.error('initFormValidation: Missing required form fields');
      return;
    }
    let isValid = true;
    if (nameInput.value.trim() === '') {
      setError(nameInput, 'Name is required.');
      isValid = false;
    }
    if (emailInput.value.trim() === '') {
      setError(emailInput, 'Email is required.');
      isValid = false;
    } else if (!emailInput.checkValidity()) {
      setError(emailInput, 'Please enter a valid email address.');
      isValid = false;
    }
    if (messageInput.value.trim() === '') {
      setError(messageInput, 'Message is required.');
      isValid = false;
    }
    if (!isValid) return;
    const submitBtn = form.querySelector('button[type="submit"]');
    let originalBtnHTML = '';
    if (submitBtn) {
      submitBtn.disabled = true;
      originalBtnHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
    }
    try {
      const response = await fetch(actionURL.toString(), {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (!response.ok) throw new Error(`Network response was not ok (${response.status})`);
      feedbackEl.textContent = 'Message sent successfully!';
      feedbackEl.classList.add('text-success');
      form.reset();
    } catch (error) {
      feedbackEl.textContent = 'There was an error sending your message. Please try again later.';
      feedbackEl.classList.add('text-danger');
      console.error('initFormValidation:', error);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      }
    }
  });
  function setError(input, message) {
    input.classList.add('is-invalid');
    let feedback = input.parentElement.querySelector('.invalid-feedback');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.className = 'invalid-feedback';
      input.parentElement.appendChild(feedback);
    }
    feedback.textContent = message;
    input.focus();
  }
}