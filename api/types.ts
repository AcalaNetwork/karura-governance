import type { SubmittableExtrinsicFunction } from '@polkadot/api/promise/types';
import type { InjectedExtension } from '@polkadot/extension-inject/types';

import { WalletPromise } from '@acala-network/sdk-wallet';

import { ApiPromise } from '@polkadot/api/promise';

export interface ApiState {
  apiDefaultTx: SubmittableExtrinsicFunction;
  apiDefaultTxSudo: SubmittableExtrinsicFunction;
  hasInjectedAccounts: boolean;
  isApiReady: boolean;
  isDevelopment: boolean;
  systemChain: string;
  systemName: string;
  systemVersion: string;
}

export interface SDK {
  wallet: WalletPromise
}

export interface ApiProps extends ApiState {
  api: ApiPromise;
  sdk?: SDK;
  apiError: string | null;
  extensions?: InjectedExtension[];
  isReady: boolean;
  isApiConnected: boolean;
  isApiInitialized: boolean;
  isWaitingInjected: boolean;
  loadExtension: () => Promise<void>;
  isLoaded: boolean;
  isExtensionLoading: boolean;
}
