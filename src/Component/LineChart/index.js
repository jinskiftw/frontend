import React, { useState,useEffect } from "react";
import ReactApexChart from "react-apexcharts";

const ApexChart = ({categories,data}) => {
 console.log("data iiiiis ",data);

 

  const [chartState,setChartState] = useState( {
    options: {
      chart: {
        id: "basic-bar"
      },
      xaxis: {
        categories: categories
      }
    },
    series: [
      {
        name: "cost",
        data: data
      }
    ]
  });

  useEffect(() => {
    // Update chart options and series when data or categories change
    setChartState((prevChartState) => ({
      options: {
        ...prevChartState.options,
        xaxis: {
          categories: categories,
        },
      },
      series: [
        {
          name: "cost",
          data: data,
        },
      ],
    }));
  }, [categories, data]);

  


  return (
    <div id="chart">
   
      <ReactApexChart
        options={chartState.options}
        series={chartState.series}
        type="line"
        height={350}
      />
    </div>
  );
};

export default ApexChart;
  