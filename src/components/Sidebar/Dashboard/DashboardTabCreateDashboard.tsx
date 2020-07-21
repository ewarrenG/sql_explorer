
import React, { useState, useContext } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import AppContext from '../../../AppContext';
import { ROUTES } from '../../../App';
import { useHistory } from 'react-router-dom';
import { CreateDashboardFolderDialog } from './CreateDashboardFolderDialog';

export function DashboardTabCreateDashboard( {turnDialogOff}: any) {
  const [dashboard_title, setDashboardTitle] = useState('')
  const [saving, setSaving] = useState(false)
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const sdk = extensionContext.coreSDK
  const {setAppParams} = useContext(AppContext)
  let history = useHistory()

  const handleDashboardSubmit = async (folder_id: string) => {
    setSaving(true)
    const dashboard = await sdk.ok(sdk.create_dashboard({
      folder_id,
      title: dashboard_title
    }))
    setAppParams({
      selection: ROUTES.EMBED_DASHBOARD,
      did: dashboard.id
    })
    turnDialogOff()
    setSaving(false)
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