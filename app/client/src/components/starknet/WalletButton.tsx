import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import {
  Connector,
  ConnectorNotFoundError,
  useConnect
} from "@starknet-react/core";
import { useState } from "react";
import { useStarknetContext } from "../../context/StarknetProvider";
import { useNotification } from "../../hooks/useNotification";

interface IWalletButtonProps {
  connector: Connector;
  handleClose: () => void;
}

export const WalletButton = ({
  connector,
  handleClose,
}: IWalletButtonProps) => {
  const { connectAsync } = useConnect();
  const { setConnector } = useStarknetContext();
  const [disabled, setDisabled] = useState(false);
  const { showError } = useNotification();

  const handleConnect = async () => {
    if (disabled) {
      return;
    }
    try {
      await connectAsync({ connector });
      setConnector(connector);
      handleClose();
    } catch (e: unknown) {
      if (e instanceof ConnectorNotFoundError) {
        showError(
          `${connector.name} wallet not found. Do you have it installed in your browser?`
        );
      } else {
        showError(`Error connecting ${connector.name} wallet.`);
      }
      setDisabled(true);
    }
  };

  return (
    <Box
      onClick={handleConnect}
      sx={{
        display: "flex",
        alignItems: "center",
        border: "1px solid black",
        p: 3,
        borderBottom: "none",
        backgroundColor: disabled ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
        cursor: disabled ? "default" : "pointer",
        "&:hover": {
          backgroundColor: disabled
            ? "rgba(255,255,255,0.2)6"
            : "rgba(0,0,0,0.3)",
        },
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <img width="30px" src={`/${connector.id}.png`} alt="starknet logo" />
      <Typography sx={{ ml: 2 }}>{connector.name}</Typography>
    </Box>
  );
};
