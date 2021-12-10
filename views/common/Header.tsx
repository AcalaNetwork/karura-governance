import { Flex } from "@chakra-ui/layout";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import React, { FC } from "react";
import { useAddress } from "../../hook/useAccount";
import { ChevronDownIcon } from "@chakra-ui/icons";

export const Header: FC = () => {
  const { addresses, activeAddress, changeActive } = useAddress();

  return (
    <Flex
      height="60px"
      justifyContent="flex-end"
      alignItems="center"
      padding="0px 30px"
      borderBottom="1px solid var(--chakra-colors-gray-500)"
    >
      <Menu colorScheme='gray'>
        <MenuButton
          as={Button}
          variant="outline"
          color="white"
          _hover={{ bg: "transparent" }}
          _active={{ bg: "transparent" }}
        >
          <Flex alignItems="center" justifyContent="space-between">
            <div>{activeAddress || 'Connecting ...'}</div>
            <ChevronDownIcon />
          </Flex>
        </MenuButton>
        <MenuList bg="gray.800" borderColor="gray.600">
          {addresses?.map((address) => (
            <MenuItem
              _focus={{bg: "transparent"}}
              _hover={{ bg: "gray.600" }}
              key={address.address}
              value={address.address}
              onClick={() => changeActive(address.address)}
            >
              {address.name} ({address.address})
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Flex>
  );
};
