import { Card, Col, Form, FormGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { dataList, featureList, districtList,cropTypes } from "../utils/constants";
import { update, changeDataSource } from "../features/datasetSlice";

export function SatelliteDataFilters(props) {
  let { disabled } = props;

  const datasetFilters = useSelector((state) => state.dataset);
  const dispatch = useDispatch();

  const handleChange = (field, value) => {
    dispatch(update({ [field]: value }));
  };

  const handleDataChange = (e) => {
    dispatch(changeDataSource(e.target.value));
  };

  return (
    <Card className="mb-2 shadow-lg  bg-white rounded">
      <Card.Header>
        <h6 className="m-0 p-0">
          Satellite Dataset
        </h6>
      </Card.Header>
      <Card.Body>
        <Form.Group
          as={Row}
          controlId={"dataset_name"}
          className="mb-2 align-items-center"
        >
          <Form.Label column xs={4}>
            Dataset
          </Form.Label>
          <Col xs={8}>
            <Form.Select
              onChange={handleDataChange}
              value={datasetFilters["name"]}
            >
              {Object.entries(dataList).map(([key, value]) => (
                <optgroup key={key} label={key}>
                  {Object.entries(value).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </optgroup>
              ))}
            </Form.Select>
          </Col>
        </Form.Group>

        {datasetFilters["name"] in dataList.optical 
          ? (
            <Form.Group
              as={Row}
              controlId={"dataset_cloud"}
              className="align-items-center mb-2"
            >
              <Form.Label column xs="auto">
                Cloud cover (%)
              </Form.Label>
              <Col>
                <Form.Control
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={datasetFilters["cloud"]}
                  onChange={(e) => handleChange("cloud", e.target.value)}
                />
              </Col>
            </Form.Group>
          ) 
          : null
        }

        <Form.Group as={Row} controlId={"dataset_orbit"} className="mb-2">
          <Form.Label column xs={4}>
            Orbit
          </Form.Label>
          <Col xs={8}>
            <Form.Check
              type="checkbox"
              id={"desc"}
              name={"desc"}
              label="Descending"
              checked={datasetFilters["desc"]}
              onChange={(e) => handleChange("desc", e.target.checked)}
            />
            <Form.Check
              type="checkbox"
              id={"ascd"}
              name={"ascd"}
              label="Ascending"
              checked={datasetFilters["ascd"]}
              onChange={(e) => handleChange("ascd", e.target.checked)}
            />
          </Col>
        </Form.Group>


        <Form.Group as={Row} controlId={"dataset_feature"} className="mb-2 align-items-center">
          <Form.Label column xs={4}>
            Feature
          </Form.Label>
          <Col xs={8}>
            <Form.Select
              onChange={(e) => handleChange("feature", e.target.value)}
              value={datasetFilters["feature"]}
            >
              {datasetFilters["name"] in dataList.radar
                ? Object.entries(featureList.radar).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))
                : Object.entries(featureList.optical).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))
              }
            </Form.Select>
          </Col>
        </Form.Group>

        <Form.Group
          as={Row}
          controlId={"dataset_composite"}
          className="mb-2 align-items-center"
        >
          <Form.Label column xs={4}>
            Composite Type
          </Form.Label>
          <Col xs={8}>
            <Form.Select
              onChange={(e) => handleChange("composite", e.target.value)}
              value={datasetFilters["composite"]}
            >
              {["minimum", "maximum", "median", "mean", "mode"].map(
                (type) => (
                  <option value={type} key={type}>
                    {type}
                  </option>
                )
              )}
            </Form.Select>
          </Col>
        </Form.Group>
        

        <Form.Group
          as={Row}
          controlId={"dataset_composite_days"}
          className="mb-2 align-items-center"
        >
          <Form.Label column xs={4}>
            Composite Days
          </Form.Label>
          <Col xs={8}>
            <Form.Control
              type="number"
              onChange={(e) => handleChange("composite_days", e.target.value)}
              value={datasetFilters["composite_days"]}
            >
            </Form.Control>
          </Col>
        </Form.Group>
        
        
      </Card.Body>
    </Card>
  );
}

export const AuxDataFilters = (props) => {

  const datasetFilters = useSelector((state) => state.dataset);
  const dispatch = useDispatch();

  const handleChange = (field, value) => {
    dispatch(update({ [field]: value }));
  };

  return (
    <Card className="shadow-lg  bg-white rounded">
      <Card.Header>
        <h6 className="m-0 p-0">
          Choose District
        </h6>
      </Card.Header>
      <Card.Body>
        <Form.Group
          as={Row}
          controlId={"dataset_boundary"}
          className="mb-2 align-items-center"
         >
          <Form.Label column xs={4}>
            Boundary
          </Form.Label>
          <Col xs={8}>
            <Form.Select
              onChange={(e) => handleChange("boundary", e.target.value)}
              value={datasetFilters["boundary"]}
            >
              {Object.entries(districtList).map(([key, value]) => (
                <option value={key} key={key}>
                  {value}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Form.Group>
        <Form.Group
          as={Row}
          controlId={"dataset_crop_type"}
          className="mb-2 align-items-center"
        >
            <Form.Label column xs={4}>
            Crop type
          </Form.Label>
          <Col xs={8}>
            <Form.Select
              onChange={(e) => handleChange("cropType", e.target.value)}
              value={datasetFilters["cropType"]}
            >
              {Object.entries(cropTypes).map(([key, value]) => (
                <option value={value} key={key}>
                  {key}
                </option>
              ))}
            </Form.Select>
          </Col>
          
         </Form.Group>

        

        <Form.Group
          as={Row}
          controlId={"use_cropmask"}
          className="align-items-center"
        >
         

        </Form.Group>
        
        {datasetFilters["use_crop_mask"] ? (
          <Form.Group
            as={Row}
            controlId={"dataset_cropmask"}
            className="mb-2 align-items-center"
          >
            <Form.Label column xs={4}>
              (GEE asset)
            </Form.Label>
            <Col xs={8}>
              <Form.Control
                type={"text"}
                onChange={(e) => handleChange("crop_mask", e.target.value)}
                value={datasetFilters["crop_mask"]}
              />
            </Col>
          </Form.Group>
        ) : null
        }
        
      </Card.Body>
    </Card>
  )
}
