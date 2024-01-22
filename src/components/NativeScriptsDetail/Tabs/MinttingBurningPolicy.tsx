import { useState } from "react";
import { Box, useTheme } from "@mui/material";
import { t } from "i18next";

import { NativeOneMint, NativeSig, NativeStatus, NativeTimelock, NativeType } from "src/commons/resources";
import { ChipContainer, MultiSigChip, TimeLockChip } from "src/pages/NativeScriptsAndSC/Card";
import { checkTimeLockOpen, formatDateTimeLocal, getShortHash } from "src/commons/utils/helper";
import CustomModal from "src/components/commons/CustomModal";
import DynamicEllipsisText from "src/components/DynamicEllipsisText";
import CustomTooltip from "src/components/commons/CustomTooltip";

import { CardSign, ContainerMint, ItemMint, MintCard, MintIcon, MintTitle, ViewSigner } from "./styles";

import { useNativeScriptDetail } from ".";

const MinttingBurningPolicy = () => {
  const { before, after, keyHashes, isOneTimeMint } = useNativeScriptDetail();
  const [signers, setSigners] = useState<string[] | null>(null);
  const theme = useTheme();

  const isMoreThan10years = (date?: string) => {
    if (date) {
      const date1 = new Date(date);
      const date2 = new Date();
      const differenceInTime = date2.getTime() - date1.getTime();
      const differenceInYears = differenceInTime / (1000 * 3600 * 24 * 365);
      if (isNaN(differenceInYears) || Math.abs(differenceInYears) > 10) return true;
      return false;
    }
    return false;
  };

  const renderTimeLock = ({ after, before }: { after?: string; before?: string }) => {
    if (before && after) {
      return (
        <Box>
          <Box display={"flex"} alignContent={"center"} gap={1}>
            until: {isMoreThan10years(after) ? t("moreThan10Years") : formatDateTimeLocal(after)}
          </Box>
          <Box display={"flex"} alignContent={"center"} gap={1}>
            as of: {isMoreThan10years(before) ? t("moreThan10Years") : formatDateTimeLocal(before)}
          </Box>
        </Box>
      );
    }
    if (before || after) {
      return (
        <Box display={"flex"} gap={1}>
          {before ? "as of: " : " until: "}
          {isMoreThan10years(before ? before : after)
            ? t("moreThan10Years")
            : formatDateTimeLocal(before ? before : (after as string))}
        </Box>
      );
    }
    return <Box display={"flex"}>{t("common.N/A")}</Box>;
  };

  return (
    <ContainerMint container>
      <ItemMint item width={"100%"} lg={after || before ? 3 : 4} md={6} sm={6} xs={12}>
        <MintCard>
          <MintIcon>
            <NativeType fill={theme.isDark ? theme.palette.secondary[800] : theme.palette.secondary[600]} />
          </MintIcon>
          <MintTitle>{t("nativeScript.mint.type")}</MintTitle>
          <Box display={"flex"} flexWrap={"wrap"}>
            <TimeLockChip
              isOpen={checkTimeLockOpen({ before, after }) !== null ? checkTimeLockOpen({ before, after }) : true}
            />
            <MultiSigChip isMultiSig={(keyHashes || []).length > 1} />
            {isOneTimeMint && (
              <ChipContainer Icon={NativeOneMint} message="One Time Mint" variant="info" titleTooltip="One Time Mint" />
            )}
          </Box>
        </MintCard>
      </ItemMint>
      <ItemMint item width={"100%"} lg={after || before ? 3 : 4} md={6} sm={6} xs={12}>
        <MintCard>
          <MintIcon>
            <NativeStatus fill={theme.isDark ? theme.palette.secondary[800] : theme.palette.secondary[600]} />
          </MintIcon>
          <MintTitle>{t("nativeScript.mint.status")}</MintTitle>
          <Box fontWeight={"bold"} lineHeight={1} fontSize={18} color={({ palette }) => palette.secondary.main}>
            {checkTimeLockOpen({ before, after }) !== null
              ? checkTimeLockOpen({ before, after })
                ? "Open"
                : "Locked"
              : "Open"}
          </Box>
        </MintCard>
      </ItemMint>
      {(after || before) && (
        <ItemMint item width={"100%"} lg={after || before ? 3 : 4} md={6} sm={6} xs={12}>
          <MintCard>
            <MintIcon>
              <NativeTimelock fill={theme.isDark ? theme.palette.secondary[800] : theme.palette.secondary[600]} />
            </MintIcon>
            <MintTitle>{t("nativeScript.mint.timeLockInfo")}</MintTitle>
            <Box lineHeight={1} fontWeight={"bold"} fontSize={18} color={({ palette }) => palette.secondary.main}>
              {renderTimeLock({ after, before })}
            </Box>
          </MintCard>
        </ItemMint>
      )}
      <ItemMint item width={"100%"} lg={after || before ? 3 : 4} md={6} sm={6} xs={12}>
        <MintCard>
          <MintIcon>
            <NativeSig fill={theme.isDark ? theme.palette.secondary[800] : theme.palette.secondary[600]} />
          </MintIcon>
          <MintTitle>{t("nativeScript.mint.signerKeys")}</MintTitle>
          {keyHashes && (keyHashes || []).length === 1 && (
            <CustomTooltip title={keyHashes[0]}>
              <Box fontWeight={"bold"} color={({ palette }) => palette.primary.main}>
                {getShortHash(keyHashes[0])}
              </Box>
            </CustomTooltip>
          )}
          {(keyHashes || []).length > 1 && (
            <Box component={ViewSigner} onClick={() => setSigners(keyHashes || [])}>
              {t("nativeScript.viewSigner")}
            </Box>
          )}
        </MintCard>
      </ItemMint>
      <ViewSignerModal open={!!signers} onClose={() => setSigners(null)} data={signers} />
    </ContainerMint>
  );
};

export default MinttingBurningPolicy;

interface ViewSignerModalProps {
  open: boolean;
  onClose: () => void;
  data: string[] | null;
}
const ViewSignerModal: React.FC<ViewSignerModalProps> = ({ data, ...props }) => {
  return (
    <CustomModal
      modalContainerProps={{ style: { maxWidth: 920 } }}
      open={props.open}
      style={{ maxHeight: "unset", overflow: "unset" }}
      onClose={props.onClose}
      title={t("nativeScript.signModal")}
    >
      <CardSign>
        <Box fontWeight={"bold"} color={({ palette }) => palette.secondary.light}>
          Signer Public Keys
        </Box>
        {(data || []).map((sig, idx) => (
          <Box
            key={idx}
            mt={1}
            fontWeight={"bold"}
            color={({ palette }) => palette.primary.main}
            display={"inline-block"}
          >
            <DynamicEllipsisText value={sig} isTooltip />
          </Box>
        ))}
      </CardSign>
    </CustomModal>
  );
};
