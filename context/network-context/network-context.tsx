import { createContext,useEffect,useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import { Alert } from "react-native";

type NetworkContextType = {
  connected: boolean;
  handleConnectivityChange: (isConnected: boolean) => void;
};

const INITIAL_STATE: NetworkContextType = {
  connected: true,
  handleConnectivityChange: () => {},
};

export const NetworkContext = createContext<NetworkContextType>(INITIAL_STATE);

const NetworkContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [connected, setConnected] = useState(true);

  useEffect(() => {
    NetInfo.addEventListener((listener) => {




      if(!!listener){

        handleConnectivityChange(listener?.isConnected ?? false);
        if(listener.isConnected === false) {
          Alert.alert(
            "No Internet Connection",
            "Please check your internet connection and try again"
          );
        }
      }
    });

    return () => {
      // unsubscribe();
    };
  }, []);

  const handleConnectivityChange = (isConnected: boolean) => {
    setConnected(isConnected);
  };

  const props = { connected, handleConnectivityChange };
  return (
    <NetworkContext.Provider value={props}>{children}</NetworkContext.Provider>
  );
};

export const useNetworkContext = () => {
  const context = useContext(NetworkContext);

  if (!context) {
    throw new Error(
      "useNetworkContext must be used within a NetworkContextProvider"
    );
  }

  return context;
};

export default NetworkContextProvider;
