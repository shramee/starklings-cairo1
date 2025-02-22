import { Button, Menu, MenuItem } from "@mui/material";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { useStarknetContext } from "../../context/StarknetProvider";
import { ConnectWalletDrawer } from "./ConnectWalletDrawer";

export const WalletConnector = () => {
  const { address, isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const { connect } = useConnect();
  const { setConnector, connectedConnector } = useStarknetContext();
  const [connectWalletDrawerOpen, setConnectWalletDrawerOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const disconnect = async () => {
    await disconnectAsync();
    setConnector(undefined);
    handleClose();
  };

  useEffect(() => {
    if (connectedConnector && !isConnected) {
      connect({ connector: connectedConnector });
    }
  }, []);

  return (
    <>
      {isConnected && address ? (
        <>
          <Button variant="outlined" color="warning" onClick={handleClick}>
            {"0x..." + address.slice(address.length - 6)}
          </Button>
          <Menu
            sx={{ mt: 1 }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={disconnect}>Disconnect wallet</MenuItem>
          </Menu>
        </>
      ) : (
        <Button
          variant="outlined"
          color="warning"
          onClick={() => setConnectWalletDrawerOpen(true)}
        >
          Connect wallet
        </Button>
      )}
      <ConnectWalletDrawer
        open={connectWalletDrawerOpen}
        handleClose={() => setConnectWalletDrawerOpen(false)}
      />
    </>
  );
};
