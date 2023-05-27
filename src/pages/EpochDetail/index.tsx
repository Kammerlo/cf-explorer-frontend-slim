import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import useFetch from "../../commons/hooks/useFetch";
import { API } from "../../commons/utils/api";
import NoRecord from "../../components/commons/NoRecord";
import EpochBlockList from "../../components/EpochDetail/EpochBlockList";
import EpochOverview from "../../components/EpochDetail/EpochOverview";
import { StyledContainer } from "./styles";
import { REFRESH_TIMES } from "../../commons/utils/constants";

const EpochDetail: React.FC = () => {
  const { epochId } = useParams<{ epochId: string }>();
  const { state } = useLocation<{ data?: IDataEpoch }>();

  const { data, loading, initialized, error } = useFetch<IDataEpoch>(
    `${API.EPOCH.DETAIL}/${epochId}`,
    state?.data,
    false,
    REFRESH_TIMES.EPOCH_DETAIL
  );

  useEffect(() => {
    window.history.replaceState({}, document.title);
    document.title = `Epoch ${epochId} | Cardano Explorer`;
  }, [epochId]);
  console.log(initialized, data,error);
  if (!initialized) {
    return null;
  }

  if ((initialized && !data) || error) return <NoRecord />;

  return (
    <StyledContainer>
      <EpochOverview data={data} loading={loading} />
      <EpochBlockList epochId={epochId} />
    </StyledContainer>
  );
};

export default EpochDetail;
