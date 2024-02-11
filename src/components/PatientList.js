import { Pencil, SkipForward } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import AddMemberModal from "./AddMemberModal";
import AddOpportunity from "./AddOpportunity";
const patients = [
  {
    id: 1,
    name: "John Doe",
    age: 30,
    condition: "Condition A",
    gender: "Male",
    profile: "/profile.avif",
  },
  // Add more patients as needed
];

const opTypes = ["lead", "qualified", "booked", "treated"];

function PatientList() {
  const [opportunities, setOpportunities] = useState({});

  const getOpportunities = () => {
    fetch(`http://localhost:3000/opportunities`, {
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

  console.log("opportunities", opportunities);
  return (
    <div className="customContainer mt-3">
      <div className="row">
        <h3 className="page_header d-sm-block d-md-flex d-lg-flex justify-content-between d-lg-block ">
          <p className="text-center">Patients</p>
          <hr className="" />
          <span className="d-flex justify-content-center gap-2">
            <AddMemberModal /> <AddOpportunity />
          </span>
        </h3>
        {opTypes?.map((op) => {
          return (
            <div className="col-sm-12 col-md-3 col-lg-3 m-0 mb-3 pd-0 pr-5">
              <div className="cards_main_container">
                <h5 className="opportunity_type_title mt-4 text-capitalize">
                  {op}
                </h5>
                {opportunities[op]?.map((oppertunity) => {

                    return (
                      <div key={oppertunity?.patient?.id} className="">
                        <Card className="mb-3">
                          <Card.Body>
                            <Card.Title>
                              <div className="leadCard_header d-flex align-items-center">
                                <img
                                  src={oppertunity?.patient?.avatar}
                                  className="lead_img rounded-circle"
                                  width="50"
                                  height="50"
                                />
                                <div className="lead_desc">
                                  <h6 className="">
                                    {oppertunity?.patient?.first_name}{" "}
                                    {oppertunity?.patient?.last_name}
                                  </h6>
                                  <div className="text-grayed text-secondary lead_desc_secondary">
                                    {oppertunity?.patient?.gender},{" "}
                                    {oppertunity?.patient?.age} old
                                  </div>
                                </div>
                              </div>
                            </Card.Title>
                            <div className="doctor_desc_wrapper d-flex justify-content-between">
                              <div className="doctor_desc">
                                <h6 className="">{oppertunity?.doctor?.first_name}</h6>
                                <h6 className="">{oppertunity?.doctor?.last_name}</h6>
                                <div className="text-grayed d-flex text-secondary lead_desc_secondary justify-content-between w-100 gap-2">
                                  <span>Lead</span>
                                  <span>Dec 2, 2023 4:35PM</span>
                                </div>
                              </div>
                              <div className="doctor_desc_button d-flex flex-column gap-3 justify-content-between align-items-center">
                                <img
                                  src={oppertunity?.doc?.avatar}
                                  className="lead_img rounded-circle"
                                  width="50"
                                  height="50"
                                />
                                <SkipForward />
                                <Pencil />
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
