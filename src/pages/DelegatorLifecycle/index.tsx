import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";

import { getShortWallet } from "../../commons/utils/helper";
import DelegatorLifecycleComponent from "../../components/StakingLifeCycle/DelegatorLifecycle";
import Tablular from "../../components/StakingLifeCycle/DelegatorLifecycle/Tablular";
import CopyButton from "../../components/commons/CopyButton";

import {
  BoxContainerStyled,
  BoxItemStyled,
  BoxSwitch,
  BoxSwitchContainer,
  ButtonGroup,
  ButtonReport,
  ButtonReportContainer,
  ButtonSwitch,
  StakeId,
  StyledContainer,
} from "./styles";

import { ReactComponent as ChartMode } from "../../commons/resources/icons/Staking/ChartMode.svg";
import { ReactComponent as TableMode } from "../../commons/resources/icons/Staking/TableMode.svg";
import { details } from "../../commons/routers";
import ReportComposerModal from "../../components/StakingLifeCycle/DelegatorLifecycle/ReportComposerModal";
import CustomTooltip from "../../components/commons/CustomTooltip";

const DelegatorLifecycle = () => {
  const { stakeId = "", tab = "" } = useParams<{
    stakeId: string;
    tab?: "registration" | "delegation" | "rewardsDistribution" | "rewardsWithdrawal" | "deregistration" | "tablular";
  }>();
  const tabList = {
    registration: 0,
    delegation: 1,
    rewardsDistribution: 2,
    rewardsWithdrawal: 3,
    deregistration: 4,
    tablular: null,
  };
  const [currentStep, setCurrentStep] = useState(tabList[tab || "registration"] || 0);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"timeline" | "tablular">(tab === "tablular" ? "tablular" : "timeline");
  const containerRef = useRef(null);
  const [containerPosition, setContainerPosition] = useState<{ top?: number; left?: number }>({
    top: undefined,
    left: undefined,
  });

  useEffect(() => {
    setCurrentStep(tabList[tab || "registration"] || 0);
    if (tab === "tablular") {
      setMode("tablular");
    }
  }, [tab]);

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

  return (
    <StyledContainer ref={containerRef}>
      <BoxContainerStyled>
        <Box>
          <Box component={"h2"} mb="5px" mt={0} fontSize={36} lineHeight="42px">
            Staking Lifecycle For
          </Box>
          <Box display={"flex"} alignItems={"center"}>
            <Box component={"span"} fontSize={"1rem"} lineHeight={1}>
              Stake key:
            </Box>
            <CustomTooltip title={stakeId}>
              <StakeId to={details.stake(stakeId)}>{getShortWallet(stakeId)}</StakeId>
            </CustomTooltip>
            <CopyButton text={stakeId} />
          </Box>
        </Box>
        <BoxItemStyled>
          <BoxSwitchContainer>
            <BoxSwitch color={({ palette }) => palette.grey[400]}>
              <Box>Switch to {mode === "timeline" ? "tablular" : "timeline"} view</Box>
            </BoxSwitch>
            <ButtonGroup>
              <ButtonSwitch active={+(mode === "timeline")} onClick={() => setMode("timeline")}>
                <ChartMode fill={mode === "timeline" ? "#fff" : "#344054"} />
              </ButtonSwitch>
              <ButtonSwitch active={+(mode === "tablular")} onClick={() => setMode("tablular")}>
                <TableMode fill={mode === "tablular" ? "#fff" : "#344054"} />
              </ButtonSwitch>
            </ButtonGroup>
          </BoxSwitchContainer>
          {mode === "tablular" && (
            <ButtonReportContainer>
              <ButtonReport onClick={() => setOpen(true)}>Compose report</ButtonReport>
            </ButtonReportContainer>
          )}
        </BoxItemStyled>
      </BoxContainerStyled>
      <Box>
        {mode === "timeline" && (
          <DelegatorLifecycleComponent
            handleResize={handleResize}
            containerPosition={containerPosition}
            setMode={setMode}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
        )}
        {mode === "tablular" && <Tablular />}
      </Box>
      <ReportComposerModal open={open} handleCloseModal={() => setOpen(false)} />
    </StyledContainer>
  );
};

export default DelegatorLifecycle;
