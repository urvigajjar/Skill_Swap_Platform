import { createUserCard } from './ui.js';
import { fetchUsers } from './api.js';
import { validateLogin } from './validators.js';

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      const errors = validateLogin(email, password);
      if (Object.keys(errors).length > 0) {
        alert('Validation Error!');
        return;
      }

      alert('Login successful!');
      window.location.href = 'dashboard.html';
    });
  }

  if (document.getElementById('userGrid')) {
    fetchUsers().then(users => {
      const grid = document.getElementById('userGrid');
      users.forEach(user => {
        const card = createUserCard(user);
        grid.appendChild(card);
      });
    });

    document.getElementById('searchBar').addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      const cards = document.querySelectorAll('.user-card');
      cards.forEach(card => {
        card.style.display = card.innerText.toLowerCase().includes(term) ? 'block' : 'none';
      });
    });
  }
});
