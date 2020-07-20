/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019 Looker Data Sciences, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import { Sidebar } from './components/Sidebar'
import { CoreSDKFunctions } from './components/CoreSDKFunctions'
import { ApiFunctions } from './components/ApiFunctions'
import React, { useState } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { Box, ComponentsProvider } from '@looker/components'
import styled from 'styled-components'
import { ExtensionProvider } from '@looker/extension-sdk-react'
import { EmbedDashboard } from './components/Embed'
import { EmbedSql } from './components/Embed/EmbedSql'
import { EmbedLook } from './components/Embed/EmbedLook'
import { ExternalApiFunctions } from './components/ExternalApiFunctions'
import { Main } from './Main'
import { hot } from 'react-hot-loader/root'

interface AppProps {}

export enum ROUTES {
  EMBED_SQL = '/sql',
  EMBED_EXPLORE = '/explore',
  EMBED_DASHBOARD = '/dashboard',
  EMBED_LOOK = '/look'
}

export const App: React.FC<AppProps> = hot(() => {
  const [route, setRoute] = useState('')
  const [routeState, setRouteState] = useState()

  const onRouteChange = (route: string, routeState?: any) => {
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
