import { styled } from "storybook/internal/theming";

const Label = styled.span(({ theme }) => ({
  minWidth: 50,
  fontWeight: theme.typography.weight.bold,
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  lineHeight: "16px",
}));

export default Label;
