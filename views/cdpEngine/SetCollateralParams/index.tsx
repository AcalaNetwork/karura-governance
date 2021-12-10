import { forceToCurrencyId } from "@acala-network/sdk-core";
import { FormControl, FormLabel, FormHelperText } from "@chakra-ui/form-control";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Box, Flex } from "@chakra-ui/layout";
import {
  Input,
  Switch,
  Select,
  Button,
  useToast,
  ToastId,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import React, { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { useAddress } from "../../../hook/useAccount";
import { useApi } from "../../../hook/useApi";
import { formatNumberString, generateNumberString, getSigner, handleTxResults } from "../../../utils";

const CBox = styled(Box)`
  padding: 30px 40px;
  margin: 0 auto;
  width: 500px;
  background: #ffffff;
  border-radius: 8px;
`;

const CFormLabel = styled(FormLabel)`
  margin: 0px 4px 0px 0px;
  height: 28px;
`;

type IParamField =
  | "interestRatePerSec"
  | "liquidationRatio"
  | "liquidationPenalty"
  | "requiredCollateralRatio"
  | "maximumTotalDebitValue";

interface IParams {
  interestRatePerSec: string;
  liquidationRatio: string;
  liquidationPenalty: string;
  requiredCollateralRatio: string;
  maximumTotalDebitValue: string;
}

export const SetCollateralParams: FC = () => {
  const { api } = useApi();
  const { activeAddress } = useAddress();
  const [actives, setActives] = useState<string[]>([]);
  const [token, setToken] = useState<string>("KSM");
  const [loading, setLoading] = useState<boolean>(true);
  const [members, setMembers] = useState<string[]>([]);
  const [params, setParams] = useState<IParams>({
    interestRatePerSec: "0",
    liquidationRatio: "0",
    liquidationPenalty: "0",
    requiredCollateralRatio: "0",
    maximumTotalDebitValue: "0",
  });
  const [newParams, setNewParams] = useState<IParams>({} as unknown as IParams);
  const refs = {
    interestRatePerSec: useRef(null),
    liquidationRatio: useRef(null),
    liquidationPenalty: useRef(null),
    requiredCollateralRatio: useRef(null),
    maximumTotalDebitValue: useRef(null),
  };

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

    api.query.financialCouncilMembership.members().then((result) => {
      const formatResult = (result as any).map((i: any) => i.toString());
      setMembers(formatResult);
    });
  }, [api, api?.query?.cdpEngine?.collateralParams, token]);

  const handleTokenChange = (value: string) => {
    setLoading(true);
    setToken(value);
  };

  const handleSwitchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const id = e.target.id.split("-")[0] as IParamField;
    if (e.target.checked) {
      setActives(Array.from(new Set(actives.concat([id]))));
    } else {
      if (refs[id] && refs[id].current) {
        (refs[id].current as unknown as HTMLInputElement).value = "";
      }
      setActives(actives.filter((e) => e != id));
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, field: string) => {
    const result = Object.assign(newParams, {
      [field]: generateNumberString(e.target.value),
    });
    setNewParams(result);
  };

  const handleClick = async () => {
    if (!members.includes(activeAddress)) {
      return toast({
        status: "error",
        description: "You are not a member of the council",
        duration: 2000,
      });
    }
    const submitParams: any = {};
    (Object.keys(newParams) as IParamField[]).forEach((key) => {
      if (actives.includes(key)) {
        submitParams[key] = newParams[key];
      }
    });
    setLoading(true);
    const toastId = toast({
      title: `Submitint CdpEngine setCollateralParams......`,
      position: "top-right",
      isClosable: true,
    });
    const call = api.tx.cdpEngine.setCollateralParams(
      forceToCurrencyId(api, token),
      submitParams.interestRatePerSec ? { NewValue: submitParams.interestRatePerSec } : null,
      submitParams.liquidationRatio ? { NewValue: submitParams.liquidationRatio } : null,
      submitParams.liquidationPenalty ? { NewValue: submitParams.liquidationPenalty } : null,
      submitParams.requiredCollateralRatio ? { NewValue: submitParams.requiredCollateralRatio } : null,
      submitParams.maximumTotalDebitValue ? { NewValue: submitParams.maximumTotalDebitValue } : null
    );
    const tx = await api.tx.financialCouncil.propose(Math.ceil(members.length / 2), call, call.length);
    const signer = await getSigner(activeAddress);
    await tx.signAsync(activeAddress, { signer });
    const unsubscribe = await tx.send(
      handleTxResults(
        "send",
        {
          txFailedCb: (r) => {
            toast.update(toastId as ToastId, {
              status: "error",
              description: r.find(({ status }) => status === "error")?.message,
              duration: 5000,
            });
          },
          txSuccessCb: () => {
            (Object.keys(refs) as IParamField[]).forEach(
              (ref) => ((refs[ref].current as unknown as HTMLInputElement).value = "")
            );
            toast.update(toastId as ToastId, {
              status: "success",
              duration: 1500,
            });
          },
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
        <CFormLabel alignItems="center">Token</CFormLabel>
        <Menu colorScheme="gray">
          <MenuButton
            width="100%"
            as={Button}
            variant="outline"
            color="gray.800"
            _hover={{ bg: "transparent" }}
            _active={{ bg: "transparent" }}
          >
            <Flex alignItems="center" justifyContent="space-between">
              {token}
              <ChevronDownIcon />
            </Flex>
          </MenuButton>
          <MenuList bg="gray.100" borderColor="gray.100">
            <MenuItem _hover={{ bg: "gray.300" }} onClick={() => handleTokenChange("KSM")}>
              KSM
            </MenuItem>
            <MenuItem _hover={{ bg: "gray.300" }} onClick={() => handleTokenChange("LKSM")}>
              LKSM
            </MenuItem>
            <MenuItem _hover={{ bg: "gray.300" }} onClick={() => handleTokenChange("KAR")}>
              KAR
            </MenuItem>
          </MenuList>
        </Menu>
      </FormControl>
      <FormControl id="interestRatePerSec" mb="20px">
        <Flex justifyContent="space-between" alignItems="center">
          <CFormLabel>InterestRate per sec</CFormLabel>
          <Flex alignItems="center">
            <CFormLabel>isChange</CFormLabel>
            <Switch isDisabled={loading} onChange={(e) => handleSwitchChange(e)} id="interestRatePerSec-change" />
          </Flex>
        </Flex>
        <Input
          ref={refs.interestRatePerSec}
          onChange={(e) => handleInputChange(e, "interestRatePerSec")}
          isDisabled={!actives.includes("interestRatePerSec")}
          type="number"
        />
        <FormHelperText>pre value: {params.interestRatePerSec}</FormHelperText>
      </FormControl>
      <FormControl id="liquidationRatio" mb="20px">
        <Flex justifyContent="space-between" alignItems="center">
          <CFormLabel>Liquidation ratio</CFormLabel>
          <Flex alignItems="center">
            <CFormLabel>isChange</CFormLabel>
            <Switch isDisabled={loading} onChange={(e) => handleSwitchChange(e)} id="liquidationRatio-change" />
          </Flex>
        </Flex>
        <Input
          ref={refs.liquidationRatio}
          onChange={(e) => handleInputChange(e, "liquidationRatio")}
          isDisabled={!actives.includes("liquidationRatio")}
          type="number"
        />
        <FormHelperText>pre value: {params.liquidationRatio}</FormHelperText>
      </FormControl>
      <FormControl id="liquidationPenalty" mb="20px">
        <Flex justifyContent="space-between" alignItems="center">
          <CFormLabel>Liquidation penalty</CFormLabel>
          <Flex alignItems="center">
            <CFormLabel>isChange</CFormLabel>
            <Switch isDisabled={loading} onChange={(e) => handleSwitchChange(e)} id="liquidationPenalty-change" />
          </Flex>
        </Flex>
        <Input
          ref={refs.liquidationPenalty}
          onChange={(e) => handleInputChange(e, "liquidationPenalty")}
          isDisabled={!actives.includes("liquidationPenalty")}
          type="number"
        />
        <FormHelperText>pre value: {params.liquidationPenalty}</FormHelperText>
      </FormControl>
      <FormControl id="requiredCollateralRatio" mb="20px">
        <Flex justifyContent="space-between" alignItems="center">
          <CFormLabel>Required collateral ratio</CFormLabel>
          <Flex alignItems="center">
            <CFormLabel>isChange</CFormLabel>
            <Switch isDisabled={loading} onChange={(e) => handleSwitchChange(e)} id="requiredCollateralRatio-change" />
          </Flex>
        </Flex>
        <Input
          ref={refs.requiredCollateralRatio}
          onChange={(e) => handleInputChange(e, "requiredCollateralRatio")}
          isDisabled={!actives.includes("requiredCollateralRatio")}
          type="number"
        />
        <FormHelperText>pre value: {params.requiredCollateralRatio}</FormHelperText>
      </FormControl>
      <FormControl id="maximumTotalDebitValue" mb="20px">
        <Flex justifyContent="space-between" alignItems="center">
          <CFormLabel>Maximum total debit value</CFormLabel>
          <Flex alignItems="center">
            <CFormLabel>isChange</CFormLabel>
            <Switch isDisabled={loading} onChange={(e) => handleSwitchChange(e)} id="maximumTotalDebitValue-change" />
          </Flex>
        </Flex>
        <Input
          ref={refs.maximumTotalDebitValue}
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
