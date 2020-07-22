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
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react'
import { ExtensionHostApi } from '@looker/extension-sdk'

export const Sidebar: React.FC<any> = ({ selection, last_selection, refresh_qid, refresh_did, refresh_sql, refresh_lid, resetSidebarNotification }) => {
  const {editing, setAppParams} = useContext(AppContext)
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const extensionHost = extensionContext.extensionSDK as ExtensionHostApi

  const updateSelection = (route) => {
    resetSidebarNotification(route)
    extensionHost.track('click','sql-runner-tracked', {selection: route, editing})
    setAppParams({selection: route})
  }

  const SidebarMenuItem: any = ({children, refresh, route, ...props}: any) => {
    return <StyledMenuItem
      {...props}
      key={`${route}::${refresh}`}
      re={`${route}::${refresh}`}
      onClick={()=>{updateSelection(route)}}
      current={selection === route}
      is_last_selection={(last_selection===route)}
    >
      {children}
    </StyledMenuItem>
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
        <SidebarMenuItem
          route={ROUTES.EMBED_SQL}
          refresh={refresh_sql}
          icon="SqlRunner"
        >
          Write SQL
          </SidebarMenuItem>
      {(selection === ROUTES.EMBED_SQL) && <SidebarSql /> }
        <SidebarMenuItem
            route={ROUTES.EMBED_EXPLORE}
            refresh={refresh_qid}
            icon="Explore"
          >
            Explore SQL
          </SidebarMenuItem>
      {(selection === ROUTES.EMBED_EXPLORE) && <SidebarExplore/> }
      <SidebarMenuItem
            route={ROUTES.EMBED_DASHBOARD}
            refresh={refresh_did}
            icon="Dashboard"
          >
            View Dashboard
          </SidebarMenuItem>
      {(selection === ROUTES.EMBED_DASHBOARD) && <SidebarDashboard /> }
      <SidebarMenuItem
            route={ROUTES.EMBED_LOOK}
            refresh={refresh_lid}
            icon="Reports"
          >
            View Look
          </SidebarMenuItem>
      {(selection === ROUTES.EMBED_LOOK) && <SidebarLook /> }
      { editing && <SidebarEditing /> }
      <SidebarMenuItem
            route={ROUTES.HELP}
            refresh={0}
            icon="Help"
          >
            Help
          </SidebarMenuItem>
    </Box>
  )
}



const StyledRouterLinkInner: React.FC<LinkProps & StyledMenuItemProps> = (props) => (
  <RouterLink {...omit(props, 'customizationProps')} />
)
