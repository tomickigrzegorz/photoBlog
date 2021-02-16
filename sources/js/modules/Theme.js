const toggleSwitch = document.querySelector('.theme');

toggleSwitch.addEventListener('click', () => {
  const currentTheme = localStorage.getItem('theme');
  const typeTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', typeTheme);
  localStorage.setItem('theme', typeTheme);
});
