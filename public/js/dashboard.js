
// get the current URL without the token parameter
let newUrl = window.location.href.replace(/\?token=.*/, '');

// replace the current URL with the new URL without the token parameter
window.history.replaceState({}, document.title, newUrl);