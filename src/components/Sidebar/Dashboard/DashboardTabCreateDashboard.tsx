
import React, { useState, useContext } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import AppContext from '../../../AppContext';
import { ROUTES } from '../../../App';
import { CreateDashboardFolderDialog } from './CreateDashboardFolderDialog';

export function DashboardTabCreateDashboard( {turnDialogOff, is_saving}: any) {
  const [dashboard_title, setDashboardTitle] = useState('')
  const [saving, setSaving] = useState(false)
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const sdk = extensionContext.coreSDK
  const {setAppParams, runRefreshes} = useContext(AppContext)
  

  const handleDashboardSubmit = async (folder_id: string) => {
    setSaving(true)
    const dashboard = await sdk.ok(sdk.create_dashboard({
      folder_id,
      title: dashboard_title
    }))
    
    let params: any = { did: dashboard.id }

    if (!is_saving) { params['selection'] = ROUTES.EMBED_DASHBOARD}
    
    setAppParams(params)
    turnDialogOff()
    setSaving(false)
    runRefreshes();
  }

  return (
    <CreateDashboardFolderDialog {...{
      dashboard_title,
      setDashboardTitle,
      saving,
      handleDashboardSubmit
    }}/>
  );
}