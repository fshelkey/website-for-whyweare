const THEME_KEY = 'theme'
const ALLOWED_THEMES = ['light','dark']
export function initThemeSwitcher() {
  const toggle = document.getElementById('theme-toggle')
  if (!toggle) throw new Error('Missing element with id "theme-toggle"')
  let savedTheme = null
  try {
    savedTheme = localStorage.getItem(THEME_KEY)
  } catch (e) {}
  const prefersDark = typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  const initialTheme = ALLOWED_THEMES.includes(savedTheme)
    ? savedTheme
    : (prefersDark ? 'dark' : 'light')
  function applyTheme(theme) {
    if (!ALLOWED_THEMES.includes(theme)) return
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch (e) {}
    if (toggle.tagName.toLowerCase() === 'input' && toggle.type === 'checkbox') {
      toggle.checked = theme === 'dark'
    } else {
      toggle.setAttribute('aria-pressed', String(theme === 'dark'))
      toggle.setAttribute('data-theme', theme)
    }
  }
  applyTheme(initialTheme)
  const eventType = (toggle.tagName.toLowerCase() === 'input' && toggle.type === 'checkbox')
    ? 'change'
    : 'click'
  toggle.addEventListener(eventType, () => {
    const current = document.documentElement.getAttribute('data-theme')
    const newTheme = current === 'dark' ? 'light' : 'dark'
    applyTheme(newTheme)
  })
}