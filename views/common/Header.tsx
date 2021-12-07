import { Flex } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/react";
import { FC } from "react";
import { useAddress } from "../../hook/useAccount";

export const Header: FC = () => {
  const { addresses, activeAddress, changeActive } = useAddress();

  return (
    <Flex
      height="59px"
      justifyContent="flex-end"
      alignItems="center"
      padding="0px 30px"
      borderBottom="1px solid var(--chakra-colors-gray-500)"
    >
      <Select width="400px" onChange={(e) => changeActive(e.target.value)}>
        {addresses?.map((address) => (
          <option key={address.address} value={address.address}>
            {address.name} ({address.address})
          </option>
        ))}
      </Select>
    </Flex>
  );
};
