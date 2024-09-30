import React from "react";

const Howitworks = () => {
  return (
    
    <div className="ms-2 me-2 lg:ms-7 lg:me-7">
      <div className="text-red-gradient font-inter text-2xl font-bold" style={{ paddingLeft: "0.1rem" }}>
        How It Works
      </div>
      <div className="mt-0 font-inter text-[24px] lg:text-[36px] font-semibold">
        How EUnivate Works: Connecting Innovation with Industry
      </div>
      <div className="mt-2 text-howitworks-grey font-inter text-[16px] lg:text-[20px]" style={{ paddingLeft: "0.1rem" }}>
        EUnivate streamlines the process of finding solutions to real-world problems.
      </div>
      <div className="steps-howitworks-content">
        <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-6 lg:gap-10" style={{ justifyContent: "center" }}>
          
          {/* Step 1 */}
          <div
            className="steps-cards-howitworks font-inter"
            style={{
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Added shadow here
            }}
          >
            <div className="flex items-center cards-hiw-title">
              <div
                className="p-3 flex items-center justify-center"
                style={{
                  backgroundColor: "#E0EAFF",
                  width: "2.4rem",
                  height: "2.4rem",
                  borderRadius: "12px",
                }}
              >
                1
              </div>
              <div className="p-3 ms-2">Create an Account</div>
            </div>
            <div className="sub-card-hiw-title mt-5">
              Work on real-world problems with real-world impact and build your professional network.
            </div>
          </div>

          {/* Step 2 */}
          <div
            className="steps-cards-howitworks font-inter"
            style={{
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Added shadow here
            }}
          >
            <div className="flex items-center cards-hiw-title">
              <div
                className="p-3 flex items-center justify-center"
                style={{
                  backgroundColor: "#E0EAFF",
                  width: "2.4rem",
                  height: "2.4rem",
                  borderRadius: "12px",
                }}
              >
                2
              </div>
              <div className="p-3 ms-2">Join or Create Projects</div>
            </div>
            <div className="sub-card-hiw-title mt-5">
              Secure funding and resources for real-world projects and enhance student career opportunities.
            </div>
          </div>

          {/* Step 3 */}
          <div
            className="steps-cards-howitworks font-inter"
            style={{
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Added shadow here
            }}
          >
            <div className="flex items-center cards-hiw-title">
              <div
                className="p-3 flex items-center justify-center"
                style={{
                  backgroundColor: "#E0EAFF",
                  width: "2.4rem",
                  height: "2.4rem",
                  borderRadius: "12px",
                }}
              >
                3
              </div>
              <div className="p-3 ms-2">Connect and Collaborate</div>
            </div>
            <div className="sub-card-hiw-title mt-5">
              Work on real-world problems with real-world impact and build your professional network.
            </div>
          </div>

          {/* Step 4 */}
          <div
            className="steps-cards-howitworks font-inter"
            style={{
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Added shadow here
            }}
          >
            <div className="flex items-center cards-hiw-title">
              <div
                className="p-3 flex items-center justify-center"
                style={{
                  backgroundColor: "#E0EAFF",
                  width: "2.4rem",
                  height: "2.4rem",
                  borderRadius: "12px",
                }}
              >
                4
              </div>
              <div className="p-3 ms-2">Track Progress and Achieve Goals</div>
            </div>
            <div className="sub-card-hiw-title">
              Utilize EUnivate's intuitive progress tracking tools to monitor project development in real-time.
              Stay motivated and celebrate milestones as you work together to achieve your objectives.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Howitworks;
