import React, { useState } from 'react';
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  Bar,
  Area,
  Scatter,
  ComposedChart
} from 'recharts';

// Chart type components mapping
const CHART_COMPONENTS = {
  line: Line,
  bar: Bar,
  area: Area,
  scatter: Scatter,
};

const BaseChart = ({
  data,
  title,
  series,
  xAxisDataKey = 'week',
  yAxisLabel,
  height = 400,
  gridConfig = {
    horizontal: true,
    vertical: true,
    strokeDasharray: '3 3'
  },
  xAxisConfig = {
    angle: 90,
    height: 60,
    textAnchor: 'start',
    fontSize: '14px',
    fill: '#666666',
    fontWeight: 500
  },
  yAxisConfig = {
    fontSize: '14px',
    fill: '#666666',
    fontWeight: 500
  },
  legendConfig = {
    verticalAlign: 'top',
    height: 36
  },
  tooltipConfig = {},
}) => {
  // Track visibility state for each series
  const [visibleSeries, setVisibleSeries] = useState(
    series.reduce((acc, serie) => ({ ...acc, [serie.dataKey]: true }), {})
  );

  const handleLegendClick = (entry) => {
    setVisibleSeries(prev => ({
      ...prev,
      [entry.dataKey]: !prev[entry.dataKey]
    }));
  };

  // Render each series based on its type
  const renderSeries = () => series.map((serie) => {
    const ChartComponent = CHART_COMPONENTS[serie.type];

    if (!ChartComponent) {
      console.warn(`Unsupported chart type: ${serie.type}`);
      return null;
    }

    return (
      <ChartComponent
        key={serie.dataKey}
        type={serie.subType || 'monotone'} // For line/area charts
        dataKey={serie.dataKey}
        stroke={serie.color}
        fill={serie.fill || serie.color} // For bar/area charts
        name={serie.name}
        dot={serie.dot}
        hide={!visibleSeries[serie.dataKey]}
        {...serie.additionalProps} // Allow passing additional props specific to chart type
      />
    );
  });

  return (
    <div className="w-full">
      {title && (
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
      )}
      <div style={{ height }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            {gridConfig && (
              <CartesianGrid
                horizontal={gridConfig.horizontal}
                vertical={gridConfig.vertical}
                strokeDasharray={gridConfig.strokeDasharray}
              />
            )}

            <XAxis
              dataKey={xAxisDataKey}
              tick={xAxisConfig}
              height={xAxisConfig.height}
              textAnchor={xAxisConfig.textAnchor}
            />

            <YAxis
              tick={yAxisConfig}
              label={
                yAxisLabel
                  ? { value: yAxisLabel, angle: -90, position: 'insideLeft' }
                  : undefined
              }
            />

            <Tooltip {...tooltipConfig} />

            <Legend
              {...legendConfig}
              onClick={handleLegendClick}
              formatter={(value, entry) => (
                <span style={{
                  color: visibleSeries[entry.dataKey] ? entry.color : '#999',
                  cursor: 'pointer'
                }}>
                  {value}
                </span>
              )}
            />

            {renderSeries()}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BaseChart;
