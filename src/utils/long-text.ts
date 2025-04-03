/**
 * return the first 10 characters and last 5 if the string is too long. connected with ...
 *
 * @param long long string
 *
 * @returns first 10 characters + ... +  5 last characters
 */
export function displayLongText(long: string | undefined) {
  if (long && long.length > 15) {
    return long.slice(0, 10) + '...' + long.slice(-5);
  }
  return long;
}
