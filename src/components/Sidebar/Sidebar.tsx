import { Box, MenuGroup, MenuItem, MenuItemProps, Heading, MenuList, Icon } from '@looker/components'
import  React, { useContext } from 'react'
import { Link as RouterLink, LinkProps } from 'react-router-dom'
import styled from 'styled-components'
import omit from 'lodash/omit'
import { ROUTES } from '../../App'
import AppContext from '../../AppContext'
import { SidebarSql } from './SidebarSql'
import { SidebarExplore } from './SidebarExplore'
import { SidebarDashboard } from './Dashboard/SidebarDashboard'
import { SidebarLook } from './Look/SidebarLook'
import { SidebarEditing } from './SidebarEditing'

export const Sidebar: React.FC<any> = ({ route }) => {
  const {search, editing} = useContext(AppContext)


  const getToRoute = (path: string) => {
    return path + search
  }
  
  return (
    <Box 
      display="flex" 
      flexDirection="column"
      pt="large"
    >
      <Heading 
        pl="small"
        mb="small"
        fontSize="xlarge"
      >SQL Explorer</Heading>

      { editing && <SidebarEditing /> }
      <StyledRouterLink to={getToRoute(ROUTES.EMBED_SQL)}>
        <MenuItem
          icon="SqlRunner"
          current={route === ROUTES.EMBED_SQL}
          selected={route === ROUTES.EMBED_SQL}
        >
          Write SQL
          </MenuItem>
      </StyledRouterLink>
      {(route === ROUTES.EMBED_SQL) && <SidebarSql /> }
      <StyledRouterLink to={getToRoute(ROUTES.EMBED_EXPLORE)}>
        <MenuItem icon="Explore" current={route === ROUTES.EMBED_EXPLORE}>
          Explore SQL
          </MenuItem>
      </StyledRouterLink>
      {(route === ROUTES.EMBED_EXPLORE) && <SidebarExplore/> }
      <StyledRouterLink to={getToRoute(ROUTES.EMBED_DASHBOARD)}>
        <MenuItem icon="Dashboard" current={route === ROUTES.EMBED_DASHBOARD}>
          View Dashboard
          </MenuItem>
      </StyledRouterLink>
      {(route === ROUTES.EMBED_DASHBOARD) && <SidebarDashboard /> }
      <StyledRouterLink to={getToRoute(ROUTES.EMBED_LOOK)}>
        <MenuItem icon="Reports" current={route === ROUTES.EMBED_LOOK}>
          View Look
          </MenuItem>
      </StyledRouterLink>
      {(route === ROUTES.EMBED_LOOK) && <SidebarLook /> }
      <StyledRouterLink to={getToRoute(ROUTES.EMBED_LOOK)}>
        <MenuItem icon="Help" current={route === ROUTES.EMBED_LOOK}>
          Help
        </MenuItem>
      </StyledRouterLink>
    </Box>
  )
}

const StyledRouterLinkInner: React.FC<LinkProps & MenuItemProps> = (props) => (
  <RouterLink {...omit(props, 'customizationProps')} />
)

const StyledRouterLink = styled(StyledRouterLinkInner)`
  text-decoration: none;
  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
  }
`
