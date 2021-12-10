import { Box } from "@chakra-ui/layout";
import { FC, useState } from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import { useRouter } from "next/dist/client/router";

const CBox = styled.div`
  box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
  width: 200px;
  height: 100%;
  color: gray.800;
  background: white;
`;

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
  line-height: 17px;
  color: gray.800;
  cursor: pointer;
  transition: all 0.2s ease-in 0s;
  ${({ isactive }) =>
    isactive
      ? "background: #e6f7ff;"
      : ""};

  &:hover {
    background: #e6f7ff;
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

  const router = useRouter();

  const [_, _menu, _child] = router.pathname.split("/");

  const [active, setAcitve] = useState<string>(_child);
  const [openMenu, setOpenMenu] = useState<string>(_menu);

  return (
    <CBox>
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
    </CBox>
  );
};
