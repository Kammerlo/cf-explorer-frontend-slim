import { Box } from "@mui/material";
import { useHistory, useParams } from "react-router";
import { useEffect, useRef, useState } from "react";

import { getShortHash } from "../../commons/utils/helper";
import CopyButton from "../../components/commons/CopyButton";
import SPOLifecycleComponent from "../../components/StakingLifeCycle/SPOLifecycle";

import {
  BoxContainerStyled,
  BoxItemStyled,
  BoxSwitch,
  BoxSwitchContainer,
  ButtonGroup,
  ButtonReport,
  ButtonReportContainer,
  ButtonSwitch,
  PoolId,
  StyledContainer
} from "./styles";

import { ReactComponent as ChartMode } from "../../commons/resources/icons/Staking/ChartMode.svg";
import { ReactComponent as TableMode } from "../../commons/resources/icons/Staking/TableMode.svg";
import ReportComposerModal from "../../components/StakingLifeCycle/DelegatorLifecycle/ReportComposerModal";
import Tablular from "../../components/StakingLifeCycle/SPOLifecycle/Tablular";
import CustomTooltip from "../../components/commons/CustomTooltip";
import { useScreen } from "../../commons/hooks/useScreen";
import { details } from "../../commons/routers";
import useAuth from "~/commons/hooks/useAuth";

const SPOLifecycle = () => {
  const {
    poolId = "",
    mode = "timeline",
    tab = "registration"
  } = useParams<{ poolId: string; mode: ViewMode; tab: SPOStep }>();

  const tabList = {
    registration: 0,
    "pool-updates": 1,
    "operator-rewards": 2,
    deregistration: 3,
    tablular: null
  };

  const [currentStep, setCurrentStep] = useState(tabList[tab || "registration"] || 0);

  const { isMobile } = useScreen();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    setCurrentStep(tabList[tab || "registration"] || 0);
  }, [tab]);

  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const history = useHistory();
  const [containerPosition, setContainerPosition] = useState<{ top?: number; left?: number }>({
    top: undefined,
    left: undefined
  });

  useEffect(() => {
    if (containerRef.current) {
      const position = (containerRef.current as any)?.getBoundingClientRect();
      setContainerPosition({ top: position.top, left: position.left });
    }
  }, [containerRef.current]);

  const handleResize = () => {
    if (containerRef.current) {
      const position = (containerRef.current as any).getBoundingClientRect();
      setContainerPosition({ top: position.top, left: position.left });
    }
  };
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const changeMode = (mode: ViewMode) => {
    history.push(details.spo(poolId, mode, tab));
  };

  return (
    <StyledContainer ref={containerRef}>
      <BoxContainerStyled>
        <Box>
          <Box component={"h2"} mb='5px' mt={0} fontSize={isMobile ? 24 : 36} lineHeight='42px'>
            Staking Lifecycle For
          </Box>
          <Box display={"flex"} alignItems={"center"}>
            <Box component={"span"} fontSize={"0.875rem"} lineHeight={1}>
              Pool ID:
            </Box>
            <CustomTooltip title={poolId}>
              <PoolId to={details.delegation(poolId)}>{getShortHash(poolId)}</PoolId>
            </CustomTooltip>
            <CopyButton text={poolId} />
          </Box>
        </Box>
        <BoxItemStyled>
          <BoxSwitchContainer>
            <BoxSwitch color={({ palette }) => palette.grey[400]}>
              <Box>Switch to {mode === "timeline" ? "tabular" : "timeline"} view</Box>
            </BoxSwitch>
            <ButtonGroup>
              <ButtonSwitch active={+(mode === "timeline")} onClick={() => changeMode("timeline")}>
                <ChartMode fill={mode === "timeline" ? "#fff" : "#344054"} />
              </ButtonSwitch>
              <ButtonSwitch active={+(mode === "tabular")} onClick={() => changeMode("tabular")}>
                <TableMode fill={mode === "tabular" ? "#fff" : "#344054"} />
              </ButtonSwitch>
            </ButtonGroup>
          </BoxSwitchContainer>

          {mode === "tabular" && (
            <ButtonReportContainer disabled={!isLoggedIn}>
              <ButtonReport onClick={() => setOpen(true)}>Compose report</ButtonReport>
            </ButtonReportContainer>
          )}
        </BoxItemStyled>
      </BoxContainerStyled>

      <Box ml={isMobile ? 2 : 0}>
        {mode === "timeline" && (
          <SPOLifecycleComponent
            handleResize={handleResize}
            containerPosition={containerPosition}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
        )}
        {mode === "tabular" && <Tablular />}
      </Box>
      <ReportComposerModal open={open} handleCloseModal={() => setOpen(false)} />
    </StyledContainer>
  );
};

export default SPOLifecycle;
