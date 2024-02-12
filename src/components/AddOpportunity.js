import { MenuItem, Select, TextField, Autocomplete } from "@mui/material";
import { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { toast } from "react-toastify";

function AddOpportunity(props) {
  const {getOpportunities, editOpp, show, setShow} = props;


  const [searchQuery, setSearchQuery] = useState({ patients: "", doctors: "" });
  const [allMembers, setAllMembers] = useState({ patients: [], doctors: [] });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  const initData = {
    stage_name: 1,
    procedure_name: "",
  }
  const [formData, setFormData] = useState(editOpp || initData);

  console.log("tesfdsfsd", editOpp);

  const handleChange = (e, key = null) => {
    key ||= e.target.id;
    setFormData({ ...formData, [key]: e.target.value });
  };

  const procedureOptions = [
    { label: "Lead", value: 1 },
    { label: "Qualified", value: 2 },
    { label: "Booked", value: 3 },
    { label: "Treated", value: 4 },
  ];

  const handleSearch = (e, toSearch) => {
    setSearchQuery({ ...searchQuery, [e?.target?.id]: e?.target?.value });

    let url = process.env.REACT_APP_BACKEND;
    url +=
      toSearch === "patients"
        ? `/searchPatients?query=${e?.target?.value || ''}`
        : `/searchDoctors?query=${e?.target?.value || ''}`;
    fetch(url, {
      method: "GET",
    })
      .then((r) => r.json())
      .then((data) => {
        setAllMembers({ ...allMembers, [toSearch]: [...data.result] });
      });
  };

  useEffect(()=>{
    handleSearch(null, "patients")
    handleSearch(null, "doctors")
  },[])

  const handleSubmit = () => {
    fetch(`${process.env.REACT_APP_BACKEND}/opportunities`, {
      method: "POST",
      body: JSON.stringify({ opportunity: formData }),
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then((r) => r.json())
      .then((data) => {
        
        toast("Saved Successfully");
        setShow(false);
        getOpportunities();
      });
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Add opportunity
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add opportunity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormControl className="w-100 mb-3">
            <TextField
              className="w-100"
              label={
                <div className="form_label">
                  Procedure Name<span className="text-danger">*</span>
                </div>
              }
              color="grey"
              focused
              id="procedure_name"
              value={formData?.procedure_name}
              onChange={(e) => handleChange(e)}
            />
          </FormControl>
          <FormControl className="w-100 mb-3">
            <Select
              labelId="Procedure"
              id="stage_name"
              className="w-100 line-10 mb-3"
              onChange={(e) => handleChange(e, "stage_name")}
              value={formData?.stage_name}
            >
              {procedureOptions?.map((p) => {
                return <MenuItem value={+p.value}>{p.label}</MenuItem>;
              })}
            </Select>
          </FormControl>
          <FormControl className="w-100 mb-3" size="small">
            <Autocomplete
              options={allMembers?.patients}
              className="w-100 line-10 py-0"
              value={allMembers?.patients?.find(
                (e) => e.id === formData?.patient_id
              )}
              onChange={(e, value) =>
                setFormData({ ...formData, patient_id: value.id })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  className="w-100 line-10 px-0"
                  label="Patient"
                  id="patients"
                  value={searchQuery?.patients}
                  onChange={(e) => handleSearch(e, "patients")}
                />
              )}
            />
          </FormControl>
          <FormControl className="w-100 mb-3" size="small">
            <Autocomplete
              options={allMembers?.doctors}
              className="w-100 line-10"
              value={allMembers?.doctors?.find(
                (e) => e.id === formData?.doctor_id
              )}
              onChange={(e, value) =>
                setFormData({ ...formData, doctor_id: value.id })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  className="w-100 line-10"
                  label="Doctor"
                  value={searchQuery?.doctors}
                  id="doctors"
                  onChange={(e) => handleSearch(e, "doctors")}
                />
              )}
            />
          </FormControl>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddOpportunity;
