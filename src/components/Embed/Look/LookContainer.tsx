import styled from 'styled-components'


export const EmbedContainer = styled.div`
  position: relative;
  height: 100%;
  width: 100%;

  & > iframe {
    position: absolute;
    width: 100%;
    height: 100%;
  }
`