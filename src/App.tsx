import React, { useState } from 'react'
import { ComponentsProvider } from '@looker/components'
import { ExtensionProvider } from '@looker/extension-sdk-react'
import { Main } from './Main'
import { hot } from 'react-hot-loader/root'
import { useHistory } from 'react-router-dom'

export enum ROUTES {
  EMBED_SQL = '/sql',
  EMBED_EXPLORE = '/explore',
  EMBED_DASHBOARD = '/dashboard',
  EMBED_LOOK = '/look',
  HELP = '/help'
}

export const App: React.FC<any> = hot(() => {
  const [route, setRoute] = useState('')
  const [routeState, setRouteState] = useState()

  const onRouteChange = (route: string, routeState?: any) => {
    console.log({route, routeState})
    setRoute(route)
    setRouteState(routeState)
  }

  return (
    <ExtensionProvider
      onRouteChange={onRouteChange}
      requiredLookerVersion=">=7.9.0"
    >
      <ComponentsProvider>
        <Main route={route.split('?')[0]}/>
      </ComponentsProvider>
    </ExtensionProvider>
  )
})
