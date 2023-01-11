import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { stringify } from "qs";
import useFetchList from "../../../commons/hooks/useFetchList";
import { details } from "../../../commons/routers";
import { formatADA, getPageInfo, getShortWallet } from "../../../commons/utils/helper";
import CustomTooltip from "../../commons/CustomTooltip";
import Table, { Column } from "../../commons/Table";
import { PriceValue, SmallText, StyledLink } from "./styles";

interface ITokenTopHolder {
  active: boolean;
  tokenId: string;
  totalSupply?: number;
}

const TokenTopHolder: React.FC<ITokenTopHolder> = ({ active, tokenId, totalSupply }) => {
  const { search } = useLocation();
  const history = useHistory();
  const pageInfo = getPageInfo(search);

  const fetchData = useFetchList<ITokenTopHolderTable>(`tokens/${tokenId}/top_holders`, { ...pageInfo, tokenId });

  const columns: Column<ITokenTopHolderTable>[] = [
    {
      title: "#",
      key: "id",
      minWidth: "40px",
      render: (data, index) => <SmallText>{index + 1}</SmallText>,
    },
    {
      title: "Address",
      key: "address",
      minWidth: "200px",
      render: r => (
        <CustomTooltip title={r.address} placement="top">
          <StyledLink to={details.address(r.address)}>{getShortWallet(r.address)}</StyledLink>
        </CustomTooltip>
      ),
    },
    {
      title: "Balance",
      key: "balance",
      minWidth: "200px",
      render: r => (
        <PriceValue>
          <SmallText>{formatADA(r?.quantity ? r.quantity * 1000000 : 0) || 0}</SmallText>
          {/* <PriceIcon src={AIcon} alt="a icon" /> */}
        </PriceValue>
      ),
    },
    {
      title: "Share",
      key: "share",
      minWidth: "200px",
      render: r => (
        <SmallText>{r.quantity && totalSupply ? ((r.quantity / totalSupply) * 100).toFixed(2) : 0}%</SmallText>
      ),
    },
  ];

  return (
    <Table
      {...fetchData}
      columns={columns}
      total={{ title: "Total", count: fetchData.total }}
      pagination={{
        ...pageInfo,
        total: fetchData.total,
        onChange: (page, size) => history.push({ search: stringify({ page, size }) }),
      }}
      onClickRow={(_, r: ITokenTopHolderTable) => history.push(details.address(r.address))}
    />
  );
};

export default TokenTopHolder;
