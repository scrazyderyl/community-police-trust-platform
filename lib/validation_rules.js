// Returns true if the URL is a relative path starting with a single '/'
export function isValidRedirect(url) {
  try {
    return typeof url === 'string' && url.startsWith('/') && !url.startsWith('//');
  } catch {
    return false;
  }
}
