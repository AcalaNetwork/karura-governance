import { Box, Flex } from "@chakra-ui/layout";
import React from "react";

export default function HomePage() {
  return (
    <Flex justifyContent="center" alignItems="center" height="calc(100vh - 100px)">
      <Box fontSize='20px'>Click left menu to submit your proposal.</Box>
    </Flex>
  );
}
