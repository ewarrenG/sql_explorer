import React, { useCallback, useContext, useRef, useState, useEffect } from "react"
import { LookerEmbedSDK, LookerEmbedLook } from '@looker/embed-sdk'
import styled from 'styled-components'
import { LoadingSvg } from "../LoadingSvg"
import AppContext from "../../AppContext"

export const EmbedSql = () => {
  const {sql, setAppParams, sql_embed_path} = useContext(AppContext)

  const [loading, setLoading] = useState(true)
  const [mutation, setMutation] = useState()

  
  const checkExist = (content) => {
    // find the Explore Node When it exists after loaded
    const checkInterval = setInterval(() => {
      const CheckSelector = content.querySelectorAll("#lk-layout-ng > ul.dropdown-menu.dropdown-wide.pull-right-important")
      if (CheckSelector.length) {
         clearInterval(checkInterval);
         let PossibleNodes = content.querySelectorAll("#lk-layout-ng > ul.dropdown-menu.dropdown-wide.pull-right-important > li");
         var SlugNode = <></>
         for (var i=0; i<PossibleNodes.length; i++) {
           if (PossibleNodes[i].childNodes[0] != null && PossibleNodes[i].childNodes[0].innerHTML == 'Explore') {
            SlugNode = PossibleNodes[i].childNodes[0]
             watchHref(SlugNode)
           }
         }
      }
    }, 100); 
  } 

  const watchHref = (slug) => {
    // Take the explore node and listen to its changes.
    // Update the sql context when it does change

    if (mutation) {
      mutation.disconnect();
    }

    let new_mutation = new MutationObserver(mutations => {
      mutations.some(mut => {
        if (mut.type === 'attributes' && mut.attributeName === 'href' && mut.target.href) {
          if (mut.target.href) {
            if(mut.target.href.split('/explore/sql__')[1].split('/')[0] !== sql) {
              setAppParams({
                sql: mut.target.href.split('/explore/sql__')[1].split('/')[0]
              })
            }
          }
          return true;
        }
        return false;
      });
    })

    new_mutation.observe(slug, {
      attributes: true,
      attributeFilter: ['href'],
      attributeOldValue: true,
      characterData: false,
      characterDataOldValue: false,
      childList: false,
      subtree: true
    });

    setMutation(new_mutation)
  }

  const onLoad = (e) => {
    const frame = document.getElementById('looker-sql')
    if (frame) {
      const looker = frame.contentDocument || frame.contentWindow.document;
      const css = `
        #lk-sudo { display: none; }
        #lk-nav-main { display: none; }  
        #lk-container { top: 0px !important; }
        .lk-title-controls > .dropdown-toggle { display: none; }
        #dev-mode-bar { display: none; }
        #lk-title { background: transparent; border-bottom: 0px; }
        #lk-title > div { color: transparent; }
        #lk-title > div.lk-title-controls.ng-scope > div.dropdown-toggle { display: none; }
        #lk-content > div.explore-content-container > div > lk-vis-pane { display: none;  }
        #lk-nav { 
          background: transparent !important; 
          border-right: 0;
        }
      `;
      var head = looker.getElementsByTagName('head')[0];
      var style = looker.createElement('style');
      checkExist(looker)
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
        <iframe 
          src={"/sql" + sql_embed_path} 
          onLoad={onLoad}
          frameBorder={0}
          id="looker-sql"
        />
        <LoadingSvg toggle_loading={loading}/>
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