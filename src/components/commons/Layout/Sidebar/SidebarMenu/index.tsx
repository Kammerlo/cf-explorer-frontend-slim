import React, { useState, useEffect } from "react";
import { footerMenus, menus } from "../../../../../commons/menus";
import {
  Menu,
  MenuIcon,
  MenuText,
  SubMenu,
  SubMenuText,
  itemStyle,
  StyledCollapse,
  IconMenu,
  WrapNetwork
} from "./styles";
import { Box, Collapse, Divider, Drawer, ListItem, useTheme } from "@mui/material";
import { isExtenalLink } from "../../../../../commons/utils/helper";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import SelectNetwork from "../../Header/SelectNetwork";
import { useWindowSize } from "react-use";
import { setSidebar } from "../../../../../stores/user";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../stores/types";
import FooterMenu from "../FooterMenu";
import CustomTooltip from "../../../CustomTooltip";
import { useScreen } from "../../../../../commons/hooks/useScreen";
import { LogoLink, NavBarLogo } from "../styles";
import { LogoFullIcon } from "../../../../../commons/resources";

const SidebarMenu: React.FC<RouteComponentProps> = ({ history }) => {
  const pathname = history.location.pathname;
  const { isTablet } = useScreen();
  const { sidebar } = useSelector(({ user }: RootState) => user);
  const { width } = useWindowSize(0);
  const theme = useTheme();

  const getActive = () => {
    const active = menus.findIndex((menu) => {
      return menu?.children?.find((r) => {
        return pathname.split("/").length > 2 ? r.href?.includes(pathname.split("/")[1]) : r.href === pathname;
      });
    });

    if (active !== -1) {
      return `menu-${active}`;
    }

    return "";
  };

  const [active, setActive] = useState<string | null>(getActive());
  useEffect(() => {
    if (!sidebar) setActive(null);
  }, [sidebar]);
  useEffect(() => {
    if (pathname === "/") setActive(null);
  }, [pathname]);

  useEffect(() => {
    if (!sidebar && width >= theme.breakpoints.values.md) setSidebar(true);
    else if (sidebar && width < theme.breakpoints.values.md) setSidebar(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width >= theme.breakpoints.values.md]);

  useEffect(() => {
    if (width <= theme.breakpoints.values.md) setSidebar(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleOpen = (item: string) => {
    setActive(item !== active ? item : null);
    if (!sidebar) setSidebar(true);
  };

  const MenuElement = () => {
    return (
      <Menu open={sidebar ? 1 : 0}>
        {menus.map((item, index) => {
          const { href, title, children, icon, tooltip } = item;
          const tooltipTitle = `${!sidebar ? `${title}${title && tooltip ? `: ` : ``}` : ``}${tooltip || ``}`;
          return (
            <React.Fragment key={index}>
              <CustomTooltip key={index} title={tooltipTitle} placement='right'>
                {href ? (
                  isExtenalLink(href) ? (
                    <ListItem
                      button
                      onClick={(e) => window.open(href, "_blank")}
                      sx={(theme) => itemStyle(theme, sidebar)}
                    >
                      {icon ? <MenuIcon src={icon} alt={title} iconOnly={!sidebar ? 1 : 0} /> : null}
                      <MenuText primary={title} open={sidebar ? 1 : 0} />
                    </ListItem>
                  ) : (
                    <ListItem
                      button
                      component={Link}
                      to={href}
                      selected={pathname === href}
                      sx={(theme) => ({
                        ...itemStyle(theme, sidebar),
                        ...(pathname === href ? { backgroundColor: `${theme.palette.success.dark} !important` } : {})
                      })}
                    >
                      {icon ? (
                        <MenuIcon
                          src={icon}
                          alt={title}
                          iconOnly={!sidebar ? 1 : 0}
                          active={pathname === href ? 1 : 0}
                        />
                      ) : null}
                      <MenuText primary={title} open={sidebar ? 1 : 0} active={pathname === href ? 1 : 0} />
                    </ListItem>
                  )
                ) : (
                  <ListItem
                    button
                    onClick={() => children?.length && handleOpen(`menu-${index}`)}
                    sx={(theme) => ({
                      ...itemStyle(theme, sidebar),
                      ...(`menu-${index}` === active
                        ? {
                            backgroundColor: (theme) => `${theme.palette.success.light} !important`,
                            color: (theme) => theme.palette.success.dark
                          }
                        : { color: (theme) => theme.palette.grey[400] })
                    })}
                  >
                    {icon ? (
                      <MenuIcon
                        src={icon}
                        alt={title}
                        iconOnly={!sidebar ? 1 : 0}
                        text={children?.length ? 1 : 0}
                        active={`menu-${index}` === active ? 1 : 0}
                      />
                    ) : null}
                    <MenuText
                      primary={title}
                      open={sidebar ? 1 : 0}
                      active={`menu-${index}` === active ? 1 : 0}
                      text={1}
                      disable={tooltipTitle ? 1 : 0}
                    />

                    {sidebar &&
                      (children?.length ? (
                        <IconMenu component={"span"}>
                          {`menu-${index}` === active ? <BiChevronUp size={18} /> : <BiChevronDown size={18} />}
                        </IconMenu>
                      ) : null)}
                  </ListItem>
                )}
              </CustomTooltip>
              {children?.length ? (
                <Collapse in={`menu-${index}` === active} timeout='auto' unmountOnExit>
                  <SubMenu disablePadding>
                    {children.map((subItem, subIndex) => {
                      const { href, title, icon } = subItem;
                      return href ? (
                        isExtenalLink(href) ? (
                          <ListItem
                            key={subIndex}
                            button
                            onClick={(e) => window.open(href, "_blank")}
                            sx={(theme) => ({
                              ...itemStyle(theme, sidebar),
                              paddingLeft: "70px",
                              [theme.breakpoints.down("md")]: {
                                paddingLeft: "60px"
                              }
                            })}
                          >
                            {icon ? <MenuIcon src={icon} alt={title} iconOnly={!sidebar ? 1 : 0} /> : null}
                            <SubMenuText primary={title} open={sidebar ? 1 : 0} />
                          </ListItem>
                        ) : (
                          <ListItem
                            key={subIndex}
                            button
                            component={Link}
                            to={href}
                            selected={pathname === href}
                            sx={(theme) => ({
                              ...itemStyle(theme, sidebar),
                              ...(pathname === href ||
                              (pathname.split("/").length > 2 && href.includes(pathname.split("/")[1])) ||
                              (href === "/time-line" &&
                                (pathname.includes("delegator-lifecycle") || pathname.includes("spo-lifecycle")))
                                ? { backgroundColor: (theme) => `${theme.palette.success.dark} !important` }
                                : {}),
                              paddingLeft: "70px",
                              [theme.breakpoints.down("md")]: {
                                paddingLeft: "60px"
                              }
                            })}
                          >
                            {icon ? (
                              <MenuIcon
                                src={icon}
                                alt={title}
                                iconOnly={!sidebar ? 1 : 0}
                                active={pathname === href ? 1 : 0}
                              />
                            ) : null}
                            <SubMenuText
                              primary={title}
                              open={sidebar ? 1 : 0}
                              active={
                                pathname === href ||
                                (pathname.split("/").length > 2 && href.includes(pathname.split("/")[1])) ||
                                (href === "/time-line" &&
                                  (pathname.includes("delegator-lifecycle") || pathname.includes("spo-lifecycle")))
                                  ? 1
                                  : 0
                              }
                            />
                          </ListItem>
                        )
                      ) : null;
                    })}
                  </SubMenu>
                </Collapse>
              ) : null}
            </React.Fragment>
          );
        })}
        <Divider
          sx={{
            margin: "10px 0px 10px 30px",
            width: sidebar ? 200 : 25,
            transition: "width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
            [theme.breakpoints.down("md")]: {
              marginLeft: "20px"
            }
          }}
        />
        {footerMenus.map((item, index) => {
          const { href, title, children, icon } = item;
          return (
            <React.Fragment key={index}>
              {href ? (
                isExtenalLink(href) ? (
                  <ListItem
                    button
                    onClick={(e) => window.open(href, "_blank")}
                    sx={(theme) => itemStyle(theme, sidebar)}
                  >
                    {icon ? <MenuIcon src={icon} alt={title} iconOnly={!sidebar ? 1 : 0} /> : null}
                    <MenuText primary={title} open={sidebar ? 1 : 0} />
                  </ListItem>
                ) : (
                  <ListItem
                    button
                    component={Link}
                    to={href}
                    selected={pathname === href}
                    sx={(theme) => ({
                      ...itemStyle(theme, sidebar),
                      ...(pathname === href
                        ? { backgroundColor: (theme) => `${theme.palette.success.dark} !important` }
                        : {})
                    })}
                  >
                    {icon ? (
                      <MenuIcon src={icon} alt={title} iconOnly={!sidebar ? 1 : 0} active={pathname === href ? 1 : 0} />
                    ) : null}
                    <MenuText primary={title} open={sidebar ? 1 : 0} active={pathname === href ? 1 : 0} />
                  </ListItem>
                )
              ) : (
                <ListItem
                  button
                  onClick={() => handleOpen(`footer-${index}`)}
                  sx={(theme) => ({
                    ...itemStyle(theme, sidebar),
                    ...(`footer-${index}` === active
                      ? {
                          backgroundColor: `${theme.palette.success.light} !important`,
                          color: theme.palette.success.dark
                        }
                      : { color: theme.palette.grey[400] })
                  })}
                >
                  {icon ? (
                    <MenuIcon
                      src={icon}
                      alt={title}
                      iconOnly={!sidebar ? 1 : 0}
                      text={children?.length ? 1 : 0}
                      active={`footer-${index}` === active ? 1 : 0}
                    />
                  ) : null}
                  <MenuText
                    primary={title}
                    open={sidebar ? 1 : 0}
                    active={`footer-${index}` === active ? 1 : 0}
                    text={1}
                  />
                  {sidebar &&
                    (children?.length ? (
                      <IconMenu component={"span"}>
                        {`menu-${index}` === active ? <BiChevronUp size={18} /> : <BiChevronDown size={18} />}
                      </IconMenu>
                    ) : null)}
                </ListItem>
              )}
              {children?.length ? (
                <Collapse in={`footer-${index}` === active} timeout='auto' unmountOnExit>
                  <SubMenu disablePadding>
                    {children.map((subItem, subIndex) => {
                      const { href, title, icon } = subItem;
                      return href ? (
                        isExtenalLink(href) ? (
                          <ListItem
                            key={subIndex}
                            button
                            onClick={(e) => window.open(href, "_blank")}
                            sx={(theme) => ({
                              ...itemStyle(theme, sidebar),
                              paddingLeft: "70px",
                              [theme.breakpoints.down("md")]: {
                                paddingLeft: "60px"
                              }
                            })}
                          >
                            {icon ? <MenuIcon src={icon} alt={title} iconOnly={!sidebar ? 1 : 0} /> : null}
                            <SubMenuText primary={title} open={sidebar ? 1 : 0} />
                          </ListItem>
                        ) : (
                          <ListItem
                            key={subIndex}
                            button
                            component={Link}
                            to={href}
                            selected={pathname === href}
                            sx={(theme) => ({
                              ...itemStyle(theme, sidebar),
                              ...(pathname === href
                                ? { backgroundColor: (theme) => `${theme.palette.success.dark} !important` }
                                : {}),
                              paddingLeft: "70px",
                              [theme.breakpoints.down("md")]: {
                                paddingLeft: "60px"
                              }
                            })}
                          >
                            {icon ? (
                              <MenuIcon
                                src={icon}
                                alt={title}
                                iconOnly={!sidebar ? 1 : 0}
                                active={pathname === href ? 1 : 0}
                              />
                            ) : null}
                            <SubMenuText primary={title} open={sidebar ? 1 : 0} active={pathname === href ? 1 : 0} />
                          </ListItem>
                        )
                      ) : null;
                    })}
                  </SubMenu>
                </Collapse>
              ) : null}
            </React.Fragment>
          );
        })}
      </Menu>
    );
  };

  if (isTablet) {
    return (
      <Drawer open={sidebar} onClose={() => setSidebar(false)}>
        <Box position='relative' height='100vh' display={"flex"} flexDirection={"column"}>
          <Box p='16px'>
            <LogoLink to='/'>
              <NavBarLogo src={LogoFullIcon} alt='logo desktop' />
            </LogoLink>
          </Box>
          <MenuElement />
          <WrapNetwork>
            <SelectNetwork />
          </WrapNetwork>
        </Box>
      </Drawer>
    );
  }

  return (
    <>
      <Drawer open={isTablet && sidebar} onClose={() => setSidebar(false)}>
        <Box position='relative' height='100%'>
          <Box p='16px'>
            <LogoLink to='/'>
              <NavBarLogo src={LogoFullIcon} alt='logo desktop' />
            </LogoLink>
          </Box>
          <MenuElement />
          <WrapNetwork>
            <SelectNetwork />
          </WrapNetwork>
        </Box>
      </Drawer>
      {!isTablet && (
        <StyledCollapse in={width >= theme.breakpoints.values.md ? true : sidebar} timeout='auto' unmountOnExit>
          <MenuElement />
          <FooterMenu />
        </StyledCollapse>
      )}
    </>
  );
};

export default withRouter(SidebarMenu);
