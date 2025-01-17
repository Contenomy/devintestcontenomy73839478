import React, { useState, useEffect } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import './SearchBar.css';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  searchResults: any[];
}

export default function SearchBar({ onSearch, searchResults }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, onSearch]);

  return (
    <div className="search-bar">
      <TextField
        fullWidth
        variant="outlined"
        placeholder={t("searchCreators")}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon className="yellow-icon" />
            </InputAdornment>
          ),
        }}
      />
      {searchTerm && searchTerm.length > 0 && searchResults.length === 0 && (
        <p className="no-results-message">
          {t("Non trovi il tuo creator? Invitalo ad unirsi a noi!")}
        </p>
      )}
    </div>
  );
}
