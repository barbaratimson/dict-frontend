import styled from "styled-components";
import {theme} from "./theme";

interface TextOptions {
    color?: string,
    size?: number
}

export const TextLarge = styled.div`
    font-size: 32px;
    color: ${theme.colors.font};
    line-height: 100%;
`

export const TextMedium = styled.div`
    font-size: 24px;
    color: ${theme.colors.font};
`

export const TextSmall = styled.div<TextOptions>`
    font-size: ${({size}) => size ?? 16 + "px" };
    color: ${({color}) => color ?? theme.colors.font};
`

export const Input = styled.input`
  background-color: transparent;
  border-radius: 16px;
  color: ${theme.colors.font};
  border: 1px solid rgba(255, 255, 255, 0.3);
  outline: none;
  width: 100%;
  padding: 10px;
  font-size: 15px;
  font-weight: 400;
  margin-right: 10px;
  &::placeholder {
    color: ${theme.colors.fontSecondary};
  }
`

export const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 25px;
  min-height: 25px;
  padding: 5px;
  transition: all .4s;
  border-radius: 2px;
  background: transparent;
  border: none;
  color: ${theme.colors.font};

  &:active {
    background-color: ${theme.colors.buttonActive} !important;
    transition: all .2s ease-in-out;
    border-radius: 12px !important;
  }

  &:hover {
    background-color: ${theme.colors.buttonHover};
    border-radius: 8px;
  }
`

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 10px;
`

interface FlexProps {
    direction?: 'row' | 'column';
    justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
    align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
    gap?: number;
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
}

const FlexContainer = styled.div<FlexProps>`
  display: flex;
  flex-direction: ${({ direction = "row" }) => direction};
  justify-content: ${({ justify = "flex-start" }) => justify};
  align-items: ${({ align = "stretch" }) => align};
  gap: ${({ gap= 0 }) => gap + "px"};
  flex-wrap: ${({ wrap = "nowrap" }) => wrap};
`;

export const FlexRow = styled(FlexContainer)`
  flex-direction: row;
`


export const FlexColumn = styled(FlexContainer)`
  flex-direction: column;
`