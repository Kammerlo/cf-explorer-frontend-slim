import { Box, useTheme } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RouteComponentProps, useLocation, withRouter } from "react-router-dom";

import { useScreen } from "src/commons/hooks/useScreen";
import {
  CardanoBlueDarkmodeLogo,
  CardanoBlueLogo,
  LogoIcon,
  MenuIconComponent,
  SearchIcon
} from "src/commons/resources";
import { lists, routers } from "src/commons/routers";
import { setOnDetailView, setSidebar } from "src/stores/user";
import { setTheme } from "src/stores/theme";

import CustomIcon from "../../CustomIcon";
import TopSearch from "../Sidebar/TopSearch";
import HeaderSearch from "./HeaderSearch";
import {
  ButtonSideBar,
  HeaderBox,
  HeaderContainer,
  HeaderLogo,
  HeaderLogoLink,
  HeaderMain,
  HeaderSearchContainer,
  HeaderTop,
  NetworkContainer,
  SearchButton,
  SideBarRight,
  SwitchMode,
  Title,
  WrapButtonSelect
} from "./styles";

const HIDDEN_HEADER_SEARCH_PATHS: string[] = [lists.dashboard()];

const Header: React.FC<RouteComponentProps> = (props) => {
  const { history } = props;
  const { isMobile } = useScreen();
  const { pathname } = useLocation();

  const home = history.location.pathname === "/";
  const { sidebar } = useSelector(({ user }: RootState) => user);
  const { theme: themeMode } = useSelector(({ theme }: RootState) => theme);
  const [openSearch, setOpenSearch] = React.useState(false);
  const handleToggle = () => setSidebar(!sidebar);
  const theme = useTheme();
  const pathMatched = HIDDEN_HEADER_SEARCH_PATHS.find((subPath: string) => history.location.pathname.includes(subPath));

  const refElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (refElement.current && event.target instanceof Node && refElement.current.contains(event.target)) {
        setOpenSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpenSearch = () => {
    setOpenSearch((prev) => !prev);
    setOnDetailView(false);
  };

  return (
    <HeaderContainer data-testid="header">
      <HeaderBox home={home ? 1 : 0}>
        <HeaderMain home={home ? 1 : 0}>
          <Title home={home ? 1 : 0} data-testid="home-title">
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              flexDirection={isMobile ? "column" : "row"}
            ></Box>
          </Title>
          {pathname !== routers.BOLNISI_LANDING && pathname !== routers.MICAR && (
            <HeaderSearchContainer home={+home}>{!pathMatched && <HeaderSearch home={home} />}</HeaderSearchContainer>
          )}
        </HeaderMain>
        <HeaderTop data-testid="header-top" ref={refElement}>
          <HeaderLogoLink to="/" data-testid="header-logo">
            {!sidebar && <HeaderLogo alt="logo desktop" />}
          </HeaderLogoLink>
          <SideBarRight>
            <WrapButtonSelect>
              <SwitchMode
                data-testid="theme-toggle"
                checked={themeMode === "dark"}
                disableRipple
                onChange={(e) => {
                  setTheme(e.target.checked ? "dark" : "light");
                }}
              />
            </WrapButtonSelect>

            {history.location.pathname !== routers.STAKING_LIFECYCLE && (
              <SearchButton onClick={handleOpenSearch} home={+home}>
                <SearchIcon fontSize={24} stroke={theme.palette.secondary.light} fill={theme.palette.secondary[0]} />
              </SearchButton>
            )}
            <ButtonSideBar onClick={handleToggle}>
              <CustomIcon icon={MenuIconComponent} height={18} fill={theme.palette.secondary.light} />
            </ButtonSideBar>
          </SideBarRight>
        </HeaderTop>
      </HeaderBox>

      <TopSearch open={openSearch} onClose={setOpenSearch} />
    </HeaderContainer>
  );
};

export default withRouter(Header);
