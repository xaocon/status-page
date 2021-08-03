import {Badge, Spinner} from "react-bootstrap";
import {useEffect, useState} from "react";

const StatusIcon = (props) => {
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

// @ts-ignore
const StatusLine = (props) => {
  const [lineStatus, lineStatusSetter] = useState(null)

  useEffect(() => {
    (async () => {
      const id = props.line.id
      const res = await fetch(`/api/v1/validate/${id}`)
      const result = await res.json()

      lineStatusSetter(result.worked)
    })()
  }, [])

  return (
    <tr className="h5">
      <td style={{paddingLeft: "20px"}}>{props.line.url}</td>
      <td><StatusIcon worked={lineStatus}/></td>
    </tr>
  )
}

const StatusTable = (props) => {
  const filling = props.tableLines.map((http: { id: number; url: string; worked: any }) => {
    return <StatusLine key={http.id} line={http} list={props.list}/>
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

export default StatusTable
