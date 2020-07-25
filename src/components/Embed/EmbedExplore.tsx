import React, { useCallback, useContext, useState, useEffect } from "react"
import { EmbedProps } from "./types"
import { LookerEmbedSDK, LookerEmbedExplore } from '@looker/embed-sdk'
import styled from 'styled-components'
import {
  ExtensionContext,
  ExtensionContextData,
} from "@looker/extension-sdk-react"
import { Button, Heading, MenuItemProps, MenuItem, Dialog, DialogContent, Text, Flex, Space, FlexItem, Grid } from "@looker/components"
import AppContext from "../../AppContext"
import { LoadingSvg } from "../LookerGCPLoading"
import { Link as RouterLink, LinkProps } from 'react-router-dom'
import { omit, compact } from "lodash"
import { ROUTES } from "../../App"

export const EmbedExplore = () => {
  const { sql, qid, toggle, qid_embed_path, selection, setAppParams } = useContext(AppContext)
  const [ explore_qid, setExploreQid] = useState(qid);
  const [ explore_toggle, setExploreToggle] = useState(toggle);

  const [loading, setLoading] = useState(true)
  const [explore, setExplore] = useState<LookerEmbedExplore>()
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)

  useEffect(()=>{
    let obj = {}
    if (explore_qid && explore_qid.length && qid !== explore_qid ) { obj['qid'] = explore_qid }
    if (explore_toggle && explore_toggle.length) { obj['toggle'] = explore_toggle }
    if ( obj !== {}) {
      setAppParams(obj)
    }
    
  }, [explore_qid, explore_toggle])

  const setupExplore = (explore: LookerEmbedExplore) => {
    setExplore(explore);
    const frame = document.getElementsByClassName('looker-explore')[0]
    if (frame) {
      const looker = frame.contentDocument || frame.contentWindow.document;
      const css = `
        lk-explore-header { background: transparent; }
        lk-field-picker { background: transparent; }
        lk-field-row .df-field.selected { background-color: #f6f6f7; }
        lk-space-nav { display: none; }
        lk-title-editor > div > span { display: none; }
      `
      var head = looker.getElementsByTagName('head')[0];
      var style = looker.createElement('style');
      head.appendChild(style);
      style.type = 'text/css';
      style.appendChild(looker.createTextNode(css))
    }
  }

  const handlePageChange = (event) => {
    if (event?.page?.absoluteUrl) {
      const url = new URL(event.page.absoluteUrl)
      const q= url.searchParams.get('qid')
      const t=url.searchParams.get('toggle')
      if (q && q.length) {setExploreQid(q)}
      if (t && t.length) {setExploreToggle(t)}
    }
  }

  const embedCtrRef = useCallback(el => {
    const hostUrl = extensionContext?.extensionSDK?.lookerHostData?.hostUrl
    if (el && hostUrl && qid) {
      setLoading(true)

      let obj: any = {}; 
      if (qid) obj['qid'] = qid
      obj['toggle'] = (toggle) ? toggle : ''
      
      el.innerHTML = ''
      LookerEmbedSDK.init(hostUrl)
      LookerEmbedSDK.createExploreWithId(`sql__${sql}/sql_runner_query`)
        .withClassName('looker-explore')
        .withParams(obj)
        .appendTo(el)
        .on('explore:ready', () => { setLoading(false) })
        .on('page:changed', handlePageChange)
        .build()
        .connect()
        .then(setupExplore)
        .catch((error: Error) => {
          console.error('Connection error', error)
        })
    }
  }, [qid_embed_path])
  
  if (qid) {
    return (
      <>
        <ParentContainer>
          <LoadingSvg toggle_loading={loading} />
          <EmbedContainer
            toggle_loading={loading}
            ref={embedCtrRef}
          ></EmbedContainer>
        </ParentContainer>
      </>
    )
  } else {
    return <>
      {(selection === ROUTES.EMBED_EXPLORE) && <Dialog isOpen={true}>
        <DialogContent>
          <Grid 
            columns={1} 
          >
            <Text>You need to run SQL before you can explore it</Text>
            <StyledRouterLink onClick={()=>{setAppParams({selection: ROUTES.EMBED_SQL})}}>
              <Button>Go to SQL</Button>
            </StyledRouterLink>
          </Grid>
        </DialogContent>
      </Dialog>}
    </>
  }
}

const ParentContainer = styled.div`
width: 100%;
height: 95vh;
`

const EmbedContainer = styled.div`
  width: 100%;
  height: 95vh;
  & > iframe {
    ${props => (props.toggle_loading) ? "display: none;" : ""}
    width: 100%;
    height: 100%;
    frameborder: 0;
  }
  #lk-nav-main { display: none; }  
`

const StyledRouterLinkInner: React.FC<LinkProps & MenuItemProps> = (props) => (
  <RouterLink {...omit(props, 'customizationProps')} />
)

const StyledRouterLink = styled(StyledRouterLinkInner)`
text-decoration: none;
&:focus,
&:hover,
&:visited,
&:link,
& > a { margin: auto }
&:active {
  text-decoration: none;
}
`
