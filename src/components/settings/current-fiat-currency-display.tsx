import { useFiatCurrencyDisplay } from '../../utils/hooks/useFiatCurrencyDisplay';

export const CurrentFiatCurrencyDisplay = () => {
  const { fiatCurrencySymbol, fiatCurrencySign } = useFiatCurrencyDisplay();

  return (
    <h5 className="ion-no-margin ion-text-size-xs ion-margin-right-xs">
      {fiatCurrencySign} {fiatCurrencySymbol}
    </h5>
  );
};
