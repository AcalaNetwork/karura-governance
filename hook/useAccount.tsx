import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useApi } from "./useApi";

export const AddressContext: React.Context<IAddress> = React.createContext({} as unknown as IAddress);

export interface IAddress {
  addresses: {
    address: string;
    genesisHash?: string | null | undefined;
    name?: string | undefined;
    type?: any | undefined;
  }[];
  activeAddress: string;
  changeActive: (value: string) => void;
}

export const Address = memo(({ children }) => {
  const [address, setAddress] = useState<IAddress["addresses"]>([]);
  const [activeAddress, setActiveAddress] = useState<string>("");
  const { loadExtension, isApiReady, extensions } = useApi();

  useEffect(() => {
    loadExtension();
    if (!extensions) return;
    const extension = extensions[0];

    const unsubscribe = extension?.accounts.subscribe((_accounts) => {
      const accounts = _accounts
        .filter((item) => item.type !== "ethereum")
        .map((item) => ({
          ...item,
          address: item.address,
        }));

      setAddress(accounts);
      setActiveAddress(accounts[0].address);
    });

    return (): void => {
      unsubscribe && unsubscribe();
    };
  }, [isApiReady]);

  const changeActive = useCallback((active: string) => {
    setActiveAddress(active);
  }, []);

  const value = useMemo<IAddress>(
    () => ({
      addresses: address,
      activeAddress: activeAddress,
      changeActive: changeActive,
    }),
    [activeAddress, address, changeActive]
  );

  return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>;
});

Address.displayName = "Address";
export const AddressConsumer: React.Consumer<IAddress> = AddressContext.Consumer;
export const AddressProvider: React.Provider<IAddress> = AddressContext.Provider;

export const useAddress = () => {
  return useContext(AddressContext);
};
