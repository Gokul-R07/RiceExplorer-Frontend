import { Button, ButtonGroup, Spinner, Stack } from "react-bootstrap";
import { useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import _ from "lodash";
import L from "leaflet";
import {
  addTileOverlays,
  removeAllOverlays,
} from "../../components/LeafletMap";

import { appendLog } from "../../features/logSlice";
import ThresholdPopup from "./ThresholdPopup";

export const EmpiricalActions = () => {
  const csrfToken = useSelector((state) => state.csrfToken);
  const datasetFilters = useSelector((state) => state.dataset);
  const seasonFilters = useSelector((state) => state.seasons);
  const dispatch = useDispatch();

  // local state
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  const [downloadUrl, setDownLoadUrl] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [thresholdData, setThresholdData] = useState({});

  const findThreshold = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData();
    let jsonData = {};
    jsonData["op"] = seasonFilters.op;
    jsonData["seasons"] = seasonFilters.seasons;

    jsonData["dataset"] = _.cloneDeep(datasetFilters);
    if (jsonData["dataset"].boundary_file) {
      formData.append("boundary_file", jsonData["dataset"].boundary_file);
      delete jsonData["dataset"].boundary_file;
    }

    formData.append(
      "json",
      new Blob([JSON.stringify(jsonData)], {
        type: "application/json",
      })
    );

    try {
      const response = await axios.post("/empirical/threshold", formData, {
        headers: {
          "X-CSRFToken": csrfToken,
        },
      });

      const maxThresholdData = response.data.max_threshold;
      const minThresholdData = response.data.min_threshold;
      setThresholdData({ ...maxThresholdData, ...minThresholdData });
      setShowPopup(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    console.log(form);

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(false);

    const formData = new FormData();

    let jsonData = {};
    jsonData["op"] = seasonFilters.op;
    jsonData["seasons"] = seasonFilters.seasons;

    jsonData["dataset"] = _.cloneDeep(datasetFilters);
    if (jsonData["dataset"].boundary_file) {
      formData.append("boundary_file", jsonData["dataset"].boundary_file);
      delete jsonData["dataset"].boundary_file;
    }

    formData.append(
      "json",
      new Blob([JSON.stringify(jsonData)], {
        type: "application/json",
      })
    );

    axios
      .post("empirical/", formData, {
        baseURL: process.env.PUBLIC_URL,
        headers: {
          "X-CSRFToken": csrfToken,
        },
      })
      .then((response) => {
        let res_body = response.data;
        setDownLoadUrl(res_body["combined"].download_url);
        let overlays = [];
        Object.keys(res_body).forEach((key) => {
          let layer = new L.TileLayer(res_body[key].tile_url);
          let overlay = {
            layer: layer,
            name: key,
            url: res_body[key].download_url,
          };
          overlays.push(overlay);

          if (res_body[key].area) {
            dispatch(
              appendLog(
                "Rice area: <b>" + res_body[key].area.toFixed(3) + " ha</b>\n"
              )
            );
          }
        });
        addTileOverlays(overlays);

        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        dispatch(
          appendLog("<b>Failed</b> with the reason: " + error.response.data)
        );
      });

    dispatch(
      appendLog(
        "Run threshold-based classification with the following parameters: <br>" +
          JSON.stringify(jsonData)
      )
    );

    setLoading(true);

    removeAllOverlays();
  };
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <Stack direction="horizontal" gap={2}>
      <Button
        size="xl"
        onClick={findThreshold}
        style={{
          fontWeight: "bold",
        }}
      >
        Calculate threshold
      </Button>
      <Button
        size="sm"
        variant={loading ? "secondary" : "primary"}
        disabled={loading}
        onClick={handleSubmit}
        style={{ width: "100px", fontWeight: "bold" }}
      >
        {loading ? (
          <div className="d-flex align-items-center">
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
            ></Spinner>
            <div>Running </div>
          </div>
        ) : (
          "Run"
        )}
      </Button>
      <ThresholdPopup
        showPopup={showPopup}
        handleClose={handleClosePopup}
        thresholdData={thresholdData}
      />
    </Stack>
  );
};
