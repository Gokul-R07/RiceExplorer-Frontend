import { useState } from "react"
import { Form } from "react-bootstrap"
import _ from "lodash";
import { SatelliteDataFilters, AuxDataFilters } from "../../components/DataFilterGroup";


export const EmpiricalLeft = (props) => {


  const [validated, setValidated] = useState(false)


  return (
    <div className="sidebar h-100 flex-column p-2">
      <Form method="POST" noValidate validated={validated}>
        
        <fieldset >
          <SatelliteDataFilters />
          <AuxDataFilters />
        </fieldset>
                
      </Form>
    </div>
  )
}