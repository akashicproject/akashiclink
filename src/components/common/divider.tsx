import styled from '@emotion/styled';

export const Divider = styled.div<{
  borderColor?: string;
  height?: string;
  borderWidth?: string;
  horizontal?: boolean;
}>((props) => ({
  boxSizing: 'border-box',
  height: `${props.height ?? '1px'}`,
  borderTop: `${props.borderWidth ?? '1px'} solid ${
    props.borderColor ?? '#D9D9D9'
  }`,
  margin: '8px 0',
  ...(props.horizontal && {
    width: '100%',
  }),
}));
