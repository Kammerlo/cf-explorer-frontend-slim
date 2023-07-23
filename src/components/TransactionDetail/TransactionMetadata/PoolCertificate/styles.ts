import { Box, styled } from "@mui/material";

export const TextLabel = styled("div")(({ theme }) => ({
  display: "inline-block",
  fontWeight: 400,
  fontSize: 14,
  lineHeight: "16px",
  color: theme.palette.secondary.light,
  width: 130,
  flexShrink: 0,
  [theme.breakpoints.down("sm")]: {
    width: 110
  }
}));

export const TextValue = styled("div")`
  display: inline-block;
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
  word-break: break-all;
  color: ${(props) => props.theme.palette.secondary.main};
`;

export const TextRightValue = styled("div")`
  display: inline-block;
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
  color: ${(props) => props.theme.palette.secondary.main};
`;

export const CardHeader = styled(Box)(({ theme }) => ({
  padding: "15px 0px",
  fontWeight: "bold",
  color: theme.palette.secondary.light,
  borderBottom: `1px solid ${theme.palette.border.main}`
}));
