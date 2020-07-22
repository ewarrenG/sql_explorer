import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import React, { useState, useEffect, useContext } from 'react';
import { Box } from '@looker/components';
import styled from 'styled-components'
import { useHistory, Switch, Route, Redirect } from 'react-router-dom';
import AppContext from './AppContext'
import { getAppSearch, apiCall, newSearchUrl, exploreEmbedPath, getFields } from './helpers';
import { EmbedSql } from './components/Embed/EmbedSql';
import { EmbedExplore } from './components/Embed/EmbedExplore';
import { EmbedDashboard } from './components/Embed';
import { IApiSession } from '@looker/sdk/lib/sdk/3.1/models';
import { Sidebar } from './components/Sidebar/Sidebar'
import { ROUTES } from './App';
import { EmbedLookUnSandbox } from './components/Embed/EmbedLookUnSandbox';
import refresh from './MainRefresh';

export function Main() {
  let history = useHistory();
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext);
  const hostUrl = extensionContext?.extensionSDK?.lookerHostData?.hostUrl;
  const sdk = extensionContext.coreSDK;
  
  const { location } = history;
  const pathname = history?.location?.pathname

  const app_search_params = getAppSearch(location.search)
  
  
  const [qid, setQid] = useState(app_search_params.qid)
  const [did, setDid] = useState(app_search_params.did)
  const [sql, setSql] = useState(app_search_params.sql)
  const [lid, setLid] = useState(app_search_params.lid)
  const [selection, setSelection] = useState((pathname && pathname.length >= 2) ? pathname : ROUTES.EMBED_SQL)
  const [last_selection, setLastSelection] = useState("");
  const [toggle, setToggle] = useState(app_search_params.toggle)

  const [editing, setEditing] = useState(undefined)
  const [dashboard, setDashboard] = useState()
  const [look, setLook] = useState()

  const [sql_embed_path, setSqlEmbedPath] = useState((app_search_params.sql) ? `/${sql}` : '')
  
  const [qid_embed_path, setQidEmbedPath] = useState((app_search_params.qid) ? exploreEmbedPath(app_search_params.qid, app_search_params.toggle || '') : '')
  
  const [refresh_did, resetRefreshDid, triggerRefreshDid] = refresh(0)
  const [refresh_qid, resetRefreshQid, triggerRefreshQid] = refresh(0)
  const [refresh_lid, resetRefreshLid, triggerRefreshLid] = refresh(0)
  const [refresh_sql, resetRefreshSql, triggerRefreshSql] = refresh(0)
  const [lid_iframe_reload, resetLidIframeReload, triggerLidIframeReload] = refresh(0)
  const [did_iframe_reload, resetDidIframeReload, triggerDidIframeReload] = refresh(0)

  const [sql_options, setSqlOptions] = useState({
    keep_vis: true,
    keep_filters: false,
    keep_fields: true,
    keep_sorts: false,
    keep_dynamic_fields: false
  })
  const [dashboard_options, setDashboardOptions] = useState({
    dashboard_next: true
  })

  const [session, setSession] = useState<IApiSession>()
  const [user, setUser] = useState()

  useEffect(() => {
    getSessions();
    getUser();
  }, [])

  useEffect(()=>{
      getQid();
  }, [sql])

  useEffect(()=>{
    if (qid && !qid_embed_path) {
      setQidEmbedPath(exploreEmbedPath(qid, toggle || ''))
    }
  }, [qid])

  useEffect(()=>{
    if (did) {
      getDashboard();
    }
  }, [did, refresh_did])

  useEffect(()=>{
    if (lid) {
      getLook();
    }
  }, [lid])

  const resetSidebarNotification = (route: string) => {
    const {EMBED_LOOK, EMBED_SQL, EMBED_DASHBOARD, EMBED_EXPLORE} = ROUTES
    switch (route) {
      case EMBED_SQL:
        resetRefreshSql();
        break;
      case EMBED_DASHBOARD:
        resetRefreshDid();
        break;
      case EMBED_LOOK:
        resetRefreshLid();
        break;
      case EMBED_EXPLORE:
        resetRefreshQid();
        break;
    }
  }

  const setAppParams = (push_object: any) => {
    let c = {...push_object}
    if (c.sql) { setSql(c.sql); triggerRefreshSql(); }
    if (c.qid) { setQid(c.qid); triggerRefreshQid(); }
    if (c.did) { setDid(c.did); triggerRefreshDid(); }
    if (c.lid) { setLid(c.lid); triggerRefreshLid(); }
    if (c.toggle) { setToggle(c.toggle) }
    if (c.selection) { 
      resetSidebarNotification(c.selection)
      setSelection(c.selection); 
      setLastSelection(selection) 
    }
  }

  useEffect(()=>{
    let c = {sql, qid, lid, did, selection, toggle}
    const new_push = selection  + newSearchUrl({sql,did,toggle,lid,qid})
    history.push(new_push)
  },[sql,did,toggle,selection,lid,qid])


  const getQid = async () => {
    const { 
      keep_fields, 
      keep_sorts, 
      keep_filters, 
      keep_vis, 
      keep_dynamic_fields
    } = sql_options
    var current_query;

    // get explore definition
    let explore = apiCall('GET',`${hostUrl}/api/internal/dataflux/explores/sql__${sql}::sql_runner_query`, '', undefined)
    
    // get new query slug from sql
    let new_query_from_sql = sdk.ok(sdk.create_query({
      model: `sql__${sql}`,
      view: 'sql_runner_query'
    }))
    if (qid) {
      // get current qid to layer on old configs
      current_query = sdk.ok(sdk.query_for_slug(qid))
    } else {
      current_query = new_query_from_sql
    }

    const [e, {id, client_id, slug, ...n}, c] = await Promise.all([explore, new_query_from_sql, current_query])
    // new query body to create
    let nqb = {...n}
    

    let {selected, dynamic_fields} = getFields(e)
    if (keep_fields) { 
      nqb['fields'] = (c.fields && c.fields.length) ? c.fields : selected;
      nqb['pivots'] = c.pivots;
    } else {
      nqb['fields'] = selected
    }
    if (keep_sorts) { nqb['sorts'] = c.sorts }
    if (keep_filters) { nqb['filters'] = c.filters }
    if (keep_vis) { nqb['vis_config'] = c.vis_config }
    if (keep_dynamic_fields) {
      nqb['dynamic_fields'] = c.dynamic_fields || ""
    } else {
      nqb['dynamic_fields'] = JSON.stringify(dynamic_fields || [])
    }
    
    const q = await sdk.ok(sdk.create_query(nqb,'client_id'))
    setQid(q.client_id)
    setQidEmbedPath(exploreEmbedPath(q.client_id!, toggle || ''))
  }

  const getLook = async () => {
    const l = await sdk.ok(sdk.look(Number(lid)))
    setLook(l)
  }

  const getDashboard = async () => {
    const db = await sdk.ok(sdk.dashboard(did))
    setDashboard(db)
  }

  const getSessions = async () => {
    const s = await sdk.ok(sdk.session())
    setSession(s)
  }

  const getUser = async () => {
    const me = await sdk.ok(sdk.me())
    setUser(me)
  }

  const context = {
    selection, 
    sql, qid, did, lid, toggle,
    setAppParams,
    sql_embed_path, setSqlEmbedPath,
    qid_embed_path, setQidEmbedPath,
    refresh_lid, triggerRefreshLid,
    did_iframe_reload, triggerDidIframeReload,
    triggerRefreshDid,
    triggerLidIframeReload,
    sql_options, setSqlOptions,
    dashboard_options, setDashboardOptions,
    user, session,
    dashboard, look,

    setDashboard,
    editing, setEditing,
  }
  
  return (
    <AppContext.Provider
      value={context}
    >
      <Layout>
        <Sidebar {...{selection, last_selection, refresh_qid, refresh_did, refresh_sql, refresh_lid, resetSidebarNotification}} />
        <Box >
          <Switch>
            <Route path={"/:selection"}>
              <StyledBox show={(selection === ROUTES.EMBED_SQL)}>
                <EmbedSql />
              </StyledBox>
              <StyledBox show={(selection === ROUTES.EMBED_EXPLORE)}>
                <EmbedExplore />
              </StyledBox>
              <StyledBox show={(selection === ROUTES.EMBED_DASHBOARD)}>
                <EmbedDashboard />
              </StyledBox>
              <StyledBox show={(selection === ROUTES.EMBED_LOOK)}>
                <EmbedLookUnSandbox 
                  key={`/lid::${lid_iframe_reload}`}
                />
              </StyledBox>
              <StyledBox show={(selection === ROUTES.HELP)}>
                <>Help!</>
              </StyledBox>
            </Route>
            <Redirect to="/sql" />
          </Switch>
        </Box>
      </Layout>
    </AppContext.Provider>
  );
}

const StyledBox = styled(Box)`
  ${props => props.show ? "" : "display:none;"}
`

const Layout = styled(Box)`
  display: grid;
  grid-template-columns: 200px auto;
  width: 100vw;
  height: 100vh;
`
