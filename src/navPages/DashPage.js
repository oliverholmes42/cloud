import React, { useContext, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import sales from "../data/sales.json"; // Assuming your sales data is here
import Select from "react-select/base";
import tickets from "../data/ticketScreens.json";
import { fetchStats, fetchWeekStat } from "../api/api";
import { AuthContext } from "../AuthContext";

export default function Dash() {
  const mergedData = sales[0].map((item, index) => ({
    day: item.day,
    sales1: item.sales, // Last week's sales (always shown)
    sales2: sales[1][index]?.sales || null, // This week's sales (only shown if present)
    difference:
      sales[1][index]?.sales != null
        ? sales[1][index].sales - item.sales
        : null, // Calculate gain/loss if this week's data exists
  }));
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [data, setData] = useState(null);
  const { token, location } = useContext(AuthContext);
  const [weeks, setWeeks] = useState({});

  function getWeekdayName(dayNumber) {
    // Create a date where 1 maps to Monday
    const baseDate = new Date(2024, 0, 1); // January 1, 2024 is a Monday
    baseDate.setDate(baseDate.getDate() + (dayNumber - 1)); // Adjust day to match dayNumber
    const formatter = new Intl.DateTimeFormat("sv-SE", { weekday: "short" });
    return formatter.format(baseDate);
  }

  async function fetchWeek() {
    const merge = [];

    // Ensure 'date' is a valid Date object
    const currentDate = new Date(date); // Safely convert to a Date object

    // Fetch this week's stats
    const thisWeek = await fetchWeekStat(
      token,
      location.location.sid,
      currentDate
    );

    // Create a new Date object for last week's date
    const lwDate = new Date(currentDate); // Clone the date
    lwDate.setDate(currentDate.getDate() - 7);

    // Fetch last week's stats
    const lastWeek = await fetchWeekStat(token, location.location.sid, lwDate);

    console.log(thisWeek);
    console.log(lastWeek);

    // Combine data into a single array of objects, preserving the order
    for (let i = 0; i < thisWeek.length; i++) {
      const thisWeekData = thisWeek[i];
      const lastWeekData = lastWeek[i]; // Assuming the order is the same

      merge.push({
        day: getWeekdayName(thisWeekData.wday), // Day of the week
        thisWeek: thisWeekData.tot, // Total for this week
        lastWeek: lastWeekData.tot, // Total for last week
      });
    }

    // Update state
    setWeeks(merge);
  }

  useEffect(() => {
    console.log(weeks);
  }, [weeks]);

  async function fetcho() {
    console.log("ELlo");

    try {
      const result = await fetchStats(
        token,
        location.location.sid,
        date.slice(0, 10).replace(/-/g, "")
      );
      setData(result.rca.filter((item) => item.grp !== "tot"));
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }

  const minSales = Math.min(
    ...mergedData.flatMap((item) =>
      [item.sales1, item.sales2].filter((val) => val !== null)
    )
  );
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A28FAD",
    "#82CA9D",
    "#FF6666",
  ];

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Översikt</h1>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button onClick={fetcho}>Hämta data</button>
      <button onClick={fetchWeek}>Hämta vecka</button>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-evenly",
        }}
      >
        {/* BarChart with both sales sets */}
        <ResponsiveContainer width={400} height={200}>
          <BarChart
            data={weeks}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis
              domain={[0, "auto"]}
              tickFormatter={(value) =>
                `${(value / 100000).toLocaleString("sv-SE")}kkr`
              }
            />

            <Tooltip />
            <Legend />
            <Bar dataKey="lastWeek" fill="#8884d8" name="Föregående vecka" />
            <Bar dataKey="thisWeek" fill="#82ca9d" name="Nuvarande" />
          </BarChart>
        </ResponsiveContainer>

        {/* AreaChart with transparency */}
        <ResponsiveContainer width={300} height={200}>
          <AreaChart
            data={mergedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis domain={[minSales, "auto"]} />{" "}
            {/* Start Y-axis from the minimum sales */}
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="sales1"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.3}
              name="Föregående"
            />
            <Area
              type="monotone"
              dataKey="sales2"
              stroke="#82ca9d"
              fill="#82ca9d"
              fillOpacity={0.3}
              name="Nuvarande"
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Gain/Loss BarChart */}
        <ResponsiveContainer width={300} height={200}>
          <BarChart
            data={mergedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis domain={[-100, 100]} />
            <Tooltip />
            {/* Bars for gain/loss */}
            <Bar dataKey="difference">
              {mergedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.difference > 0 ? "#82ca9d" : "#ff4d4f"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {data && (
        <ResponsiveContainer width={800} height={400}>
          <PieChart>
            <Pie
              data={data}
              dataKey="antal"
              nameKey="text"
              cx="50%"
              cy="50%"
              outerRadius={200}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="right" layout="vertical" align="right" />
          </PieChart>
        </ResponsiveContainer>
      )}
    </>
  );
}
