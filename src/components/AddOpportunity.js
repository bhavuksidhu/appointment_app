import {
  FormHelperText,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Autocomplete,
} from "@mui/material";
import { useState } from "react";
import FormControl from "@mui/material/FormControl";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function AddOpportunity() {
  const ariaLabel = { "aria-label": "description" };
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [formData, setFormData] = useState({ role: 1, gender: 1 });

  const handleChange = (e, key = null) => {
    key ||= e.target.id;
    setFormData({ ...formData, [key]: e.target.value });
  };

  const procedureOptions = [
    { label: "Lead", value: 1 },
    { label: "Qualified", value: 2 },
    { label: "Booked", value: 1 },
    { label: "Treated", value: 4 },
  ];

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Add opportunity
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add opportunity</Modal.Title>
        </Modal.Header>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Modal.Body>
            <FormControl className="w-100 mb-3">
              <Select
                labelId="Procedure"
                id="procedure"
                className="w-100 line-10 mb-3"
                onChange={(e) => handleChange(e)}
                value={formData?.gender}
              >
                {procedureOptions?.map((p) => {
                  return <MenuItem value={p.value}>{p.label}</MenuItem>;
                })}
              </Select>
            </FormControl>
            <FormControl className="w-100 mb-3" size="small">
              <Autocomplete
                options={[]}
                className="w-100 line-10 py-0"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    className="w-100 line-10 px-0"
                    label="Movie"
                  />
                )}
              />
            </FormControl>
            <FormControl className="w-100 mb-3" size="small">
              <Autocomplete
                options={[]}
                className="w-100 line-10"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    className="w-100 line-10"
                    label="Movie"
                  />
                )}
              />
            </FormControl>
          </Modal.Body>
        </LocalizationProvider>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddOpportunity;
