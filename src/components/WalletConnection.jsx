import { useState } from "react";
import { Card, Button, Alert, Badge } from "react-bootstrap";
import { useWeb3 } from "../contexts/Web3Context";

const WalletConnection = ({ onWalletConnected }) => {
  const {
    account,
    chainId,
    isConnected,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    switchToLocalNetwork,
  } = useWeb3();

  const [showFullAddress, setShowFullAddress] = useState(false);

  const formatAddress = (address) => {
    if (!address) return "";
    if (showFullAddress) return address;
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  const getNetworkName = (chainId) => {
    switch (chainId) {
      case 1:
        return "Ethereum Mainnet";
      case 3:
        return "Ropsten Testnet";
      case 4:
        return "Rinkeby Testnet";
      case 5:
        return "Goerli Testnet";
      case 31337:
        return "Hardhat Local";
      case 1337:
        return "Ganache Local";
      default:
        return `Unknown Network (${chainId})`;
    }
  };

  const handleConnect = async () => {
    const connectedAccount = await connectWallet();
    if (connectedAccount && onWalletConnected) {
      onWalletConnected(connectedAccount);
    }
  };

  const isLocalNetwork = chainId === 31337 || chainId === 1337;

  return (
    <Card className="mb-3">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <i className="fab fa-ethereum me-2"></i>
          MetaMask Wallet
        </h5>
        {isConnected && (
          <Badge bg={isLocalNetwork ? "success" : "warning"}>
            {getNetworkName(chainId)}
          </Badge>
        )}
      </Card.Header>
      <Card.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </Alert>
        )}

        {!isConnected ? (
          <div className="text-center">
            <div className="mb-3">
              <i className="fab fa-ethereum fa-3x text-muted"></i>
            </div>
            <p className="text-muted mb-3">
              Connect your MetaMask wallet to cast votes securely on the
              blockchain
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={handleConnect}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin me-2"></i>
                  Connecting...
                </>
              ) : (
                <>
                  <i className="fas fa-wallet me-2"></i>
                  Connect MetaMask
                </>
              )}
            </Button>
          </div>
        ) : (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <strong>Connected Account:</strong>
                <br />
                <code
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowFullAddress(!showFullAddress)}
                  title="Click to toggle full address"
                >
                  {formatAddress(account)}
                </code>
              </div>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={disconnectWallet}
              >
                <i className="fas fa-unlink me-1"></i>
                Disconnect
              </Button>
            </div>

            {!isLocalNetwork && (
              <Alert variant="warning">
                <i className="fas fa-exclamation-triangle me-2"></i>
                You're connected to {getNetworkName(chainId)}.
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="ms-2"
                  onClick={switchToLocalNetwork}
                >
                  Switch to Local Network
                </Button>
              </Alert>
            )}

            {isLocalNetwork && (
              <Alert variant="success">
                <i className="fas fa-check-circle me-2"></i>
                Ready to vote on the local blockchain network!
              </Alert>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default WalletConnection;
