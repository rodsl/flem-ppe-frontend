import { Box, Flex, Heading } from "@chakra-ui/react";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
  });

export function LineChart() {
    const chartData = {
      chart: {
        toolbar: {
          show: false,
        },
      },
      tooltip: {
        theme: "dark",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        type: "datetime",
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        labels: {
          style: {
            colors: "#c8cfca",
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "#c8cfca",
            fontSize: "12px",
          },
        },
      },
      legend: {
        show: false,
      },
      grid: {
        strokeDashArray: 5,
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "vertical",
          shadeIntensity: 0.5,
          gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
          inverseColors: true,
          opacityFrom: 0.8,
          opacityTo: 0,
          stops: [],
        },
        colors: ["#3F6DC0", "#192C4D"],
      },
      colors: ["#3F6DC0", "#192C4D"],
      series: [
        {
          name: "Beneficiários Monitorados",
          data: [
            { x: "2022-01-01", y: 90 },
            { x: "2022-02-01", y: 40 },
            { x: "2022-03-01", y: 50 },
            { x: "2022-04-01", y: 10 },
          ],
        },
        {
          name: "Monitoramentos Pendentes",
          data: [
            { x: "2022-01-01", y: 180 },
            { x: "2022-02-01", y: 80 },
            { x: "2022-03-01", y: 100 },
            { x: "2022-04-01", y: 20 },
          ],
        },
      ],
    };
  
    return (
      <Flex
        bg="white"
        rounded="lg"
        shadow="sm"
        pb={4}
        pe={4}
        pt={7}
        flexDir="column"
        w="100%"
        h="100%"
      >
        <Box ps={6}>
          <Heading as="h3" size="lg">
            Monitoramentos
          </Heading>
        </Box>
        <Box ps={2} w="100%" h="100%">
          <ReactApexChart
            options={chartData}
            series={chartData.series}
            type="area"
            width="100%"
            height="100%"
          />
        </Box>
      </Flex>
    );
  }