
import React, { useCallback, useContext } from "react"
import { EmbedProps } from "./types"
import { LookerEmbedSDK, LookerEmbedDashboard } from '@looker/embed-sdk'
import {
  ExtensionContext,
  ExtensionContextData,
} from "@looker/extension-sdk-react"
import styled from 'styled-components'
import AppContext from "../../AppContext"
import { LoadingSvg } from "../LoadingSvg"

export const EmbedDashboard: React.FC<EmbedProps> = () => {
  const [dashboardNext, setDashboardNext] = React.useState(true)
  const [loading, setLoading] = React.useState(true)
  const [dashboard, setDashboard] = React.useState<LookerEmbedDashboard>()
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const { did, dashboard_options, did_iframe_reload } = useContext(AppContext)
  const { dashboard_next } = dashboard_options

  const setupDashboard = (dashboard: LookerEmbedDashboard) => {
    setDashboard(dashboard)
  }

  const embedCtrRef = useCallback(el => {
    const hostUrl = extensionContext?.extensionSDK?.lookerHostData?.hostUrl
    if (el && hostUrl && did) {
      setLoading(true)
      el.innerHTML = ''
      LookerEmbedSDK.init(hostUrl)
      const db = LookerEmbedSDK.createDashboardWithId(did)
      if (dashboard_next) {
        db.withNext()
      }
      db.appendTo(el)
        .on('dashboard:loaded', setLoading(false))
        .build()
        .connect()
        .then(setupDashboard)
        .catch((error: Error) => {
          console.error('Connection error', error)
        })
    }
  }, [did, dashboard_next, did_iframe_reload])

  if (did) {
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
    return <></>
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
    ${props=>(props.toggle_loading) ? "display: none;" : ""}
    width: 100%;
    height: 100%;
    frameborder: 0;
  }
  #lk-nav-main { display: none; }  
`