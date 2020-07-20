
import React, { useContext } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import AppContext from '../../AppContext';
import { SidebarContainer, SidebarHeading, SidebarBox, SidebarButton, SidebarText, SidebarCheckbox } from './SidebarComponents';
import { SidebarGroupLook } from './SidebarGroupLook';
import { exploreEmbedPath, newSearchUrl } from '../../helpers';
import { useHistory } from 'react-router-dom';
import { ROUTES } from '../../App';

export function SidebarLook() {
  const { lid,  toggle, setEditing, look, setQid, setQidEmbedPath, setSql, setSqlEmbedPath, editing, setInitial, } = useContext(AppContext)
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const { extensionSDK } = extensionContext
  const sdk = extensionContext.coreSDK
  let history = useHistory();

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

    // TODO SWITCH TO EXPLORE ON EDIT
    // history.push(ROUTES.EMBED_EXPLORE + newSearchUrl({sql, qid: query.client_id, did, lid, toggle}))

    setEditing({lid})
    setInitial(true)
    setSql(sql)
    setQid(query.client_id)
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

