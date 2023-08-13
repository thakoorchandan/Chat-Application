import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const Statistics = () =>  {
    const [state, setState] = useState({
        options: {
          chart: {
            id: "basic-bar"
          },
          xaxis: {
            categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '30%',
              endingShape: 'rounded'
            },
          },
          dataLabels: {
            enabled: false
          },
        },
        series: [
          {
            name: "Tasks",
            data: [30, 26, 54, 35, 10, 44, 40]
          },
          {
            name: "Completed",
            data: [16, 17, 30, 15, 8, 30, 28]
          }
        ]
      });

    return (
      <div className="chartContainer">
        <h4>Current Week Activity</h4>
        <Chart
          options={state.options}
          series={state.series}
          type="bar"
          width="250"
        />
      </div>

    );
}

export default Statistics;