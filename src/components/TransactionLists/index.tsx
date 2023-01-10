import { useHistory, useLocation } from "react-router-dom";
import { stringify } from "qs";
import { Box } from "@mui/material";
import Card from "../commons/Card";
import Table, { Column } from "../commons/Table";
import { formatADA, formatADAFull, getPageInfo, getShortHash } from "../../commons/utils/helper";
import { details } from "../../commons/routers";
import { AIcon } from "../../commons/resources";
import { StyledLink } from "./styles";
import CustomTooltip from "../commons/CustomTooltip";
import useFetchList from "../../commons/hooks/useFetchList";

interface TransactionListProps {
  underline?: boolean;
  url: string;
  openDetail?: (_: any, r: Transactions, index: number) => void;
  selected?: number | null;
}

const columns: Column<Transactions>[] = [
  {
    title: "#",
    key: "id",
    minWidth: 30,
    render: (data, index) => index + 1,
  },
  {
    title: "Trx Hash",
    key: "trxhash",
    minWidth: 120,

    render: r => (
      <div>
        <CustomTooltip title={r.hash} placement="top">
          <StyledLink to={details.transaction(r.hash)}>{getShortHash(r.hash)}</StyledLink>
        </CustomTooltip>
      </div>
    ),
  },
  {
    title: "Block",
    key: "block",
    minWidth: 60,
    render: r => <StyledLink to={details.block(r.blockNo)}>{r.blockNo}</StyledLink>,
  },
  {
    title: "Fees",
    key: "fee",
    minWidth: 120,
    render: r => (
      <CustomTooltip placement="top" width="min-content" title={formatADAFull(r.fee)}>
        <Box display="flex" alignItems="center">
          <Box mr={1}>{formatADA(r.fee) || 0}</Box>
          <img src={AIcon} alt="a icon" />
        </Box>
      </CustomTooltip>
    ),
  },
  {
    title: "Output",
    minWidth: 120,
    key: "ouput",
    render: r => (
      <CustomTooltip placement="top" width="min-content" title={formatADAFull(r.totalOutput)}>
        <Box display="flex" alignItems="center">
          <Box mr={1}>{formatADA(r.totalOutput) || 0}</Box>
          <img src={AIcon} alt="a icon" />
        </Box>
      </CustomTooltip>
    ),
  },
];
const TransactionList: React.FC<TransactionListProps> = ({ underline = false, url, openDetail, selected }) => {
  const { search } = useLocation();
  const history = useHistory();
  const pageInfo = getPageInfo(search);
  const fetchData = useFetchList<Transactions>(url, pageInfo);

  const onClickRow = (_: any, r: Transactions, index: number) => {
    if (openDetail) return openDetail(_, r, index);
    history.push(details.transaction(r.hash));
  };

  return (
    <Card title={"Transactions"} underline={underline}>
      <Table
        {...fetchData}
        columns={columns}
        total={{ count: fetchData.total, title: "Total Transactions" }}
        pagination={{
          ...pageInfo,
          total: fetchData.total,
          onChange: (page, size) => history.push({ search: stringify({ page, size }) }),
        }}
        onClickRow={onClickRow}
        selected={selected}
      />
    </Card>
  );
};

export default TransactionList;
