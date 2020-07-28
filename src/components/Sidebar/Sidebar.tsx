import { Box, Heading } from '@looker/components'
import React, { useContext, useEffect, useState } from 'react'
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

export const Sidebar: React.FC<any> = ({ selection, refresh_qid, refresh_did, refresh_sql, refresh_lid, resetSidebarNotification }) => {
  const { editing, setAppParams } = useContext(AppContext)
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const extensionHost = extensionContext.extensionSDK as ExtensionHostApi

  const updateSelection = (route) => {
    resetSidebarNotification(route)
    extensionHost.track('click', 'sql-runner-tracked', { selection: route, editing })
    setAppParams({ selection: route })
  }

  const SidebarMenuItem: any = ({ children, refresh, route, ...props }: any) => {
    const [start, setStart] = useState(false)

    useEffect(() => {
      if (refresh > 0) {
        setStart(true)
      }
    }, [refresh])

    useEffect(() => {
      if (start) {
        const timer = setTimeout(() => {
          resetSidebarNotification(route)
          setStart(false)
        }, 6000);
        return () => clearTimeout(timer);
      }
    }, [start])

    return <StyledMenuItem
      {...props}
      key={`${route}::${refresh}`}
      animate={(start) ? true : false}
      onClick={() => { updateSelection(route) }}
      current={selection === route}
    >
      {children}
    </StyledMenuItem>
  }

  const SidebarItem = ({label, refresh, route, tour, icon, SubMenu}) => {
    return <Box
      className={tour || ''}
    >
        <SidebarMenuItem
          {...{route,refresh, icon}}
        >
          {label}
        </SidebarMenuItem>
        {(selection === route) && <SubMenu />}
    </Box>
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
      <SidebarItem
        label="Write SQL"
        refresh={refresh_sql}
        route={ROUTES.EMBED_SQL}
        tour="tour-step-01"
        icon="SqlRunner"
        SubMenu={SidebarSql}
      />
      <SidebarItem
        label="Explore SQL"
        refresh={refresh_qid}
        route={ROUTES.EMBED_EXPLORE}
        tour="tour-step-02"
        icon="Explore"
        SubMenu={SidebarExplore}
      />
      <SidebarItem
        label="View Dashboard"
        refresh={refresh_did}
        route={ROUTES.EMBED_DASHBOARD}
        tour="tour-step-03"
        icon="Dashboard"
        SubMenu={SidebarDashboard}
      />
      <SidebarItem
        label="View Look"
        refresh={refresh_lid}
        route={ROUTES.EMBED_LOOK}
        tour="tour-step-04"
        icon="Reports"
        SubMenu={SidebarLook}
      />
      {/* <Box className="tour-step-01">
        <SidebarMenuItem
          route={ROUTES.EMBED_SQL}
          refresh={refresh_sql}
          icon="SqlRunner"
        >
          Write SQL
            </SidebarMenuItem>
        {(selection === ROUTES.EMBED_SQL) && <SidebarSql />}
      </Box> */}
      {/* <Box className="tour-step-01">
        <SidebarMenuItem
          route={ROUTES.EMBED_EXPLORE}
          refresh={refresh_qid}
          icon="Explore"
          className="tour-step-02"
        >
          Explore SQL
          </SidebarMenuItem>
        {(selection === ROUTES.EMBED_EXPLORE) && <SidebarExplore />}
      </Box> */}

      {/* <SidebarMenuItem
        route={ROUTES.EMBED_DASHBOARD}
        refresh={refresh_did}
        icon="Dashboard"
        className="tour-step-03"
      >
        View Dashboard
          </SidebarMenuItem>
      {(selection === ROUTES.EMBED_DASHBOARD) && <SidebarDashboard />} */}
      {/* <SidebarMenuItem
        route={ROUTES.EMBED_LOOK}
        refresh={refresh_lid}
        icon="Reports"
      >
        View Look
          </SidebarMenuItem>
      {(selection === ROUTES.EMBED_LOOK) && <SidebarLook />} */}

      <Box className="tour-step-05">
        {editing && <SidebarEditing />}
      </Box>
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