import React, { useState, useEffect, useContext, useCallback } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import { Code } from '@looker/components';
import styled from 'styled-components'
import { LookerEmbedSDK } from '@looker/embed-sdk';
import AppContext from '../../../AppContext';
import { EmbedContainer } from './LookContainer';

export function LookTable() {
  const { look } = useContext(AppContext)
  const extensionContext = useContext(ExtensionContext)

  const embedCtrRef = useCallback(el => {
    const hostUrl = extensionContext?.extensionSDK?.lookerHostData?.hostUrl
    if (el && hostUrl && look) {    
      el.innerHTML = ''
      LookerEmbedSDK.init(hostUrl)
      const search = {
        qid: look.query.client_id,
        vis: JSON.stringify({type: 'looker_table'}),
        sdk: '2',
        embed_domain: hostUrl,
      }
      const params = Object.keys(search).map(function(k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(search[k])
      }).join('&')
      LookerEmbedSDK.createLookWithUrl(`${hostUrl}/embed/query/${look.query.model}/${look.query.view}?${params}`)
        .appendTo(el)
        .build()
        .connect()
        .then(console.log)
        .catch((error: Error) => {
          console.error('Connection error', error)
        })
    }
  }, [look])

  return (
    <EmbedContainer
      ref={embedCtrRef}
    ></EmbedContainer>
  );
}