import { Box } from "@chakra-ui/layout";
import { FC, useState } from "react";
import Link from "next/link";
import styled from "@emotion/styled";

const Menu = styled(Box)<{ isChild?: boolean }>`
  padding: ${({ isChild }) => (isChild ? "10px" : "30px")} 0px;
`;

const MenuItem = styled(Box)<{ isChild?: boolean; isactive: boolean }>`
  position: relative;
  width: 100%;
  height: ${({ isChild }) => (isChild ? "40px" : "57.42px;")};
  padding-left: ${({ isChild }) => (isChild ? "45px" : "30px")};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  font-size: 14px;
  font-weight: 500;
  line-height: 17px;
  color: rgb(255, 255, 255) !important;
  cursor: pointer;
  transition: all 0.2s ease-in 0s;
  ${({ isactive }) =>
    isactive
      ? "background: linear-gradient(93.96deg, rgba(255, 76, 59, 0.54) -1.01%, rgba(255, 76, 59, 0) 101.52%);"
      : ""};

  &:hover {
    background: linear-gradient(93.96deg, rgba(255, 76, 59, 0.54) -1.01%, rgba(255, 76, 59, 0) 101.52%);
    > ::before {
      content: '',
      width: 4px;
      height: 100%;
      position: absolute;
      left: 0px;
      background: red;
      opacity: 0;
    }
  }
`;

export const SideBar: FC = () => {
  const menus = [
    {
      name: "cdpEngine",
      children: [
        {
          name: "SetCollateralParams",
          path: "/cdpEngine/SetCollateralParams",
        },
      ],
    },
  ];

  const [active, setAcitve] = useState<string>("");
  const [openMenu, setOpenMenu] = useState<string>("");

  return (
    <Box width="200px" height="100%" color="white">
      <Menu>
        {menus.map(({ name, children }, index) => {
          return (
            <>
              <MenuItem key={`item-${index}`} isactive={name === active} onClick={() => setOpenMenu(name)}>
                {name}
              </MenuItem>
              {children.length &&
                openMenu === name &&
                children.map(({ name: childName, path }, i) => (
                  <MenuItem
                    isChild
                    key={`item-child-${index}-${i}`}
                    isactive={childName === active}
                    onClick={() => setAcitve(childName)}
                  >
                    <Link href={path}>{childName}</Link>
                  </MenuItem>
                ))}
            </>
          );
        })}
      </Menu>
    </Box>
  );
};
