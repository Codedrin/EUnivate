import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import AdminNavbar from "../../components/SuperAdmin/AdminNavbar.jsx";
import Kanban from "./Kanban";
import List from "./List";
import Calendar from "./Calendar";
import GanttChart from "./GanttChart";
import RaciMatrix from "./RaciMatrix";
import BarLoading from "./Loading Style/Fill Renamed Loading/Loader.jsx";

const ProjectDetails = () => {
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [selectedView, setSelectedView] = useState("Kanban");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [currentModal, setCurrentModal] = useState(null);
  const [error, setError] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [addedMembers, setAddedMembers] = useState([]);
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [addText, setAddText] = useState("");
  const [project, setProject] = useState({});
  // const [isImageVisible, setIsImageVisible] = useState(false);
  // const [projectData, setProjectData] = useState({ name: '', invitedUsers: [] });
  // const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projectName, setProjectName] = useState(project.projectName || "");
  const [tasks, setTasks] = useState([]);

  const modalRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const projectId = location.state?.projectId;

  useEffect(() => {
    const fetchTasks = async () => {
      // Existing fetch logic
      const response = await axios.get(
        `https://eunivate-jys4.onrender.com/api/users/sa-tasks/${projectId}`
      );
      setTasks(response.data.data);
    };
    fetchTasks();
  }, [projectId]);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user?.accessToken;

        if (!token) {
          setError("No access token found. Please log in again.");
          return;
        }

        const response = await axios.get(
          `https://eunivate-jys4.onrender.com/api/users/sa-getnewproject/${projectId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setProject(response.data);
        setAddedMembers(response.data.invitedUsers);
      } catch (error) {
        console.error("Error fetching project details:", error);
        setError("Error fetching project details.");
      }
    };

    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  const toggleAccountDropdown = () =>
    setIsAccountDropdownOpen(!isAccountDropdownOpen);

  const handleViewChange = (view) => {
    setSelectedView(view);
  };

  const handleAddClick = () => {
    console.log("Add button clicked");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleUserIconClick = () => {
    // Just toggle the modal visibility
    setIsUserModalOpen(!isUserModalOpen);
  };

  useEffect(() => {
    // Fetch members only when the modal is opened
    if (isUserModalOpen) {
      const fetchMembers = async () => {
        try {
          const user = JSON.parse(localStorage.getItem("user"));
          const accessToken = user?.accessToken;

          if (!accessToken) {
            throw new Error("No access token found. Please log in.");
          }

          // Include the workspaceId in the request if available
          const response = await axios.get(
            "https://eunivate-jys4.onrender.com/api/users/invited",
            {
              headers: { Authorization: `Bearer ${accessToken}` },
              params: { workspaceId: project.workspaceId }, // Pass workspaceId as a query parameter
            }
          );

          if (Array.isArray(response.data.invitedUsers)) {
            setMembers(response.data.invitedUsers);
          } else {
            console.error("Unexpected response format:", response.data);
            setError("Error fetching members. Expected an array.");
          }
        } catch (error) {
          console.error(
            "Error fetching members:",
            error.response?.data || error.message
          );
          setError("Invite members to people firs!.");
        }
      };

      fetchMembers();
    }
  }, [isUserModalOpen, project.workspaceId]); // This effect runs only when the modal is opened

  const filteredMembers = (members || []).filter((member) =>
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // const handleProfileClick = () => {
  //     setIsImageVisible(true); // Show the image when profile is clicked
  // };

  //Handle addMembers
  const handleAddMembers = async () => {
    try {
      if (!project || !project._id) {
        throw new Error("Invalid project object.");
      }
      const user = JSON.parse(localStorage.getItem("user"));
      const accessToken = user?.accessToken;

      const userIds = selectedMembers
        .map((member) => {
          if (!member || !member._id) {
            console.error("Invalid member object in selectedMembers:", member);
            return null;
          }
          return member._id;
        })
        .filter((id) => id !== null);

      // Log userIds before sending to API
      console.log("User IDs being sent:", userIds);

      if (userIds.length === 0) {
        throw new Error("No valid user IDs to add.");
      }

      const response = await axios.post(
        "https://eunivate-jys4.onrender.com/api/users/add-member-to-project",
        {
          projectId: project._id,
          users: userIds,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      // Handle response
      setAddedMembers(response.data.invitedUsers);
      setSelectedMembers([]);
      setIsUserModalOpen(false);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while adding members.";
      console.error("Error adding members:", errorMessage);
      setError(errorMessage); // Set error message to state
    }
  };

  const toggleMemberSelection = (member) => {
    if (!member?._id) {
      console.error("Invalid member object:", member);
      return;
    }
    setSelectedMembers((prevSelectedMembers) =>
      prevSelectedMembers.some((selected) => selected._id === member._id)
        ? prevSelectedMembers.filter((selected) => selected._id !== member._id)
        : [...prevSelectedMembers, member]
    );
  };

  const handleCloseUserModal = () => {
    setIsUserModalOpen(false);
  };

  const handleButtonTextUpdate = (text) => {
    setAddText(text);
    handleCloseModal();
    if (text === "Gantt Chart") {
      setSelectedView("GanttChart");
    } else if (text === "RACI Matrix") {
      setSelectedView("RaciMatrix");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleCloseModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchProjectDetails = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.accessToken;

      if (!token) {
        setError("No access token found. Please log in again.");
        console.error("No token found");
        return;
      }

      const response = await axios.get(
        `https://eunivate-jys4.onrender.com/api/users/sa-getnewproject/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { projectName, invitedUsers } = response.data;

      setProject((prev) => ({ ...prev, name: projectName }));
      setAddedMembers(invitedUsers); // Assuming this sets invitedUsers properly in your state
    } catch (error) {
      console.error("Error fetching project details:", error);
      setError("Error fetching project details.");
    }
  };

  const toggleModal = (optionModal) => {
    if (currentModal === optionModal) {
      setCurrentModal(null);
    } else {
      setCurrentModal(optionModal);
    }
    if (currentModal === "optionModal") {
      fetchProjectDetails();
    }
  };

  useEffect(() => {
    setProjectName(project.projectName || "");
  }, [project.projectName]);

  const updateProjectName = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.accessToken;
      if (!token) {
        console.error("No access token found. Please log in again.");
        return;
      }

      await axios.put(
        `https://eunivate-jys4.onrender.com/api/users/sa-updateprojectname/${projectId}`,
        { projectName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLoading(true);
      toggleModal();
      setTimeout(() => {
        setLoading(false);
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error updating project name:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="w-full flex justify-between items-center mb-16">
        <div className="relative">
          <h1 className="text-2xl font-medium text-gray-800 hidden md:block">
            Project Details
          </h1>
        </div>
        <AdminNavbar
          isAccountDropdownOpen={isAccountDropdownOpen}
          toggleAccountDropdown={toggleAccountDropdown}
        />
      </div>

      <div className="bg-white p-4 rounded-md shadow-md border border-gray-200">
        <div className="flex items-start space-x-4">
          {project.thumbnail && (
            <div className="w-24 h-24 flex-shrink-0">
              <img
                src={project.thumbnail.url}
                alt={project.projectName}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          )}

          <div className="flex flex-col flex-grow">
            <div className="flex items-center space-x-4 mb-5">
              <button
                onClick={() => navigate(-1)}
                className="text-gray-500 hover:underline"
              >
                Project
              </button>
              <span className="text-gray-500">|</span>
              <span className="text-gray-500">Detail</span>
              <span className="text-gray-500">|</span>
              <button
                onClick={() => toggleModal("optionModal")}
                className="text-gray-500 hover:underline"
              >
                Option
              </button>
            </div>

            <div className="relative flex items-center space-x-4">
              <h2 className="text-3xl font-semibold mt-[-1rem]">
                {project.projectName}
              </h2>
              <FontAwesomeIcon
                icon={faUserPlus}
                className="cursor-pointer mt-[-1rem]"
                size="lg"
                onClick={handleUserIconClick}
              />
              <div className="flex -space-x-4 right-0">
                {/* {addedMembers.map(member => (
                            
                        <img
                            key={member._id} 
                            src={typeof member.profilePicture === 'string' ? member.profilePicture : member.profilePicture?.url}
                            alt={member.username}
                            className="w-8 h-8 rounded-full border border-gray-300 cursor-pointer"
                            onClick={() => toggleMemberSelection(member)}
                        />
                    ))} */}
              </div>
            </div>

            <div className="flex items-center space-x-4 mt-4">
              <button
                onClick={() => handleViewChange("Kanban")}
                className="text-black hover:text-gray-700  text-xs md:text-base" // Added responsive class
              >
                Kanban
              </button>
              <button
                onClick={() => handleViewChange("List")}
                className="text-black hover:text-gray-700  text-xs md:text-base" // Added responsive class
              >
                List
              </button>
              <button
                onClick={() => handleViewChange("Calendar")}
                className="text-black hover:text-gray-700 text-xs md:text-base" // Added responsive class
              >
                Calendar
              </button>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleAddClick}
                  className="text-black hover:text-gray-700  text-xs md:text-base" // Added responsive class
                >
                  + Add
                </button>
                {addText && (
                  <span className="text-black font-bold  text-xs md:text-base">
                    {addText}
                  </span> // Added responsive class
                )}
              </div>

              {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
                  <div
                    ref={modalRef}
                    className="bg-white p-6 rounded-md shadow-lg border border-gray-200"
                  >
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleButtonTextUpdate("Gantt Chart")}
                        className="bg-orange-100 text-orange-600 px-4 py-2 rounded-md"
                      >
                        Gantt Chart
                      </button>
                      <button
                        onClick={() => handleButtonTextUpdate("RACI Matrix")}
                        className="bg-blue-100 text-blue-600 px-4 py-2 rounded-md"
                      >
                        RACI Matrix
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {loading && <BarLoading />}

      {currentModal === "optionModal" && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
          <div className="bg-white w-1/3 p-6 rounded-md shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Project Option</h2>
            <p className="text-gray-800 mb-2">Rename Project</p>
            <div className="relative">
              <input
                type="text"
                className="flex-grow w-full p-2 border border-gray-300 rounded-md text-sm md:text-base"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
              <i className="fas fa-pencil-alt absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            <h3 className="mt-4 mb-2">Members</h3>
            <ul>
              {addedMembers.map((member) => (
                <li
                  key={member._id}
                  className="text-black-600 md:text-md flex m-2 relative"
                >
                  <img
                    src={
                      typeof member.profilePicture === "string"
                        ? member.profilePicture
                        : member.profilePicture?.url
                    }
                    alt={member.username}
                    className="w-7 h-7 rounded-full mr-1"
                  />
                  <div className="flex justify-between ">
                    <p>{member.username}</p>
                  </div>
                  <button
                    onClick={() => setCurrentModal(null)}
                    className="absolute right-1 text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex justify-between mt-12">
              <button
                onClick={() => setCurrentModal(null)}
                className="bg-gray-500 text-white shadow px-6 py-2 rounded-md text-base md:text-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={updateProjectName}
                className="bg-red-600 text-white shadow px-4 py-2 rounded-md text-base md:text-lg hover:bg-red-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 border-gray-200">
        {selectedView === "Kanban" && (
          <Kanban
            projectId={projectId}
            projectName={project.projectName}
            setTasks={setTasks}
            members={addedMembers} // Pass members to Kanban
          />
        )}
        {selectedView === "List" && <List tasks={tasks} />}{" "}
        {/* Pass tasks here */}
        {selectedView === "Calendar" && (
          <Calendar
            tasks={tasks} // Pass tasks to Calendar
            members={addedMembers} // Pass members to Calendar
          />
        )}
        {selectedView === "GanttChart" && <GanttChart projectId={projectId} />}
        {selectedView === "RaciMatrix" && <RaciMatrix tasks={tasks} />}
      </div>

      {isUserModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
          <div className="relative bg-white p-6 md:p-8 rounded-md shadow-lg border border-gray-200 w-11/12 md:w-1/3 min-h-[400px]">
            {error && (
              <p className="text-red-700 p-2 rounded-md mb-4 text-sm md:text-base">
                {error}
              </p>
            )}
            <button
              className="absolute top-2 right-4 text-gray-600 text-2xl md:text-3xl p-2"
              onClick={handleCloseUserModal}
            >
              &times;
            </button>

            <h2 className="text-xl md:text-2xl font-semibold mb-4">
              Add Members
            </h2>

            <div className="flex items-center mb-4">
              <input
                type="text"
                placeholder="Search by email..."
                className="flex-grow p-2 border border-gray-300 rounded-md text-sm md:text-base"
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
              />
              <button
                className="ml-2 bg-red-600 text-white px-4 py-2 rounded-md text-base md:text-lg"
                onClick={handleAddMembers}
              >
                Add Member
              </button>
            </div>

            <ul className="mb-4">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <li
                    key={member._id}
                    className="flex items-center mb-2 text-sm md:text-base"
                  >
                    <img
                      src={
                        typeof member.profilePicture === "string"
                          ? member.profilePicture
                          : member.profilePicture?.url
                      }
                      alt={member.username}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <span>{member.email}</span>
                    <button
                      onClick={() => toggleMemberSelection(member)}
                      className={`ml-auto p-1 border rounded-md text-sm md:text-base ${
                        selectedMembers.some(
                          (selected) => selected._id === member._id
                        )
                          ? "bg-red-400"
                          : "bg-gray-200"
                      }`}
                    >
                      {selectedMembers.some(
                        (selected) => selected._id === member._id
                      )
                        ? "Selected"
                        : "Select"}
                    </button>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No members to display.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
