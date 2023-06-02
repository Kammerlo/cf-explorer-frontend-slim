import React, { useState } from "react";
import { ClickAwayListener, ListItemIcon, MenuList } from "@mui/material";

import { FilterIC } from "src/commons/resources";

import CustomIcon from "../CustomIcon";
import {
  FilterButton,
  FilterContainer,
  FilterContent,
  FilterIconContainer,
  FilterListItemText,
  FilterMenuItem
} from "./styles";

export interface FilterProps {
  options?: Option[];
  onOptionChange?: (value: any, option?: Option) => void;
}

export interface Option {
  value: any;
  label?: string | React.ReactNode;
  icon: React.ReactNode;
}

const Filter: React.FC<FilterProps> = ({ options, onOptionChange }) => {
  const [open, setOpen] = useState(false);

  const onClickAway = () => {
    setOpen(false);
  };

  const onFilterButtonClick = () => setOpen((pre) => !pre);
  const onOptionClick = (value: string, option: Option) => {
    onFilterButtonClick();
    onOptionChange?.(option.value, option);
  };
  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <FilterContainer>
        <FilterButton
          onClick={onFilterButtonClick}
          startIcon={
            <FilterIconContainer>
              <CustomIcon
                icon={FilterIC}
                width={18}
                color={(theme) => theme.palette.primary.main}
                fill="currentColor"
              />
            </FilterIconContainer>
          }
        >
          Filter
        </FilterButton>
        {open && options && (
          <FilterContent>
            <MenuList>
              {options.map((option) => (
                <FilterMenuItem key={option.value} onClick={() => onOptionClick(option.value, option)}>
                  <ListItemIcon>
                    <FilterIconContainer>{option.icon}</FilterIconContainer>
                  </ListItemIcon>
                  <FilterListItemText>{option.label}</FilterListItemText>
                </FilterMenuItem>
              ))}
            </MenuList>
          </FilterContent>
        )}
      </FilterContainer>
    </ClickAwayListener>
  );
};

export default Filter;
