import { FormControl, FormLabel, FormHelperText } from "@chakra-ui/form-control";
import { Box, Flex } from "@chakra-ui/layout";
import { Input, Switch, Select, Button, useToast } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { useAddress } from "../../../hook/useAccount";
import { useApi } from "../../../hook/useApi";
import { formatNumberString, generateNumberString, getSigner, handleTxResults } from "../../../utils";

const CBox = styled(Box)`
  padding: 20px;
  margin: 0 auto;
  width: 440px;
`;

interface IParams {
  interestRatePerSec: string;
  liquidationRatio: string;
  liquidationPenalty: string;
  requiredCollateralRatio: string;
  maximumTotalDebitValue: string;
}

export const SetCollateralParams: FC = () => {
  const { api } = useApi();
  const [actives, setActives] = useState<string[]>([]);
  const [token, setToken] = useState<string>("KSM");
  const [loading, setLoading] = useState<boolean>(true);
  const [params, setParams] = useState<IParams>({
    interestRatePerSec: "0",
    liquidationRatio: "0",
    liquidationPenalty: "0",
    requiredCollateralRatio: "0",
    maximumTotalDebitValue: "0",
  });
  const [newParams, setNewParams] = useState<IParams>({} as unknown as IParams);

  const toast = useToast({
    title: `Submitint......`,
    position: "top-right",
    isClosable: true,
    duration: 10000,
  });

  useEffect(() => {
    if (!api || !api.query || !api.query.cdpEngine || !api.query.cdpEngine.collateralParams) return;

    api.query.cdpEngine.collateralParams({ token: token }).then((result) => {
      const formatResult = result as any;
      setParams({
        interestRatePerSec: formatNumberString(formatResult["interestRatePerSec"].toString()),
        liquidationRatio: formatNumberString(formatResult["liquidationRatio"].toString()),
        liquidationPenalty: formatNumberString(formatResult["liquidationPenalty"].toString()),
        requiredCollateralRatio: formatNumberString(formatResult["requiredCollateralRatio"].toString()),
        maximumTotalDebitValue: formatNumberString(formatResult["maximumTotalDebitValue"].toString()),
      });
      setLoading(false);
    });
  }, [api, api?.query?.cdpEngine?.collateralParams, token]);

  const handleTokenChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setLoading(true);
    setToken(e.target.value);
  };

  const handleSwitchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const id = e.target.id.split("-")[0];
    const set = e.target.checked ? Array.from(new Set(actives.concat([id]))) : actives.filter((e) => e != id);
    setActives(set);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, field: string) => {
    const result = Object.assign(newParams, {
      [field]: generateNumberString(e.target.value),
    });
    setNewParams(result);
  };

  const { activeAddress } = useAddress();

  const handleClick = async () => {
    const oldParams = {} as unknown as IParams;
    const _newParams = {} as unknown as IParams;
    Object.keys(params).forEach((key) => {
      oldParams[key] = generateNumberString(params[key]);
    });
    Object.keys(newParams).forEach((key) => {
      if (actives.includes(key)) {
        _newParams[key] = newParams[key];
      }
    });
    const submitParams = Object.assign(oldParams, _newParams);

    const tx = await api.tx.cdpEngine.setCollateralParams(
      token,
      submitParams.interestRatePerSec,
      submitParams.liquidationRatio,
      submitParams.liquidationPenalty,
      submitParams.requiredCollateralRatio,
      submitParams.maximumTotalDebitValue
    );
    const signer = await getSigner(activeAddress);
    await tx.signAsync(activeAddress, { signer });
    setLoading(true);
    const unsubscribe = await tx.send(
      handleTxResults(
        'send',
        {
          txFailedCb: (r) => {
            toast({
              status: 'error',
              description: r.find(({ status }) => status === 'error')?.message,
              duration: 5000
            });
          },
          txSuccessCb: (r) => {
            toast({
              status: 'success',
              duration: 1500
            });
          }
        },
        (): void => {
          setLoading(false);
          unsubscribe();
        }
      )
    );
  };

  return (
    <CBox>
      <FormControl id="token" mb="20px">
        <FormLabel alignItems="center">Token</FormLabel>
        <Select onChange={(e) => handleTokenChange(e)}>
          <option value="KSM">KSM</option>
          <option value="LKSM">LKSM</option>
          <option value="KAR">KAR</option>
        </Select>
      </FormControl>
      <FormControl id="interestRatePerSec" mb="20px">
        <Flex justifyContent="space-between" alignItems="center">
          <FormLabel>InterestRatePerSec</FormLabel>
          <Flex alignItems="center">
            <FormLabel>isChange</FormLabel>
            <Switch onChange={(e) => handleSwitchChange(e)} id="interestRatePerSec-change" />
          </Flex>
        </Flex>
        <Input
          onChange={(e) => handleInputChange(e, "interestRatePerSec")}
          isDisabled={!actives.includes("interestRatePerSec")}
          type="number"
        />
        <FormHelperText>pre value: {params.interestRatePerSec}</FormHelperText>
      </FormControl>
      <FormControl id="liquidationRatio" mb="20px">
        <Flex justifyContent="space-between" alignItems="center">
          <FormLabel>liquidationRatio</FormLabel>
          <Flex alignItems="center">
            <FormLabel>isChange</FormLabel>
            <Switch onChange={(e) => handleSwitchChange(e)} id="liquidationRatio-change" />
          </Flex>
        </Flex>
        <Input
          onChange={(e) => handleInputChange(e, "liquidationRatio")}
          isDisabled={!actives.includes("liquidationRatio")}
          type="number"
        />
        <FormHelperText>pre value: {params.liquidationRatio}</FormHelperText>
      </FormControl>
      <FormControl id="liquidationPenalty" mb="20px">
        <Flex justifyContent="space-between" alignItems="center">
          <FormLabel>liquidationPenalty</FormLabel>
          <Flex alignItems="center">
            <FormLabel>isChange</FormLabel>
            <Switch onChange={(e) => handleSwitchChange(e)} id="liquidationPenalty-change" />
          </Flex>
        </Flex>
        <Input
          onChange={(e) => handleInputChange(e, "liquidationPenalty")}
          isDisabled={!actives.includes("liquidationPenalty")}
          type="number"
        />
        <FormHelperText>pre value: {params.liquidationPenalty}</FormHelperText>
      </FormControl>
      <FormControl id="requiredCollateralRatio" mb="20px">
        <Flex justifyContent="space-between" alignItems="center">
          <FormLabel>requiredCollateralRatio</FormLabel>
          <Flex alignItems="center">
            <FormLabel>isChange</FormLabel>
            <Switch onChange={(e) => handleSwitchChange(e)} id="requiredCollateralRatio-change" />
          </Flex>
        </Flex>
        <Input
          onChange={(e) => handleInputChange(e, "requiredCollateralRatio")}
          isDisabled={!actives.includes("requiredCollateralRatio")}
          type="number"
        />
        <FormHelperText>pre value: {params.requiredCollateralRatio}</FormHelperText>
      </FormControl>
      <FormControl id="maximumTotalDebitValue" mb="20px">
        <Flex justifyContent="space-between" alignItems="center">
          <FormLabel>maximumTotalDebitValue</FormLabel>
          <Flex alignItems="center">
            <FormLabel>isChange</FormLabel>
            <Switch onChange={(e) => handleSwitchChange(e)} id="maximumTotalDebitValue-change" />
          </Flex>
        </Flex>
        <Input
          onChange={(e) => handleInputChange(e, "maximumTotalDebitValue")}
          isDisabled={!actives.includes("maximumTotalDebitValue")}
          type="number"
        />
        <FormHelperText>pre value: {params.maximumTotalDebitValue}</FormHelperText>
      </FormControl>
      <Button onClick={() => handleClick()} isLoading={loading} colorScheme="blue" width="100%">
        Submit
      </Button>
    </CBox>
  );
};
