import React from "react";
import { Chart } from "react-google-charts";
import "./style.css";
 
export const options = {
   title: "Cost breakdown",
   sliceVisibilityThreshold:0.0001
};

export function PieChart({data}) {
  return ( 
    <Chart
    sliceVisibilityThreshold="0.000001"
      chartType="PieChart"
      data={data}
      options={options}
      formatters={[
        {
           type: "NumberFormat",
           column: 1,
           options: {
              prefix: "$",
             
              negativeColor: "red",
              negativeParens: true,
            }
         }
     ]}
      width={"100%"}
      height={"400px"}
    />
  );
}
