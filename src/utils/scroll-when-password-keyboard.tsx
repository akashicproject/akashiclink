/**
 * IOS has an issue with the password keyboard that hides some of the content when it
 * pops up.
 *
 * Calling this in a useEffect that tracks `useKeyboardState` ensures that the element
 * that triggered the keyboard  is scrolled into view
 */
export function scrollWhenPasswordKeyboard(
  keyboardOpen: boolean | undefined,
  document: Document
) {
  if (keyboardOpen) {
    document.activeElement!.scrollIntoView({ behavior: 'smooth' });
  } else {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
