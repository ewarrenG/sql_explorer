
import React, { useContext } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import AppContext from '../../../AppContext';
import { SidebarContainer, SidebarHeading, SidebarBox, SidebarButton, SidebarCheckbox } from '../SidebarComponents';
import { SidebarGroupDashboard } from './SidebarGroupDashboard';
import { SidebarDashboardElementEdit } from './SidebarDashboardElementEdit';

export function SidebarDashboard() {
  const {dashboard_options, setDashboardOptions, did, setDashboard} = useContext(AppContext)
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const sdk = extensionContext.core40SDK
  const { extensionSDK } = extensionContext
  const { dashboard } = useContext(AppContext)

  const handleCheck = (id) => {
    setDashboardOptions({...dashboard_options, [id]: !dashboard_options[id]})
  }

  const newCheckbox = (id, label) => {
    return  <SidebarCheckbox 
      label={label}
      checked={dashboard_options[id]}
      onChange={()=>{handleCheck(id)}}
    />
  }

  const next = (dashboard_options['dashboard_next']) ? '-next' : ''

  const newDashboard = async () => {
    const new_look = await sdk.ok(sdk.dashboard(dashboard.id))
    setDashboard(new_look)
  }

  const favoriteDb = async () => {
    await sdk.ok(sdk.create_content_favorite({
      content_metadata_id: dashboard.content_metadata_id
    }))
    newDashboard();
  }

  const removeFavoriteDb = async () => {
    await sdk.ok(sdk.delete_content_favorite(dashboard.content_favorite_id));
    newDashboard();
  }
  
  return (
    <SidebarContainer>
      <SidebarGroupDashboard hide_title={true}/>
      <SidebarHeading>Options</SidebarHeading>
      <SidebarBox>
        {newCheckbox('dashboard_next', 'Dashboard Next')}
      </SidebarBox>
      {did && <>
        <SidebarHeading>Actions</SidebarHeading>
        <SidebarBox>
          {dashboard && <SidebarDashboardElementEdit /> }
          {did && !(dashboard?.content_favorite_id) && <SidebarButton onClick={favoriteDb}>Favorite Dashboard</SidebarButton>}
          {did && dashboard?.content_favorite_id && <SidebarButton onClick={removeFavoriteDb}>Remove Favorite</SidebarButton>}
          <SidebarButton onClick={()=>{extensionSDK.openBrowserWindow(`/dashboards${next}/${did}`)}}>Open in Looker</SidebarButton>
        </SidebarBox>
      </>}
    </SidebarContainer>
  );
}

