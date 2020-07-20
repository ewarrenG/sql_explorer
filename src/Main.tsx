import React, { useState, useEffect, useContext } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import { Code, Box } from '@looker/components';
import styled from 'styled-components'
import { useParams, useHistory, Switch, Route, Redirect } from 'react-router-dom';
import AppContext from './AppContext'
import { getAppSearch, appSearchPick, newSearchUrl, exploreEmbedPath } from './helpers';
import { EmbedSql } from './components/Embed/EmbedSql';
import { EmbedExplore } from './components/Embed/EmbedExplore';
import { EmbedDashboard } from './components/Embed';
import { IApiSession } from '@looker/sdk/lib/sdk/3.1/models';
import { Sidebar } from './components/Sidebar'
import { ROUTES } from './App';
import { EmbedLookUnSandbox } from './components/Embed/EmbedLookUnSandbox';

export function Main({route}) {
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const sdk = extensionContext.coreSDK
  const { selection } = useParams();
  const history = useHistory();
  const { location } = history;
  const app_search_params = getAppSearch(location.search)


  const [qid, setQid] = useState(app_search_params.qid)
  const [did, setDid] = useState(app_search_params.did)
  const [sql, setSql] = useState(app_search_params.sql)
  const [lid, setLid] = useState(app_search_params.lid)
  const [dashboard, setDashboard] = useState()
  const [look, setLook] = useState()
  const [toggle, setToggle] = useState(app_search_params.toggle)

  const [sql_embed_path, setSqlEmbedPath] = useState((app_search_params.sql) ? `/${sql}` : '')
  const [qid_embed_path, setQidEmbedPath] = useState((app_search_params.qid) ? exploreEmbedPath(app_search_params.qid, app_search_params.toggle) : '')
  const [dashboard_refresh, setDashboardRefresh] = useState(0)

  const [sql_options, setSqlOptions] = useState({
    keep_vis: true,
    keep_filters: true,
    keep_fields: true
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
    if (sql) {
      getQid();
    }
  }, [sql])

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
    const q = await sdk.ok(sdk.create_query({
      model: `sql__${sql}`,
      view: 'sql_runner_query'
    }))
    setQid(q.client_id)
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
    user, session,
    search: newSearchUrl({qid,did,sql,lid,toggle}),
    sql_embed_path, setSqlEmbedPath,
    qid_embed_path, setQidEmbedPath,
    dashboard_refresh, setDashboardRefresh,
    sql_options, setSqlOptions,
    dashboard_options, setDashboardOptions,
    dashboard, look
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
