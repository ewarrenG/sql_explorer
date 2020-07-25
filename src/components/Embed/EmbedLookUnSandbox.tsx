import React, { useCallback, useContext, useRef, useState, useEffect } from "react"
import { LookerEmbedSDK, LookerEmbedLook } from '@looker/embed-sdk'
import styled from 'styled-components'
import { LoadingSvg } from "../LookerGCPLoading"
import AppContext from "../../AppContext"

export const EmbedLookUnSandbox = () => {
  const {lid} = useContext(AppContext)
  const [loaded, setLoaded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mutation, setMutation] = useState()

  useEffect(()=>{
    if (lid) {
      setLoading(true)
      if (loaded) {
        setTimeout(()=>{setLoading(false)},4000)
      }
    }
  }, [lid])

  const onLoad = (e) => {
    const frame = document.getElementById('looker-look')
    if (frame) {
      const looker = frame.contentDocument || frame.contentWindow.document;
      const css = `
        #lk-sudo { display: none; }
        #dev-mode-bar { display: none; }
        #lk-nav-main { display: none; }
        #lk-container { top: 0px !important; }
        lk-explore-header { background: transparent; }
        .title-controls > .explore-header-menu { display: none;}
      `
      var head = looker.getElementsByTagName('head')[0];
      var style = looker.createElement('style');

      head.appendChild(style);
      style.type = 'text/css';
      style.appendChild(looker.createTextNode(css))
      setLoading(false)
      setLoaded(true)
    }
  }



  return (
    <>
      <EmbedContainer 
        toggle_loading={loading}
      >
        { lid && <>
          <iframe 
            src={"/looks/" + lid} 
            onLoad={onLoad}
            frameBorder={0}
            id="looker-look"
          /> 
          <LoadingSvg toggle_loading={loading}/>
        </> }
        { !lid && <></>}
      </EmbedContainer>
    </>
  )
}

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