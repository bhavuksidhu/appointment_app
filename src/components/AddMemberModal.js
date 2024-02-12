import {
  FormHelperText,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";
import FormControl from "@mui/material/FormControl";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { UserRoundPlus } from "lucide-react";
import { toast } from "react-toastify";

function AddMemberModal() {
  const ariaLabel = { "aria-label": "description" };
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [formData, setFormData] = useState({ role: 1, gender: 1 });

  const handleChange = (e, key = null) => {
    key ||= e.target.id;
    setFormData({ ...formData, [key]: e.target.value });
  };

  const saveMember = ()=>{
      const formdata = new FormData();
      formdata.append('first_name', formData?.first_name )
      formdata.append('last_name', formData?.last_name )
      formdata.append('avatar', formData?.avatar )
      formdata.append('gender', formData?.gender )
      formdata.append('dob', formData?.dob )
      formdata.append('role', formData?.role )
      fetch(`${process.env.REACT_APP_BACKEND}/members`, {
          method: "POST",
          body: formdata
      }).then(r=>r.json()).then((data)=>{
        toast('Member added');
        setShow(false);
      })
  }

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Add Member
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Member</Modal.Title>
        </Modal.Header>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Modal.Body>
            <FormControl className="w-100 mb-3">
              <input
                type="file"
                id="avatar"
                style={{ display: "none" }}
                onChange={(e) =>
                  setFormData({ ...formData, avatar: e.target.files?.[0] })
                }
                c
              />
              <label
                className="w-100 d-flex justify-content-start gap-1 upload_avatar_main"
                htmlFor="avatar"
              >
                {!formData?.avatar ? (
                  <>
                    <div className="upload_icon_wrapper">
                      <div className="upload_icon">
                        <UserRoundPlus />
                      </div>
                    </div>
                    <p>Click to upload image</p>
                  </>
                ) : (
                  <>
                  <div className="upload_icon_wrapper_img">
                      <img src={URL.createObjectURL(formData?.avatar)} />
                      <button className="change_avtar">change</button>
                  </div>
                  </>
                )}
              </label>
            </FormControl>
            <FormControl className="w-100 mb-3">
              <TextField
                className="w-100"
                label={
                  <div className="form_label">
                    First Name<span className="text-danger">*</span>
                  </div>
                }
                color="grey"
                focused
                id="first_name"
                value={formData?.first_name || ""}
                onChange={(e) => handleChange(e)}
              />
            </FormControl>
            <FormControl className="w-100 mb-3">
              <TextField
                className="w-100"
                label={
                  <div className="form_label">
                    Last Name<span className="text-danger">*</span>
                  </div>
                }
                color="grey"
                focused
                id="last_name"
                value={formData?.last_name || ""}
                onChange={(e) => handleChange(e)}
              />
            </FormControl>
            <FormControl className="w-100 mb-3">
              <Select
                labelId="Role"
                id="role"
                className="w-100 line-10"
                value={formData?.role}
                onChange={(e) => handleChange(e)}
              >
                <MenuItem value={1}>Doctor</MenuItem>
                <MenuItem value={2}>Patient</MenuItem>
              </Select>
            </FormControl>
            <FormControl className="flex-flow-control w-100">
              <Select
                labelId="Gender"
                id="gender"
                className="w-50 line-10 mb-3"
                onChange={(e) => handleChange(e)}
                value={formData?.gender}
              >
                <MenuItem value={1}>Male</MenuItem>
                <MenuItem value={2}>Female</MenuItem>
              </Select>
              <DatePicker
                label={
                  <div className="form_label">
                    Date of Birth<span className="text-danger">*</span>
                  </div>
                }
                className="flex-flow-content date-picker mb-3"
                value={formData?.dob}
                id="dob"
                onChange={(e) => setFormData({ ...formData, dob: e })}
              />
            </FormControl>
          </Modal.Body>
        </LocalizationProvider>
        <Modal.Footer>
          <Button variant="primary" onClick={saveMember}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddMemberModal;
