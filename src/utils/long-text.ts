/**
 * return the first 10 characters and last 5 if the string is too long. connected with ...
 *
 * @param long long string
 *
 * @returns first 10 characters + ... +  5 last characters
 */
export function displayLongText(long: string | undefined, length = 15) {
  if (long && long.length > length) {
    return long.slice(0, length - 5) + '...' + long.slice(-5);
  }
  return long;
}
