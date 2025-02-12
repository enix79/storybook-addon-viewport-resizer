import React, { FC } from "react";
import { styled } from "storybook/internal/theming";

export interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckboxLabel = styled("label")({
  display: "flex",
  alignItems: "center",
  gap: 4,
});

const Checkbox: FC<CheckboxProps> = ({ label, checked, onChange }) => {
  return (
    <CheckboxLabel>
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </CheckboxLabel>
  );
};

export default Checkbox;
