import Head from 'next/head'
import getConfig from 'next/config'
import {Badge, Container, Jumbotron, Spinner} from 'react-bootstrap'
import {useEffect, useState, StrictMode} from 'react'
// import {NextPage} from 'next'
// const JSON5 = require('json5')

const {serverRuntimeConfig} = getConfig()

type List = {id: number, type: string, url: string, worked: boolean | null} | []

const Status = (props) => {
  if (props.worked !== null) {
    if (props.worked) {
      return <Badge variant="success">Connected</Badge>
    } else {
      return <Badge variant="danger">Failed</Badge>
    }
  } else {
    return <Spinner animation="grow" />
  }
}

// @ts-ignore
const HLine = (props) => {
  const [lineStatus, lineStatusSetter] = useState(null)

  useEffect(() => {
    (async () => {
      const id = props.line.id
      const res = await fetch(`/api/v1/https/${id}`)
      const result = await res.json()
      
      lineStatusSetter(result.worked)
    })()
  }, [])

  return (
    <tr className="h5">
      <td style={{paddingLeft: "20px"}}>{props.line.url}</td>
      <td><Status worked={lineStatus}/></td>
    </tr>
  )
}

const TableFill = (props) => {
  const filling = props.tableLines.map((http: { id: number; url: string; worked: any }) => {
    return <HLine key={http.id} line={http} listSetter={props.listSetter} list={props.list} />
  })

  return (
    <table>
      <tbody>
      <tr>
        <td colSpan={2}><h2>{`${props.title}:`}</h2></td>
      </tr>
      {filling}
      </tbody>
    </table>
  )
}

const Main = (props) => {
  useEffect(() => {
    (async () => await startPage())()
  }, [])

  const startPage = async () => {
    let res = await fetch("/api/v1/https")
    let result = await res.json()
    let l: List = result.list

    props.listSetter(l)
  }

  const filterByType = (t) => props.list.filter(l => l.type === t)
  const getTypes = () => [...new Set(props.list.map(l => l.type))]

  return (
    <Container style={{maxWidth: "800px", paddingTop: "2rem"}}>
      {getTypes().map((title) =>
        <TableFill key={title} title={title} tableLines={filterByType(title)} listSetter={props.listSetter} list={props.list} />)
      }
    </Container>
  )
}

const Header = () => (
  <Jumbotron fluid style={{backgroundColor: "darkred", textAlign: "center"}}>
    <h1>Status page</h1>
  </Jumbotron>
)

const Index = () => {
  const [list, listSetter] = useState([])

  return (
    <StrictMode>
      <Head>
        <title>Status Page</title>
        <link rel="icon" href="/favicon-32x32.png"/>
      </Head>
      <Header/>
      <Main
        list={list}
        listSetter={listSetter}
      />
    </StrictMode>
  )
}

// IndexPage.getInitialProps = async (ctx) => {
//   const config: Config = publicRuntimeConfig
//   console.log(config)
//   return {config}
// }

export default Index
