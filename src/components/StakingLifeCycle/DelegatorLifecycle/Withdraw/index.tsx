import { useState } from "react";
import { Box } from "@mui/material";

import { FilterParams } from "src/components/StackingFilter";

import RecentWithdraws from "./RecentWithdraws";
import { WithdrawnDraw } from "./WithdrawDraw";

const Withdraw = () => {
  const [selected, setSelected] = useState<WithdrawItem | null>(null);
  const [params, setParams] = useState<FilterParams>({
    fromDate: undefined,
    sort: undefined,
    toDate: undefined,
    txHash: undefined
  });
  const handleSelect = (withdraw: WithdrawItem | null) => {
    setSelected(withdraw);
  };
  const [showBackButton, setShowBackButton] = useState<boolean>(false);

  return (
    <Box>
      <RecentWithdraws
        onSelect={handleSelect}
        params={params}
        setParams={setParams}
        setShowBackButton={setShowBackButton}
      />
      {!!selected && <WithdrawnDraw selected={selected} setSelected={setSelected} showBackButton={showBackButton} />}
    </Box>
  );
};
export default Withdraw;
