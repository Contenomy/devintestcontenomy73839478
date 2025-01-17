import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useTranslation } from 'react-i18next';
import './FilterMenu.css';

interface FilterMenuProps {
    onFilter: (filterType: string) => void;
}

export default function FilterMenu({ onFilter }: FilterMenuProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { t } = useTranslation();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleFilter = (filterType: string) => {
        onFilter(filterType);
        handleClose();
    };

    return (
        <div className="filter-menu">
            <Button
                aria-controls="filter-menu"
                aria-haspopup="true"
                onClick={handleClick}
                startIcon={<FilterListIcon />}
            >
                {t("filters")}
            </Button>
            <Menu
                id="filter-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => handleFilter('all')}>{t("allCreators")}</MenuItem>
                <MenuItem onClick={() => handleFilter('newArrivals')}>{t("newArrivals")}</MenuItem>
                <MenuItem onClick={() => handleFilter('positive')}>{t("positiveVariation")}</MenuItem>
                <MenuItem onClick={() => handleFilter('favorites')}>{t("favorites")}</MenuItem>
            </Menu>
        </div>
    );
}