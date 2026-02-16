// components/TypedDataViewer.tsx
import { IonText } from '@ionic/react';
import React from 'react';

// ---- Constants & Helpers --------------------------------------------------
const INDENT_SIZE = 16;
const BULLET = '•';

// Checks if the given type is a primitive EIP-712 type
const isPrimitiveType = (t: string): boolean => {
  return (
    t === 'address' ||
    t === 'bool' ||
    t === 'string' ||
    t === 'bytes' ||
    /^bytes[1-9]\d*$/.test(t) || // bytes1 to bytes32
    /^uint\d*$/.test(t) || // uint, uint8 to uint256
    /^int\d*$/.test(t) // int, int8 to int256
  );
};

const monospaceStyle: React.CSSProperties = {
  fontFamily: 'var(--ion-font-family-monospace, monospace)',
  wordBreak: 'break-all',
};

const lineBaseStyle = (indent: number): React.CSSProperties => ({
  paddingLeft: indent * INDENT_SIZE,
  display: 'flex',
  alignItems: 'flex-start',
  width: '100%',
});

interface EIP712TypeField {
  name: string;
  type: string;
}

interface EIP712Types {
  [typeName: string]: EIP712TypeField[];
}

interface Props {
  data: unknown; // nested structure value (primitive, object, array, etc.)
  dataType: string;
  types: EIP712Types;
  label?: string; // field name or array label
  indent?: number; // current indentation level
  suppressHeader?: boolean; // don't render struct header (used for array struct items)
}

/**
 * Recursively renders EIP-712 typed data
 */
export const TypedDataViewer: React.FC<Props> = ({
  data,
  dataType,
  types,
  label,
  indent = 0,
  suppressHeader = false,
}) => {
  if (data === null || data === undefined) return null;

  const lineStyle = lineBaseStyle(indent);

  const Monospace: React.FC<{ value: unknown }> = ({ value }) => (
    <code style={monospaceStyle}>{String(value)}</code>
  );

  const BulletLine: React.FC<{ label?: string; value?: unknown }> = ({
    label: lbl,
    value,
  }) => {
    const showBullet = indent > 0; // root has no bullet
    return (
      <div style={lineStyle} className="ion-padding-vertical-xxs">
        <IonText
          color="medium"
          style={{ width: 12, textAlign: 'center', lineHeight: '1.2rem' }}
        >
          {showBullet ? BULLET : ''}
        </IonText>
        <div
          style={{
            display: 'flex',
            flex: 1,
            justifyContent:
              value !== undefined ? 'space-between' : 'flex-start',
          }}
        >
          <IonText style={{ fontWeight: 600 }}>
            {lbl}
            {value !== undefined ? ':' : ''}
          </IonText>
          {value !== undefined && (
            <IonText style={{ textAlign: 'right', flexShrink: 0 }}>
              <Monospace value={value} />
            </IonText>
          )}
        </div>
      </div>
    );
  };

  // Primitive handling
  if (isPrimitiveType(dataType)) {
    return <BulletLine label={label} value={data} />;
  }

  // Array types
  if (dataType.endsWith('[]')) {
    const itemType = dataType.slice(0, -2);
    const arr: unknown[] = Array.isArray(data) ? data : [];

    // Array of primitives: label[index]: value
    if (isPrimitiveType(itemType)) {
      return (
        <div>
          {arr.map((item, idx) => (
            <TypedDataViewer
              key={idx}
              data={item}
              dataType={itemType}
              types={types}
              label={`${label}[${idx}]`}
              indent={indent} // align with sibling fields
              suppressHeader={true}
            />
          ))}
        </div>
      );
    }

    // Array of structs: print header for each index then nested fields
    return (
      <div>
        {arr.map((item, idx) => (
          <div
            key={idx}
            style={{ paddingLeft: indent * INDENT_SIZE }}
            className="ion-padding-vertical-xxs"
          >
            <div style={{ display: 'flex' }}>
              <IonText
                color="medium"
                style={{ width: 12, textAlign: 'center' }}
              >
                {BULLET}
              </IonText>
              <IonText style={{ fontWeight: 600 }}>
                {label}[{idx}]
              </IonText>
            </div>
            <TypedDataViewer
              data={item}
              dataType={itemType}
              types={types}
              indent={indent} /* keep same indent for child struct fields */
              suppressHeader={true}
            />
          </div>
        ))}
      </div>
    );
  }

  // Struct types
  if (types[dataType]) {
    const structFields = types[dataType];
    return (
      <div>
        {!suppressHeader && label && (
          <div
            style={{ ...lineBaseStyle(indent) }}
            className="ion-padding-vertical-xxs"
          >
            <IonText color="medium" style={{ width: 12 }}></IonText>
            <div style={{ display: 'flex', flex: 1 }}>
              <IonText style={{ fontWeight: 600 }}>{label}</IonText>
            </div>
          </div>
        )}
        {structFields.map((field) => {
          let fieldValue: unknown = undefined;
          if (data && typeof data === 'object') {
            fieldValue = (data as Record<string, unknown>)[field.name];
          }
          return (
            <TypedDataViewer
              key={field.name}
              data={fieldValue}
              dataType={field.type}
              types={types}
              label={field.name}
              indent={
                suppressHeader ? indent : indent + 1
              } /* indent child fields unless header suppressed */
            />
          );
        })}
      </div>
    );
  }

  // Fallback
  return <BulletLine label={label} value={data} />;
};
