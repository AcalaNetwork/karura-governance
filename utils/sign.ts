import { keyring } from '@polkadot/ui-keyring';

export const getSigner = async (address: string) => {
  const pair = keyring.getPair(address);

  const {
    meta: { isInjected, source }
  } = pair;

  if (isInjected) {
    const { web3FromSource } = await import('@polkadot/extension-dapp');
    const injected = await web3FromSource(source as string);

    if (!injected) throw new Error(`Unable to find a signer for ${address}`);

    return injected.signer;
  } else {
    throw new Error(`Unable to find a signer for ${address}`);
  }
};