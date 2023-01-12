import { useState } from "react";
import moment from "moment";
import { parse, stringify } from "qs";
import { useHistory, useLocation, useParams } from "react-router-dom";
import useFetchList from "../../commons/hooks/useFetchList";
import { details, routers } from "../../commons/routers";
import { formatADA, formatPercent, getPageInfo, getShortHash, getShortWallet } from "../../commons/utils/helper";
import CustomTooltip from "../../components/commons/CustomTooltip";
import Table, { Column } from "../../components/commons/Table";
import { RegistrationContainer, StyledLink, StyledTab, StyledTabs, TabLabel } from "./styles";

enum POOL_TYPE {
  REGISTRATION = "registration",
  DEREREGISTRATION = "de-registration",
}

const columns: Column<Registration>[] = [
  {
    title: "Trx Hash",
    key: "trxHash",
    render: r => {
      return (
        <>
          <CustomTooltip title={r.txHash} placement="top">
            <StyledLink to={details.transaction(r.txHash)}>{getShortHash(r.txHash || "")}</StyledLink>
          </CustomTooltip>
          <div>{moment(r.txTime).format("MM/DD/YYYY HH:mm:ss")}</div>
        </>
      );
    },
  },
  {
    title: "Block",
    key: "block",
    render: r => (
      <>
        <StyledLink to={details.block(r.block)}>{r.block}</StyledLink>
        <br />
        <StyledLink to={details.epoch(r.epoch)}>{r.epoch}</StyledLink>/{r.slotNo}
      </>
    ),
  },
  {
    title: "Pool",
    key: "pool",
    render: r => <StyledLink to={details.delegation(r.txId)}>{r.poolName}</StyledLink>,
  },
  {
    title: "Pledge (A)",
    key: "pledge",
    render: r => <>{formatADA(r.pledge)}</>,
  },
  {
    title: "Cost (A)",
    key: "cost",
    render: r => <>{formatADA(r.cost)}</>,
  },
  {
    title: "Fee",
    key: "margin",
    render: r => formatPercent(r.margin || 0),
  },
  {
    title: "Stake Key",
    key: "stakeKey",
    render: r =>
      r.stakeKey?.[0] ? (
        <CustomTooltip title={r.stakeKey[0]} placement="top">
          <StyledLink to={details.stake(r.stakeKey[0])}>{getShortWallet(r.stakeKey[0])}</StyledLink>
        </CustomTooltip>
      ) : (
        ""
      ),
  },
];

const RegistrationPools = () => {
  const history = useHistory();
  const { search } = useLocation();
  const pageInfo = getPageInfo(search);
  const { poolType = POOL_TYPE.REGISTRATION } = useParams<{ poolType: POOL_TYPE }>();

  const fetchData = useFetchList<Registration>(`/pool/${poolType}`, pageInfo);

  const onChangeTab = (e: React.SyntheticEvent, poolType: POOL_TYPE) => {
    history.push(routers.REGISTRATION_POOLS.replace(":poolType", poolType));
  };

  return (
    <RegistrationContainer>
      <StyledTabs
        value={poolType}
        onChange={onChangeTab}
        TabIndicatorProps={{ sx: { backgroundColor: props => props.colorGreenLight, height: 4 } }}
      >
        <StyledTab value={POOL_TYPE.REGISTRATION} label={<TabLabel>Registration</TabLabel>} />
        <StyledTab value={POOL_TYPE.DEREREGISTRATION} label={<TabLabel>Deregistration</TabLabel>} />
      </StyledTabs>
      <Table
        {...fetchData}
        columns={columns}
        total={{ title: "Total Transactions", count: fetchData.total }}
        pagination={{
          ...pageInfo,
          onChange: (page, size) => history.push({ search: stringify({ page, size }) }),
          total: fetchData.total,
        }}
      />
    </RegistrationContainer>
  );
};

export default RegistrationPools;
