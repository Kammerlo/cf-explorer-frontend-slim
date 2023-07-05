import { useTheme } from "@mui/material";

import InfoGraphicImage from "src/commons/resources/images/infographic.png";

import { Image } from "./styles";
import CustomModal from "../commons/CustomModal";

interface IInfoGraphicModalProps {
  open: boolean;
  onClose: () => void;
}
const InfoGraphicModal: React.FC<IInfoGraphicModalProps> = (props) => {
  const theme = useTheme();
  return (
    <CustomModal
      {...props}
      closeButtonProps={{
        sx: { background: theme.palette.grey[200], border: "none", "&:hover": { background: theme.palette.grey[200] } }
      }}
      modalProps={{
        sx: {
          "& > div.MuiBox-root": { padding: "25px" },
          "& > div.MuiBox-root > div.MuiBox-root": { maxHeight: "90vh" }
        }
      }}
    >
      <Image src={InfoGraphicImage} alt="info grapphic" />
    </CustomModal>
  );
};

export default InfoGraphicModal;