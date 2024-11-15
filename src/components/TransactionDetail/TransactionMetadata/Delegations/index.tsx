import React from "react";
import { Box, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

import { useScreen } from "src/commons/hooks/useScreen";
import sendImg from "src/commons/resources/images/sendImg.svg";
import { details } from "src/commons/routers";
import { UpGreenUtxoDarkmode } from "src/commons/resources";
import DynamicEllipsisText from "src/components/DynamicEllipsisText";

import { AddressLink, Header, ItemContainer, StatusIcon, StyledItem, Wrapper, EllipsisContainer } from "./styles";

interface DelegationProps {
  data: TransactionDetail["delegations"] | null;
}

const Delegations: React.FC<DelegationProps> = ({ data }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { isMobile } = useScreen();
  return (
    <Wrapper>
      <Header>{t("common.stakeAddress")}</Header>
      {data?.map((item, index) => (
        <StyledItem key={item.address}>
          <ItemContainer>
            <Box display="flex" alignItems="center" flex={1}>
              <Box width={isMobile ? 42 : 50}>
                <StatusIcon src={theme.isDark ? UpGreenUtxoDarkmode : sendImg} alt="wallet icon" />
              </Box>
              <Box width={"100%"}>
                <Box
                  component={"span"}
                  color={({ palette }) => palette.secondary.light}
                  mr={1}
                  display={"flex"}
                  alignItems={"center"}
                >
                  {t("glossary.from")}:&nbsp;
                  <AddressLink to={details.stake(item.address)} style={{ width: "100%" }}>
                    <EllipsisContainer>
                      <DynamicEllipsisText
                        dataTestIdFirstPath={`trx.detail.delegation.address#${index}`}
                        value={item.address || ""}
                        isCopy
                        isTooltip
                        customTruncateFold={[5, 6]}
                        postfix={5}
                      />
                    </EllipsisContainer>
                  </AddressLink>
                </Box>
                <Box display={"flex"} alignItems={"center"}>
                  <Box component={"span"} color={({ palette }) => palette.secondary.light} minWidth={"fit-content"}>
                    {t("common.poolID")}:&nbsp;
                  </Box>
                  <AddressLink to={details.delegation(item.poolId)} style={{ width: "100%" }}>
                    <EllipsisContainer>
                      <DynamicEllipsisText
                        dataTestIdFirstPath={`trx.detail.delegation.poolId#${index}`}
                        value={item.poolId || ""}
                        isCopy
                        isTooltip
                        customTruncateFold={[5, 6]}
                        postfix={5}
                      />
                    </EllipsisContainer>
                  </AddressLink>
                </Box>
              </Box>
            </Box>
          </ItemContainer>
        </StyledItem>
      ))}
    </Wrapper>
  );
};

export default Delegations;
