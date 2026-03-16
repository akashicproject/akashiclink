import styled from '@emotion/styled';
import SearchIcon from '@mui/icons-material/Search';
import React, { type FC } from 'react';

const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledInput = styled.input`
  border: 0.0625rem solid var(--ion-item-alt-border-color);
  border-radius: 2rem;
  background: transparent;
  box-shadow: none;
  height: 2rem;
  width: 100%;
  font-size: 0.875rem;
  color: var(--ion-text-color-alt);
  outline: none;
  text-align: left;
  padding-left: 1rem !important;
  &::placeholder {
    text-align: left;
    color: var(--ion-text-color-alt) !important;
    opacity: 1;
  }
  &:focus::placeholder {
    opacity: 0;
  }
`;

const SearchIconWrapper = styled.span`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--ion-text-color-alt);
  display: flex;
  align-items: center;
`;

type SearchBarProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

export const SearchBar: FC<SearchBarProps> = ({ value, onChange, placeholder }) => (
    <SearchWrapper>
    <StyledInput
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
    <SearchIconWrapper>
      <SearchIcon style={{ fontSize: '1.125rem' }} />
    </SearchIconWrapper>
  </SearchWrapper>
);