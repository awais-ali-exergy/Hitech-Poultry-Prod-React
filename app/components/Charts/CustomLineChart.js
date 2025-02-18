import React from 'react';
import BaseChart from './BaseChart';

const CustomLineChart = ({
  data,
  title,
  series,
  xAxisDataKey,
  yAxisLabel,
  height,
  ...restProps
}) => {
  // Transform series to ensure they're all line type
  const lineSeries = series.map(serie => ({
    ...serie,
    type: 'line',
    subType: 'monotone',
    dot: false,
    ...serie.lineProps // Allow overriding line-specific props
  }));

  return (
    <BaseChart
      data={data}
      title={title}
      series={lineSeries}
      xAxisDataKey={xAxisDataKey}
      yAxisLabel={yAxisLabel}
      height={height}
      {...restProps}
    />
  );
};

export default CustomLineChart;
