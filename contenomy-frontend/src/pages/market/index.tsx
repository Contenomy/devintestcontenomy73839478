import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import MarketHighlights from './components/MarketHighlights';
import MarketTable from './components/MarketTable';
import FilterMenu from './components/FilterMenu';
import SearchBar from './components/SearchBar';
import './MarketPage.css';

const ITEMS_PER_PAGE = 10;

export default function Market() {
  const { t } = useTranslation();
  const [creators, setCreators] = useState<any[]>([]);
  const [filteredCreators, setFilteredCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCreators = useCallback(async () => {
    try {
      const response = await fetch('https://localhost:7126/api/ContentCreator');
      const data = await response.json();
      setCreators(data);
      setFilteredCreators(data);
      setTotalPages(Math.ceil(data.length / ITEMS_PER_PAGE));
      setLoading(false);
    } catch (error) {
      console.error("Errore durante il fetch dei Content Creator:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCreators();
  }, [fetchCreators]);

  const handleFilter = useCallback((filterType: string) => {
    let filtered = [...creators];
    // filtri 
    setFilteredCreators(filtered);
    setCurrentPage(1);
    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
  }, [creators]);

  const handleSearch = useCallback((searchTerm: string) => {
    const filtered = creators.filter(creator => 
      creator.nickname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCreators(filtered);
    setCurrentPage(1);
    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
  }, [creators]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <p>{t("loading")}</p>;
  }

  const paginatedCreators = filteredCreators.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <Box className="market-page">
      <MarketHighlights marketShares={creators.slice(0, 10)} />
      <Typography variant="h4" className="market-title">Content Creator</Typography>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <FilterMenu onFilter={handleFilter} />
        <SearchBar onSearch={handleSearch} searchResults={filteredCreators} />
      </Box>
      <MarketTable 
        marketShares={paginatedCreators.map(creator => ({
          id: creator.userId,
          name: creator.nickname || creator.username,
          price: creator.currentValue,
          marketCap: creator.currentValue * creator.totalQuantity,
          trend: 0,
		  history: []
        }))}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </Box>
  );
}