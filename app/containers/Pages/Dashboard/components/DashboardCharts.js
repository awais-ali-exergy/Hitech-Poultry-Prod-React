import React from 'react';
import { Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';
import CustomLineChart from '../../../../components/Charts/CustomLineChart';

// Styled component for the chart container
const ChartContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  height: '100%',
}));

// Generate dates starting from August 28, 2023
const generateDates = (startDate, numWeeks) => {
  const dates = [];
  let currentDate = dayjs(startDate);

  for (let i = 0; i < numWeeks; i++) {
    dates.push({
      date: currentDate.format('D MMM YYYY'),
      week: `Week ${i + 1}`,
    });
    currentDate = currentDate.add(7, 'day');
  }
  return dates;
};

const dates = generateDates('2023-08-28', 24);

// Feed consumption data with updated metrics
const feedData = dates.map((dateObj, index) => ({
  week: dateObj.week,
  actual: 20 + index * 4,
  standard: 25 + index * 4,
  date: dateObj.date,
}));

// Light hours data
const lightData = dates.map((dateObj, index) => ({
  week: dateObj.week,
  actual: index === 0 ? 23 : index % 10 === 0 ? 9 : 8,
  standard: 8,
  date: dateObj.date,
}));

// Body weight data with updated metrics
const weightData = dates.map((dateObj, index) => ({
  week: dateObj.week,
  actual: 200 + index * 120,
  standard: 250 + index * 115,
  date: dateObj.date,
}));

const DashboardCharts = () => {
  const standardSeries = [
    { dataKey: 'standard', name: 'Standard', color: '#ff0000' },
    { dataKey: 'actual', name: 'Actual', color: '#2196f3' },
  ];

  const penWiseSeries = [
    { dataKey: 'standard', name: 'Standard', color: '#ff0000' },
  ];

  return (
    <Grid container spacing={3}>
      {/* First Row */}
      <Grid item xs={12} md={6}>
        <ChartContainer>
          <CustomLineChart
            title="Feed in Gram Consumption"
            data={feedData}
            series={standardSeries}
            yAxisLabel="Grams"
          />
        </ChartContainer>
      </Grid>

      <Grid item xs={12} md={6}>
        <ChartContainer>
          <CustomLineChart
            title="Body Weight"
            data={weightData}
            series={standardSeries}
            yAxisLabel="Grams"
          />
        </ChartContainer>
      </Grid>

      {/* Second Row */}
      <Grid item xs={12} md={6}>
        <ChartContainer>
          <CustomLineChart
            title="Light Hours (up to 64 Week)"
            data={lightData}
            series={standardSeries}
            yAxisLabel="Light Hours Per Day"
          />
        </ChartContainer>
      </Grid>

      <Grid item xs={12} md={6}>
        <ChartContainer>
          <CustomLineChart
            title="Body Weight Pen Wise"
            data={weightData}
            series={penWiseSeries}
            yAxisLabel="Grams"
          />
        </ChartContainer>
      </Grid>
    </Grid>
  );
};

export default DashboardCharts;
