import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { HiArrowLongLeft } from "react-icons/hi2";

import CustomAccordion, { TTab } from "src/components/commons/CustomAccordion";
import AssociatedAddress from "src/components/NativeScriptsDetail/Tabs/AssociatedAddress";
import {
  AssetHoldersIcon,
  AssociatedAddressesIcon,
  MintingBurningPolicyIcon,
  ScriptTabIcon,
  TokenTabIcon
} from "src/commons/resources";
import HeaderOverview from "src/components/NativeScriptsDetail/HeaderOverview";
import MinttingBurningPolicy from "src/components/NativeScriptsDetail/Tabs/MinttingBurningPolicy";
import Script from "src/components/NativeScriptsDetail/Tabs/Script";
import Token from "src/components/NativeScriptsDetail/Tabs/Token";
import AssetHolders from "src/components/NativeScriptsDetail/Tabs/AssetHolders";

import { StyledContainer } from "./styles";
import { useNativeScriptDetail } from "./Tabs";
import { BackButton, BackText } from "../AddressDetail/AddressHeader/styles";
import VerifyFormModal from "./Modals/VerifyFormModal";

const NativeScriptsDetail = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const { associatedAddress, loading, keyHashes, refresh } = useNativeScriptDetail();
  const { t } = useTranslation();
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const smartcontractTabs: TTab[] = [
    {
      key: "mintingBurningPolicy",
      icon: MintingBurningPolicyIcon,
      children: <MinttingBurningPolicy />,
      label: "Minting/ Burning Policy"
    },
    {
      key: "associatedAddresses",
      icon: AssociatedAddressesIcon,
      children: <AssociatedAddress />,
      label: t("common.associatedAddresses")
    },
    {
      key: "script",
      icon: ScriptTabIcon,
      children: <Script onVerifyScriptOpen={() => setOpen(true)} />,
      label: "Script"
    },
    {
      key: "token",
      icon: TokenTabIcon,
      children: <Token />,
      label: "Token"
    },
    {
      key: "assetHolders",
      icon: AssetHoldersIcon,
      children: <AssetHolders />,
      label: "Asset Holders"
    }
  ];

  const hiddenKeys = useMemo(() => {
    const keys: string[] = [];
    if (!associatedAddress?.length) keys.push("associatedAddresses");
    if (!keyHashes?.length) keys.push("mintingBurningPolicy");
    return keys;
  }, [associatedAddress, keyHashes]);

  return (
    <StyledContainer>
      <Box display="flex" justifyContent="flex-start">
        <BackButton onClick={history.goBack}>
          <HiArrowLongLeft color={theme.palette.secondary.light} />
          <BackText>{t("common.back")}</BackText>
        </BackButton>
      </Box>
      <VerifyFormModal
        open={open}
        onClose={() => setOpen(false)}
        onReload={() => {
          setOpen(false);
          refresh?.();
        }}
      />
      <HeaderOverview onVerifyScriptOpen={() => setOpen(true)} data={{ scriptHash: id }} />
      <CustomAccordion loading={loading} tabs={smartcontractTabs} hiddenKeys={hiddenKeys} />
    </StyledContainer>
  );
};

export default NativeScriptsDetail;
