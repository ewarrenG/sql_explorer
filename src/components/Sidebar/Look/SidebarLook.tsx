
import React, { useContext } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import AppContext from '../../../AppContext';
import { SidebarContainer, SidebarHeading, SidebarBox, SidebarButton } from '../SidebarComponents';
import { SidebarGroupLook } from './SidebarGroupLook';
import { exploreEmbedPath } from '../../../helpers';
import { ROUTES } from '../../../App';

export function SidebarLook() {
  const { lid,  toggle, setEditing, look, setQidEmbedPath, setSqlEmbedPath, editing, setAppParams} = useContext(AppContext)
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const { extensionSDK } = extensionContext
  const sdk = extensionContext.coreSDK


  const handleLookEdit = async () => {
    var lk: any
    if (!look) {
      lk = await sdk.ok(sdk.look(lid))
    } else {
      lk = {...look}
    }
    const {query} = lk
    const model = (query.model.id) ? query.model.id : query.model 
    const sql = model.replace('sql__','')

    setEditing({lid})
    
    setAppParams({
      sql,
      qid: query.client_id,
      selection: ROUTES.EMBED_EXPLORE
    })
    setQidEmbedPath(exploreEmbedPath(query.client_id, toggle))
    setSqlEmbedPath("/"+sql)
  }

  return (
    <SidebarContainer>
      <SidebarGroupLook hide_title={true} />
      <SidebarHeading>Actions</SidebarHeading>
      <SidebarBox>
        {lid && <SidebarButton disabled={(editing)} onClick={handleLookEdit}>Edit Look</SidebarButton>}
        <SidebarButton onClick={()=>{extensionSDK.openBrowserWindow(`/looks/${lid}`)}}>Open in Looker</SidebarButton>
      </SidebarBox>
    </SidebarContainer>
  );
}

