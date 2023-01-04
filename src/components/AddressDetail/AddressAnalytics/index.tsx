import React, { useState } from "react";
import { Box, Grid } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

import {
  BoxInfo,
  BoxInfoItem,
  BoxInfoItemRight,
  Tabs,
  Tab,
  ButtonTitle,
  ChartBox,
  SkeletonUI,
  Title,
  ValueInfo,
  Wrapper,
} from "./styles";
import moment from "moment";
import { useParams } from "react-router-dom";
import useFetch from "../../../commons/hooks/useFetch";
import Card from "../../commons/Card";
import { formatADA, formatPrice } from "../../../commons/utils/helper";
import { HighestIcon, LowestIcon } from "../../../commons/resources";

type AnalyticsData = { date: string; value: number };

const options = [
  { value: "ONE_DAY", label: "1d" },
  { value: "ONE_WEEK", label: "1w" },
  { value: "ONE_MONTH", label: "1m" },
  { value: "THREE_MONTH", label: "3m" },
];

const AddressAnalytics: React.FC = () => {
  const [rangeTime, setRangeTime] = useState("ONE_DAY");
  const { address } = useParams<{ address: string }>();
  const { data, loading } = useFetch<AnalyticsData[]>(`/address/analytics/${address}/${rangeTime}`);
  const { data: balance, loading: balanceLoading } = useFetch<number[]>(`/address/min-max-balance/${address}`);
  const dataChart = data?.map(i => +formatADA(+i.value || 0) || []);
  const categories = data?.map(i => moment(i.date).format("DD MMM")) || [];
  const minBalance = Math.min(...(balance || []), 0);
  const maxBalance = Math.max(...(balance || []), 0);
  return (
    <Card title="Analytics" pt={5}>
      <Wrapper container columns={24}>
        <Grid item xs={24} lg={18}>
          <Grid spacing={2} container alignItems="center" justifyContent={"space-between"}>
            <Grid item xs={12} sm={6}>
              <ButtonTitle>Balance</ButtonTitle>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Tabs>
                {options.map(({ value, label }) => (
                  <Tab key={value} active={rangeTime === value ? 1 : 0} onClick={() => setRangeTime(value)}>
                    {label}
                  </Tab>
                ))}
              </Tabs>
            </Grid>
          </Grid>
          <ChartBox>
            {loading ? (
              <SkeletonUI variant="rectangular" style={{ height: "400px" }} />
            ) : (
              <HighchartsReact
                highcharts={Highcharts}
                options={{
                  chart: { type: "areaspline", style: { fontFamily: "Helvetica, monospace" } },
                  title: { text: "" },
                  yAxis: {
                    title: { text: null },
                    lineWidth: 1,
                    lineColor: "#E3E5E9",
                    gridLineWidth: 0,
                    labels: {
                      style: { fontSize: 12 },
                      formatter: (e: { value: string }) => formatPrice(e.value || 0),
                    },
                  },
                  xAxis: {
                    categories,
                    lineWidth: 1,
                    lineColor: "#E3E5E9",
                    plotLines: [],
                    angle: 0,
                    labels: {
                      style: {
                        fontSize: 12,
                      },
                    },
                  },
                  legend: { enabled: false },
                  tooltip: { shared: true },
                  credits: { enabled: false },
                  series: [
                    {
                      name: "",
                      pointPlacement: "on",
                      type: "areaspline",
                      marker: { enabled: false },
                      color: {
                        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                        stops: [
                          [0, "#184C78"],
                          [1, "#5A9C56"],
                        ],
                      },
                      fillColor: {
                        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                        stops: [
                          [0, "rgba(24, 76, 120, 0.3)"],
                          [1, "rgba(90, 156, 86, 0)"],
                        ],
                      },
                      data: dataChart,
                    },
                  ],
                }}
              />
            )}
          </ChartBox>
        </Grid>
        <Grid item xs={24} lg={6}>
          <BoxInfo>
            <Box flex={1}>
              <BoxInfoItemRight display={"flex"} alignItems="center" justifyContent={"center"}>
                <Box>
                  <img src={HighestIcon} width={"20%"} alt="heighest icon" />
                  <Title>Highest Balance</Title>
                  <ValueInfo>
                    {balanceLoading ? <SkeletonUI variant="rectangular" /> : formatADA(maxBalance || 0)}
                  </ValueInfo>
                </Box>
              </BoxInfoItemRight>
            </Box>
            <Box flex={1}>
              <BoxInfoItem display={"flex"} alignItems="center" justifyContent={"center"}>
                <Box>
                  <img src={LowestIcon} width={"20%"} alt="lowest icon" />
                  <Title>Lowest Balance</Title>
                  <ValueInfo>
                    {balanceLoading ? <SkeletonUI variant="rectangular" /> : formatADA(minBalance || 0)}
                  </ValueInfo>
                </Box>
              </BoxInfoItem>
            </Box>
          </BoxInfo>
        </Grid>
      </Wrapper>
    </Card>
  );
};

export default AddressAnalytics;
