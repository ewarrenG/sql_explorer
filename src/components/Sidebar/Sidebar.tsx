import { Box, StyledMenuItemProps, Heading, MenuList, Icon } from '@looker/components'
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
import { StyledMenuItem } from './SidebarComponents'

export const Sidebar: React.FC<any> = ({ selection }) => {
  const {qid, editing, setAppParams} = useContext(AppContext)

  const updateSelection = (route) => {
    setAppParams({selection: route})
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
        <StyledMenuItem
          onClick={()=>{updateSelection(ROUTES.EMBED_SQL)}}
          icon="SqlRunner"
          current={selection === ROUTES.EMBED_SQL}
          selected={selection === ROUTES.EMBED_SQL}
        >
          Write SQL
          </StyledMenuItem>
      {(selection === ROUTES.EMBED_SQL) && <SidebarSql /> }
        <StyledMenuItem key={qid}
          onClick={()=>{updateSelection(ROUTES.EMBED_EXPLORE)}}
          icon="Explore" 
          current={selection === ROUTES.EMBED_EXPLORE}
        >
          Explore SQL
          </StyledMenuItem>
      {(selection === ROUTES.EMBED_EXPLORE) && <SidebarExplore/> }
        <StyledMenuItem 
          onClick={()=>{updateSelection(ROUTES.EMBED_SQL)}}
          icon="Dashboard" current={selection === ROUTES.EMBED_LOOK}>
          View Dashboard
          </StyledMenuItem>
      {(selection === ROUTES.EMBED_DASHBOARD) && <SidebarDashboard /> }
        <StyledMenuItem 
          onClick={()=>{updateSelection(ROUTES.EMBED_LOOK)}}
          icon="Reports" current={selection === ROUTES.EMBED_LOOK}>
          View Look
          </StyledMenuItem>
      {(selection === ROUTES.EMBED_LOOK) && <SidebarLook /> }
      { editing && <SidebarEditing /> }
        <StyledMenuItem 
          onClick={()=>{updateSelection(ROUTES.EMBED_LOOK)}}
          icon="Help" current={selection === ROUTES.HELP}
        >
          Help
        </StyledMenuItem>
    </Box>
  )
}

const StyledRouterLinkInner: React.FC<LinkProps & StyledMenuItemProps> = (props) => (
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
