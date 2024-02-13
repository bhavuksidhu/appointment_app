import { Pencil, SkipForward } from "lucide-react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import AddMemberModal from "./AddMemberModal";
import AddOpportunity from "./AddOpportunity";

const opTypes = ["lead", "qualified", "booked", "treated"];

function PatientList() {
  const [opportunities, setOpportunities] = useState({});
  const [editOpp, setEditOpp] = useState();
  const [show, setShow] = useState(false);
  const getOpportunities = () => {
    fetch(`${process.env.REACT_APP_BACKEND}/opportunities`, {
      method: "GET",
    })
      .then((r) => r.json())
      .then((data) => {
        if (data?.opportunities) {
          setOpportunities({ ...data.opportunities });
        }
      })
      .catch((e) => {
        console.log(
          "REACT_APP_BACKEND",
          `${process.env.REACT_APP_BACKEND}/opportunities`
        );
      });
  };

  useEffect(() => {
    getOpportunities();
  }, []);

  const forwardOpportunity = (opp_id, stagename) => {
    fetch(`${process.env.REACT_APP_BACKEND}/opportunities/${opp_id}`, {
      method: "PUT",
      body: JSON.stringify({ opportunity: { stage_name: stagename } }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((r) => r.json())
      .then((data) => {
        toast("Saved Successfully");
        getOpportunities();
      });
  };

  const handleEditOpp = (oppid, op) => {
    let currentOpp = opportunities[op]?.find((o) => o.id === oppid);

    setEditOpp(currentOpp.id);
    setShow(true);
  };

  const [addMemberShow, setAddMemberShow] = useState(false);

  return (
    <div className="customContainer mt-3">
      <div className="row">
        <h3 className="page_header d-sm-block d-md-flex d-lg-flex justify-content-between d-lg-block ">
          <p className="text-center">Patients</p>
          <hr className="" />
          <span className="d-flex justify-content-center gap-2">
            <Button variant="primary" onClick={() => setAddMemberShow(true)}>
              Add Member
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setEditOpp();
                setShow(true);
              }}
            >
              Add opportunity
            </Button>
            {addMemberShow && (
              <AddMemberModal
                {...{ getOpportunities }}
                setShow={setAddMemberShow}
                show={addMemberShow}
              />
            )}
            {show && (
              <AddOpportunity
                {...{ getOpportunities, editOpp, show, setShow }}
              />
            )}
          </span>
        </h3>
        {opTypes?.map((op, i) => {
          return (
            <div className="col-sm-12 col-md-3 col-lg-3 m-0 mb-3 pd-0 pr-5">
              <div className="cards_main_container">
                <h5 className="opportunity_type_title mt-4 text-capitalize">
                  {op}
                </h5>
                {opportunities[op]?.map((opportunity) => {
                  return (
                    <div key={opportunity?.patient?.id} className="">
                      <Card className="mb-3">
                        <Card.Body>
                          <Card.Title>
                            <div className="leadCard_header d-flex align-items-center">
                              <img
                                src={`${process.env.REACT_APP_BACKEND}/${opportunity?.patient?.avatar}`}
                                className="lead_img rounded-circle"
                                width="50"
                                height="50"
                              />
                              <div className="lead_desc">
                                <h6 className="">
                                  {opportunity?.patient?.first_name}{" "}
                                  {opportunity?.patient?.last_name}
                                </h6>
                                <div className="text-grayed text-secondary lead_desc_secondary">
                                  {opportunity?.patient?.gender},{" "}
                                  {opportunity?.patient?.age} old
                                </div>
                              </div>
                            </div>
                          </Card.Title>
                          <div className="doctor_desc_wrapper d-flex justify-content-between">
                            <div className="doctor_desc">
                              <h6 className="">
                                {opportunity?.procedure_name}
                              </h6>
                              <h6 className="">
                                {opportunity?.doctor?.first_name}{" "}
                                {opportunity?.doctor?.last_name}
                              </h6>
                              {opportunity?.stage_history?.map((stage) => {
                                return (
                                  <div className="text-grayed d-flex text-secondary lead_desc_secondary justify-content-between w-100 gap-2">
                                    <span>{stage?.stage_name}</span>
                                    <span>
                                      {moment(stage?.stimestamp)?.format(
                                        "MMM D, YYYY h:mma"
                                      )}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="doctor_desc_button d-flex flex-column gap-3 justify-content-between align-items-center pt-0">
                              <img
                                src={`${process.env.REACT_APP_BACKEND}/${opportunity?.doctor?.avatar}`}
                                className="lead_img rounded-circle"
                                width="50"
                                height="50"
                              />
                              {i !== 3 && (
                                <span
                                  className="curosr"
                                  onClick={() => {
                                    forwardOpportunity(opportunity.id, i + 2);
                                  }}
                                >
                                  <SkipForward />
                                </span>
                              )}
                              <span
                                className="curosr"
                                onClick={() => {
                                  handleEditOpp(opportunity.id, op);
                                }}
                              >
                                <Pencil />
                              </span>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PatientList;
