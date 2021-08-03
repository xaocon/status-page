import Head from 'next/head'
import getConfig from 'next/config'
import {Container} from 'react-bootstrap'
import Header from '../components/Header'
import StatusTable from '../components/StatusTable'
import {StrictMode} from 'react'
import {GetStaticProps} from 'next'

const {serverRuntimeConfig} = getConfig()

type List = { id: number, type: string, url: string, worked: boolean | null } | []

const Main = (props) => {
  const filterByType = (t) => props.list.filter(l => l.type === t)
  const getTypes = () => [...new Set(props.list.map(l => l.type))]

  return (
    <Container style={{maxWidth: "800px", paddingTop: "2rem"}}>
      {getTypes().map((title) =>
        <StatusTable key={title} title={title} tableLines={filterByType(title)} list={props.list}/>
      )}
    </Container>
  )
}

const Index = (props) => {

  return (
    <StrictMode>
      <Head>
        <title>Status Page</title>
        <link rel="icon" href="/favicon-32x32.png"/>
      </Head>
      <Header/>
      <Main
        list={props.list}
      />
    </StrictMode>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: serverRuntimeConfig,
  }
}

export default Index
