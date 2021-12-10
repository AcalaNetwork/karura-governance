import { Box, Flex } from "@chakra-ui/layout";
import React, { FC } from "react";
import { Header } from "./Header";
import { SideBar } from "./SideBar";

export const Page: FC = ({ children }) => {
  return (
    <Box width="100%" height="100vh" overflow="hidden">
      <Header></Header>
      <Flex height="calc(100% - 60px)">
        <SideBar />
        <Box flex="1" maxHeight="calc(100vh - 60px)" overflowY='auto' overflowX='hidden' padding="20px" boxSizing="border-box">
          {children}
        </Box>
      </Flex>
    </Box>
  );
};
