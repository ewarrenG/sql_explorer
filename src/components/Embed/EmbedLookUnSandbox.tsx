import React, { useCallback, useContext, useRef, useState, useEffect } from "react"
import { LookerEmbedSDK, LookerEmbedLook } from '@looker/embed-sdk'
import styled from 'styled-components'
import { LoadingSvg } from "../LoadingSvg"
import AppContext from "../../AppContext"

export const EmbedLookUnSandbox = () => {
  const {lid, setLid} = useContext(AppContext)

  const [loading, setLoading] = useState(false)
  const [mutation, setMutation] = useState()

  useEffect(()=>{
    if (lid) {
      setLoading(true)
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
      // const css = `
      //   #lk-sudo { display: none; }
      //   #lk-nav-main { display: none; }  
      //   #lk-container { top: 0px !important; }
      //   .lk-title-controls > .dropdown-toggle { display: none; }
      //   #dev-mode-bar { display: none; }
      //   #lk-title { background: transparent; border-bottom: 0px; }
      //   #lk-title > div { color: transparent; }
      //   #lk-title > div.lk-title-controls.ng-scope > div.dropdown-toggle { display: none; }
      //   #lk-content > div.explore-content-container > div > lk-vis-pane { display: none;  }
      //   #lk-nav { 
      //     background: transparent !important; 
      //     border-right: 0;
      //   }
      // `;
      var head = looker.getElementsByTagName('head')[0];
      var style = looker.createElement('style');

      head.appendChild(style);
      style.type = 'text/css';
      style.appendChild(looker.createTextNode(css))
      setLoading(false)
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