import React, { useState, useEffect, useCallback } from 'react';
import { Box, ToggleButtonGroup, ToggleButton, keyframes } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import useFetch from '@hooks/useFetch';

const timeRanges = { '1G': 0, '7G': 1, '1M': 2, '1A': 3, 'YTD': 4, 'ALL': 5 };

declare type TrendPoint = {
  timestamp: Date,
  value: number
}

const emptyData: TrendPoint[] = [];

interface PriceChartProps {
  creatorId: string;
  width?: number;
  height?: number;
}

const PriceChart: React.FC<PriceChartProps> = ({ creatorId, width = 800, height = 300 }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('1M');
  const [timeRangeValue, setTimeRangeValue] = useState(2);

  const updateTimeRange = useCallback((time: string): ((evt: any) => void)  =>{
    return (evt: Event) => {
      setSelectedTimeRange(time);
      setTimeRangeValue(timeRanges[time as keyof typeof timeRanges])
    }
  }, [setSelectedTimeRange, setTimeRangeValue]);

  const [res, loading] = useFetch(`https://localhost:7126/api/PriceHistory/trend/${creatorId}?period=${timeRangeValue}`, emptyData);

  // useEffect(() => {
  //   // const sampleData = {
  //   //   '1G': {
  //   //     xAxis: [{ scaleType: 'point', data: ['9:00', '12:00', '15:00', '18:00'] }],
  //   //     series: [{ data: [10, 11, 10.5, 11.2] }],
  //   //   },
  //   //   '7G': {
  //   //     xAxis: [{ scaleType: 'point', data: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'] }],
  //   //     series: [{ data: [10, 10.5, 11, 10.8, 11.2, 11.5, 11.3] }],
  //   //   },
  //   //   '1M': {
  //   //     xAxis: [{ scaleType: 'point', data: ['Sett1', 'Sett2', 'Sett3', 'Sett4'] }],
  //   //     series: [{ data: [10, 10.8, 11.2, 11.5] }],
  //   //   },
  //   //   '1A': {
  //   //     xAxis: [{ scaleType: 'point', data: ['Gen', 'Apr', 'Lug', 'Ott'] }],
  //   //     series: [{ data: [9, 10, 11, 11.5] }],
  //   //   },
  //   //   'YTD': {
  //   //     xAxis: [{ scaleType: 'point', data: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag'] }],
  //   //     series: [{ data: [10, 10.2, 10.5, 11, 11.2] }],
  //   //   },
  //   //   'ALL': {
  //   //     xAxis: [{ scaleType: 'point', data: ['2020', '2021', '2022', '2023'] }],
  //   //     series: [{ data: [8, 9, 10, 11.5] }],
  //   //   },
  //   };

  //   setChartData(sampleData[selectedTimeRange] || { xAxis: [{ scaleType: 'point', data: [] }], series: [{ data: [] }] });
  // }, [creatorId, selectedTimeRange]);

  const handleTimeRangeChange = (event: React.MouseEvent<HTMLElement>, newTimeRange: string | null) => {
    if (newTimeRange !== null) {
      setSelectedTimeRange(newTimeRange);
    }
  };

  return (
    <Box className="chart-container">
      <ToggleButtonGroup
        value={selectedTimeRange}
        exclusive
        onChange={handleTimeRangeChange}
        aria-label="time range"
        className="toggle-button-group"
        size="small"
      >
        {Object.keys(timeRanges).map((range) => (
          <ToggleButton key={range} value={range} aria-label={range} onClick={updateTimeRange(range)}>
            {range}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <LineChart
        xAxis={[
          {
            scaleType: 'time',
            dataKey: 'timestamp',
            valueFormatter(value: Date) {
              if (!(value instanceof Date)) {
                value = new Date(value);
              }
              return value.toLocaleDateString() + " " + value.toLocaleTimeString();
            },
          }
        ]}
        series={[
          {
            area: true,
            showMark: false,
            dataKey: 'value',
            valueFormatter(value?: number) {
              if (value === undefined) {
                return "";
              }
              return value.toPrecision(2);
            }
          }
        ]}
        dataset={res.map(f => { f.timestamp = new Date(f.timestamp); return f; })}
        width={width}
        height={height}
      />
    </Box>
  );
};

export default PriceChart;