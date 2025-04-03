import { useAccountStorage } from '../../../utils/hooks/useLocalAccounts';
import { displayLongText } from '../../../utils/long-text';
import { CopyBox } from '../../common/copy-box';
import { RefreshDataButton } from './refresh-data-button';

export function Toolbar({ showRefresh = false }: { showRefresh?: boolean }) {
  const { activeAccount } = useAccountStorage();

  return (
    <div
      style={{
        padding: '12px 24px',
        height: 'auto',
        display: 'flex',
        gap: '8px',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ flex: 1 }}>
        <CopyBox
          compact
          text={displayLongText(activeAccount?.identity ?? '', 24)}
          copyText={activeAccount?.identity ?? ''}
        />
      </div>
      {showRefresh && (
        <div style={{ flex: 0 }}>
          <RefreshDataButton />
        </div>
      )}
    </div>
  );
}
