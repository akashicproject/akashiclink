export const useCopyToClipboard = () => {
  return async (text: string) => {
    await navigator.clipboard.writeText(text ?? '');
  };
};
