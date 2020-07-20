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
import { LoadingSvg } from "../LoadingSvg"
import { Link as RouterLink, LinkProps } from 'react-router-dom'
import { omit } from "lodash"
import { ROUTES } from "../../App"

export const EmbedExplore = () => {
  const { sql, qid, toggle, setQid, setToggle, qid_embed_path, search, selection } = useContext(AppContext)

  const [loading, setLoading] = useState(true)
  const [explore, setExplore] = useState<LookerEmbedExplore>()
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)

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
      setQid(url.searchParams.get('qid'))
      setToggle(url.searchParams.get('toggle'))
    }
  }

  const embedCtrRef = useCallback(el => {
    const hostUrl = extensionContext?.extensionSDK?.lookerHostData?.hostUrl
    if (el && hostUrl && qid) {
      setLoading(true)
      el.innerHTML = ''
      LookerEmbedSDK.init(hostUrl)
      LookerEmbedSDK.createExploreWithId(`sql__${sql}/sql_runner_query`)
        .withClassName('looker-explore')
        .withParams({ qid, toggle })
        .appendTo(el)
        .on('explore:ready', () => { setLoading(false) })
        .on('explore:run:start', console.log)
        .on('explore:run:complete', console.log)
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

            <StyledRouterLink to={`/sql${search}`}>
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
