import { Flex } from "@chakra-ui/layout";
import { FC } from "react";

export const Header: FC = ({ children }) => {
  return (
    <Flex height="59px" justifyContent="flex-end" alignItems="center" padding="0px 30px" borderBottom='1px solid var(--chakra-colors-gray-500)'>
      {children}
    </Flex>
  );
};
