"use client"
import React, { useEffect } from "react";
import { Chart } from "react-charts";

const DisplayChart = ({data}) => {

    useEffect(() => {
      console.log(data)
    }, [data])

    const primaryAxis = React.useMemo(
        () => ({
          getValue: datum => datum.time,
        }),
        []
      )
    
      const secondaryAxes = React.useMemo(
        () => [
          {
            getValue: datum => datum.price,
          },
        ],
        []
      )
    

  return (
  <div className="size-64 bg-white">
          <Chart
            options={{
              data,
              primaryAxis,
              secondaryAxes,
            }}
          />
        </div>)
}

export default DisplayChart;
