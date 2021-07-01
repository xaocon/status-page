import Head from 'next/head'
import getConfig from 'next/config'
import {Badge, Container, Jumbotron, Spinner} from 'react-bootstrap'
import {useEffect, useState} from 'react'
import {NextPage} from 'next'

const {publicRuntimeConfig} = getConfig()

interface Props {
  config: Config,
}

type filterByType = (t: string) => Array<Entry>

interface Main {
  types: Array<string>,
  filterByType: filterByType,
}

interface Entry {
  id: number,
  type: string,
  url: string,
  worked: boolean | null,
}

export interface Config {
  types: Array<string>,
  list: Array<Entry>,
  size: number,
}


const Status = (props) => {
  if (props.worked !== null) {
    if (props.worked) {
      return <Badge variant="success">Connected</Badge>
    } else {
      return <Badge variant="danger">Failed</Badge>
    }
  } else {
    return <Spinner animation="grow"/>
  }
}

const HLine = (props) => (
  <tr className="h5">
    <td style={{paddingLeft: "20px"}}>{props.url}</td>
    <td><Status worked={props.worked}/></td>
  </tr>
)

const TableFill = ({title, tableLines}) => {
  const filling = tableLines.map((http) =>
    <HLine key={http.id} url={http.url} worked={http.worked}/>
  )

  return (
    <table>
      <tbody>
      <tr>
        <td colSpan={2}><h2>{`${title}:`}</h2></td>
      </tr>
      {filling}
      </tbody>
    </table>
  )
}

const Main: NextPage<Main> = ({types, filterByType}) => {

  // useEffect(() => {
  //   const findRes = async () => {
  //     let result:  {id: number, worked: boolean} = await getResults(1)
  //     console.log(result)
  //     const r = tables.https.map((line) =>
  //         line.id == result.id ? {...line, worked: result.worked} : line
  //     )
  //     console.log(r)
  //     tablesSetter({...tables, https: r})
  //   }
  //
  //   findRes()
  //     .then((r) => console.log("findRes worked"))
  //     .catch((e) => `findRes failed: ${e}`)
  // }, [])

  return (
    <Container style={{maxWidth: "800px", paddingTop: "2rem"}}>
      {types.map((title) =>
        <TableFill key={title} title={title} tableLines={filterByType(title)}/>)
      }
    </Container>
  )
}

const Header = () => (
  <Jumbotron fluid style={{backgroundColor: "darkred", textAlign: "center"}}>
    <h1>Status page</h1>
  </Jumbotron>
)

const IndexPage: NextPage<Props> = ({config}) => {
  let [tables, tablesSetter] = useState(config.list)

  const updateStatus = (id: number, worked: boolean) => {
    tablesSetter(tables.map(el =>
      el.id === id ? {...el, worked: worked} : el
    ))
  }

  const getResults = async (id) => {
    const t = await fetch(`http://localhost:3000/api/v1/https/${id}`)
    const result = await t.json()
    updateStatus(id, result.worked)
  }

  useEffect(() => {
    Promise.all(tables.map(v => getResults(v.id)))
      .then((r) => console.log(r))
      .catch((e) => `findRes failed: ${e}`)
  }, [])

  const filterByType = t => tables.filter(l => l.type == t)

  return (
    <>
      <Head>
        <title>Status Page</title>
        <link rel="icon" href="/favicon-32x32.png"/>
      </Head>
      <Header/>
      <Main
        types={config.types}
        filterByType={filterByType}
      />
    </>
  )
}

IndexPage.getInitialProps = async (ctx) => {
  const config: Config = publicRuntimeConfig
  console.log(config)
  return {config}
}

export default IndexPage
