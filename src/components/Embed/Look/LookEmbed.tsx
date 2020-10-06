import React, { useState, useEffect, useContext, useCallback } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import { LookerEmbedSDK } from '@looker/embed-sdk';
import AppContext from '../../../AppContext';
import { EmbedContainer } from './LookContainer';

export function LookEmbed() {
  const { look, lid } = useContext(AppContext)
  const extensionContext = useContext(ExtensionContext)

  const embedCtrRef = useCallback(el => {
    const hostUrl = extensionContext?.extensionSDK?.lookerHostData?.hostUrl
    if (el && hostUrl && look) {    
      el.innerHTML = ''
      LookerEmbedSDK.init(hostUrl)
      LookerEmbedSDK.createLookWithId(look.id)
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
