import { Box, Flex } from "@chakra-ui/layout";
import React, { FC } from "react";
import { Header } from "./Header";
import { SideBar } from "./SideBar";


export const Page: FC = ({ children }) => {
  return (
    <Box width="100%" height="100vh">
      <Header>header</Header>
      <Flex height='inhert'>
        <SideBar />
        <Box flex="1" maxHeight="calc(100vh - 60px)" overflow="scroll" padding="20px" boxSizing="border-box">
          {children}
        </Box>
      </Flex>
    </Box>
  );
};
