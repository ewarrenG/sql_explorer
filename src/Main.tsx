import React, { useState, useEffect, useContext } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import { Code, Box } from '@looker/components';
import styled from 'styled-components'
import { useParams, useHistory, Switch, Route, Redirect } from 'react-router-dom';
import AppContext from './AppContext'
import { getAppSearch, apiCall, newSearchUrl, exploreEmbedPath, createDynamicFields, getFields } from './helpers';
import { EmbedSql } from './components/Embed/EmbedSql';
import { EmbedExplore } from './components/Embed/EmbedExplore';
import { EmbedDashboard } from './components/Embed';
import { IApiSession } from '@looker/sdk/lib/sdk/3.1/models';
import { Sidebar } from './components/Sidebar'
import { ROUTES } from './App';
import { EmbedLookUnSandbox } from './components/Embed/EmbedLookUnSandbox';

export function Main({route}: any) {
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const sdk = extensionContext.coreSDK
  const hostUrl = extensionContext?.extensionSDK?.lookerHostData?.hostUrl
  const history = useHistory();
  const { location } = history;
  const app_search_params = getAppSearch(location.search)
  const [initial, setInitial] = useState(true)
  const [qid, setQid] = useState(app_search_params.qid)
  const [did, setDid] = useState(app_search_params.did)
  const [sql, setSql] = useState(app_search_params.sql)
  const [lid, setLid] = useState(app_search_params.lid)
  const [editing, setEditing] = useState(undefined)
  const [dashboard, setDashboard] = useState()
  const [look, setLook] = useState()
  const [toggle, setToggle] = useState(app_search_params.toggle)

  const [sql_embed_path, setSqlEmbedPath] = useState((app_search_params.sql) ? `/${sql}` : '')
  const [qid_embed_path, setQidEmbedPath] = useState((app_search_params.qid) ? exploreEmbedPath(app_search_params.qid, app_search_params.toggle) : '')
  const [dashboard_refresh, setDashboardRefresh] = useState(0)

  const [sql_options, setSqlOptions] = useState({
    keep_vis: true,
    keep_filters: false,
    keep_fields: true,
    keep_sorts: false,
    keep_dynamic_fields: false
  })
  const [dashboard_options, setDashboardOptions] = useState({})

  const [session, setSession] = useState<IApiSession>()
  const [spaces, setSpaces] = useState()
  const [user, setUser] = useState()


  useEffect(() => {
    getSessions();
    getUser();
  }, [])

  useEffect(()=>{
    if (sql && !initial) {
      getQid();
    }
    setInitial(false)
  }, [sql])

  useEffect(()=>{
    if (qid && !qid_embed_path) {
      setQidEmbedPath(exploreEmbedPath(qid, toggle))
    }
  }, [qid])

  useEffect(()=>{
    if (did) {
      getDashboard();
    }
  }, [did, dashboard_refresh])

  useEffect(()=>{
    if (lid) {
      getLook();
    }
  }, [lid])


  useEffect(()=>{
    history.push(route + newSearchUrl({sql, qid, did, lid, toggle}))
  }, [sql, qid, did, lid, toggle])

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
    setQidEmbedPath(exploreEmbedPath(q.client_id, toggle))
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
    selection: route,
    qid, setQid,
    did, setDid,
    sql, setSql,
    lid, setLid,
    toggle, setToggle,
    search: newSearchUrl({qid,did,sql,lid,toggle}),
    sql_embed_path, setSqlEmbedPath,
    qid_embed_path, setQidEmbedPath,
    dashboard_refresh, setDashboardRefresh,
    triggerDashboardRefresh: ()=>{setDashboardRefresh(dashboard_refresh+1)},
    sql_options, setSqlOptions,
    dashboard_options, setDashboardOptions,
    user, session,
    dashboard, look,
    setDashboard,
    editing, setEditing,
    initial, setInitial
  }
  
  return (
    <AppContext.Provider
      value={context}
    >
      <Layout>
        <Sidebar route={route} />
        <Box >
          <Switch>
            <Route path={"/:selection"}>
              <StyledBox show={(route === ROUTES.EMBED_SQL)}>
                <EmbedSql />
              </StyledBox>
              <StyledBox show={(route === ROUTES.EMBED_EXPLORE)}>
                <EmbedExplore />
              </StyledBox>
              <StyledBox show={(route === ROUTES.EMBED_DASHBOARD)}>
                <EmbedDashboard />
              </StyledBox>
              <StyledBox show={(route === ROUTES.EMBED_LOOK)}>
                <EmbedLookUnSandbox />
              </StyledBox>
              <StyledBox show={(route === ROUTES.HELP)}>
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
  grid-gap: 20px;
  grid-template-columns: 200px auto;
  width: 100vw;
  height: 100vh;
`
