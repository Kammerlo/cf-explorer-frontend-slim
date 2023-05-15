import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import useFetch from '../../../commons/hooks/useFetch';
import { details, routers } from '../../../commons/routers';
import { formatADAFull, formatPercent } from '../../../commons/utils/helper';
import ViewAllButton from '../../commons/ViewAllButton';
import { Column } from '../../commons/Table';
import {
  DelegateTable,
  Header,
  PoolName,
  ProgressContainer,
  ProgressTitle,
  StyledLinearProgress,
  Title,
  TopDelegateContainer
} from './style';
import RateWithIcon from '../../commons/RateWithIcon';
import CustomTooltip from '../../commons/CustomTooltip';
import { Box } from '@mui/system';
import { API } from '../../../commons/utils/api';
import { REFRESH_TIMES } from '../../../commons/utils/constants';

const TopDelegationPools = () => {
  const { data, loading, initialized } = useFetch<DelegationPool[]>(
    `${API.DELEGATION.TOP}?page=1&size=4`,
    undefined,
    false,
    REFRESH_TIMES.TOP_DELEGATION_POOLS
  );
  const history = useHistory();

  const columns: Column<DelegationPool>[] = [
    {
      title: 'Pool',
      key: 'name',
      render: (r) => <PoolName to={`/delegation-pool/${r.poolId}`}>{r.poolName || r.poolId}</PoolName>
    },
    {
      title: 'Pool size (A)',
      key: 'size',
      render: (r) => formatADAFull(r.poolSize || 0)
    },
    {
      title: 'Reward',
      key: 'reward',
      render: (r) => <RateWithIcon value={r.reward} multiple={100} />
    },
    {
      title: 'Fee (A)',
      key: 'fee',
      render: (r) => (
        <CustomTooltip title={`${r.feePercent * 100 || 0}% (${formatADAFull(r.feeAmount)} A)`}>
          <Box display='inline-block'>
            {formatPercent(r.feePercent || 0)} ({formatADAFull(r.feeAmount)} A)
          </Box>
        </CustomTooltip>
      )
    },
    {
      title: 'Declared Pledge (A)',
      key: 'declaredPledge',
      render: (r) => <Box display='inline-block'>{formatADAFull(r.pledge)}</Box>
    },
    {
      title: 'Saturation',
      key: 'output',
      render: (r) => (
        <ProgressContainer>
          <CustomTooltip title={`${r.saturation}%`}>
            <ProgressTitle>{formatPercent(r.saturation / 100)}</ProgressTitle>
          </CustomTooltip>
          <CustomTooltip title={`${r.saturation}%`}>
            <StyledLinearProgress variant='determinate' value={r.saturation} style={{ width: 150 }} />
          </CustomTooltip>
        </ProgressContainer>
      )
    }
  ];
  return (
    <TopDelegateContainer>
      <Header>
        <Title>Top Delegation Pools</Title>
        <ViewAllButton to={routers.DELEGATION_POOLS} />
      </Header>
      <DelegateTable
        loading={loading}
        initialized={initialized}
        columns={columns}
        data={data?.slice(0, 3) || []}
        onClickRow={(_, r: DelegationPool) => history.push(details.delegation(r.poolId))}
      />
    </TopDelegateContainer>
  );
};

export default TopDelegationPools;
