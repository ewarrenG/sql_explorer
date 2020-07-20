import React, { useContext } from 'react';
import { SidebarHeading, SidebarText, SidebarBox } from './SidebarComponents';
import { SelectDashboardDialog } from './SelectDashboardDialog';
import AppContext from '../../AppContext';

export function SidebarGroupDashboard(props) {
  const { hide_title } = props
  const {dashboard} = useContext(AppContext)
  return (
    <>
    <SidebarHeading>Dashboard</SidebarHeading>
    <SidebarBox>
      {dashboard && !hide_title && <SidebarText>{dashboard.title}</SidebarText> }
      <SelectDashboardDialog />
    </SidebarBox>
    </>
  );
}
