import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, Pagination, Box, Avatar } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import IMarketShare from '@model/MarketShare';
import './MarketTable.css';

interface MarketTableProps {
  marketShares: IMarketShare[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

type SortField = 'name' | 'price' | 'trend' | 'marketCap';

export default function MarketTable({ marketShares, currentPage, totalPages, onPageChange }: MarketTableProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedShares = [...marketShares].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleRowClick = (id: number) => {
    navigate(`/market/${id}`);
  };

  return (
    <Paper className="market-table-container">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">{t("creator")}</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'name'}
                  direction={sortField === 'name' ? sortDirection : 'asc'}
                  onClick={() => handleSort('name')}
                >
                  {t("name")}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'price'}
                  direction={sortField === 'price' ? sortDirection : 'asc'}
                  onClick={() => handleSort('price')}
                >
                  {t("price")}
                </TableSortLabel>
              </TableCell>
              <TableCell>{t("rewards")}</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'trend'}
                  direction={sortField === 'trend' ? sortDirection : 'asc'}
                  onClick={() => handleSort('trend')}
                >
                  {t("trend")}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'marketCap'}
                  direction={sortField === 'marketCap' ? sortDirection : 'asc'}
                  onClick={() => handleSort('marketCap')}
                >
                  {t("marketCap")}
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedShares.map((share) => (
              <TableRow key={share.id} onClick={() => handleRowClick(share.id)} className="market-table-row">
                <TableCell>
                  <Box display="flex" justifyContent="center">
                    <Avatar
                      src="/user.png"
                      alt={share.name}
                      sx={{ width: 50, height: 50 }}
                    />
                  </Box>
                </TableCell>
                <TableCell>{share.name}</TableCell>
                <TableCell>{t("number:currency", { value: share.price })}</TableCell>
                <TableCell>{share.rewards ? `${t("number:currency", { value: share.rewards.amount })} / ${share.rewards.frequency}` : '-'}</TableCell>
                <TableCell className={share.trend > 0 ? 'positive' : 'negative'}>
                  {t("number:percent", { value: share.trend })}
                </TableCell>
                <TableCell>{t("number:currency", { value: share.marketCap })}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(event, page) => onPageChange(page)}
        className="market-table-pagination"
      />
    </Paper>
  );
}