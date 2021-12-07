import { FixedPointNumber } from "@acala-network/sdk-core"
import { parseFixed } from '@ethersproject/bignumber';

export const formatNumberString = (value: string, decimal = 18) => {
  return FixedPointNumber.fromInner(value, decimal).toString();
};

export const generateNumberString = (value: string | number, decimal = 18) => {
  return parseFixed(value.toString(), decimal).toString();
}