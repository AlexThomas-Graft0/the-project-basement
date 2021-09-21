import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseInit";

export default function Projects({ user }) {
  const [projects, setProjects] = useState([]);
  const [newProjectText, setNewProjectText] = useState("");
  const [errorText, setError] = useState("");
  const [messageText, setMessage] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      let { data: projects, error } = await supabase
        .from("projects")
        .select("*")
        .order("id", true);
      if (error) console.log("error", error);
      else setProjects(projects);
    };
    fetchProjects();
  }, [projects]);

  const addProject = async (projectText) => {
    let name = projectText.trim();

    if (name.length) {
      let { data: project, error } = await supabase
        .from("projects")
        .insert({ project: name, user_id: user.id })
        .single();
      if (error) {
        setError(error.message);
      } else {
        setProjects([...projects, project]);
        setMessage("Successfully added project");
      }
    }
  };

  const deleteProject = async (id) => {
    if (confirm("Are you sure you want to delete this project?"))
      try {
        await supabase.from("projects").delete().eq("id", id);
        setProjects(projects.filter((x) => x.id != id));
        setMessage("Successfully deleted project");
      } catch (error) {
        console.log("error", error);
        handleSetError(error.message);
      }
  };

  return (
    <div className="w-full h-full">
      <h1 className="mb-12">The Project Basement.</h1>
      <div className="flex gap-2 my-2">
        <input
          className="w-full p-2"
          type="text"
          placeholder="Not another fucking project..."
          value={newProjectText}
          onChange={(e) => {
            setError("");
            setNewProjectText(e.target.value);
          }}
        />
        <button
          className="btn-black"
          onClick={() => addProject(newProjectText)}
        >
          Add
        </button>
      </div>
      {!!messageText && <Success text={messageText} setMessage={setMessage} />}
      {!!errorText && <Alert text={errorText} />}
      <div className="overflow-hidden rounded-md">
        <ul className="flex flex-wrap items-center px-1 py-3 justify-evenly md:space-x-1">
          {projects.map((project) => (
            <Project
              key={project.id}
              project={project}
              onDelete={() => deleteProject(project.id)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

const Project = ({ project, onDelete }) => {
  const [isPublic, setIsPublic] = useState(project.is_public);
  const [projectId, setProjectId] = useState(project.id);
  //set name, description, githubUrl, completion inputs
  const [name, setName] = useState(project.project);
  const [description, setDescription] = useState(project.description);
  const [githubUrl, setGithubUrl] = useState(project.github_url);
  const [completion, setCompletion] = useState(project.completion);
  const [errorText, setError] = useState("");
  const [messageText, setMessage] = useState("");

  const updateProject = async () => {
    if (confirm("Are you sure you want to update this project?")) {
      let { data: project, error } = await supabase
        .from("projects")
        .update({
          project: name,
          description: description,
          github_url: githubUrl,
          completion: completion,
          is_public: isPublic,
        })
        .eq("id", projectId)
        .single();
      if (error) {
        console.log("error", error);
        setError(error.message);
      } else {
        setMessage("Successfully updated project");
      }
    }
  };

  const toggle = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .update({ is_public: !isPublic })
        .eq("id", projectId)
        .single();

      if (error) {
        throw new Error(error);
      }
      setIsPublic(data.is_public);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <li className="flex flex-col w-full p-2 my-3 bg-gray-200 shadow md:w-1/3">
      <div className="flex flex-row justify-between mb-2">
        <div className="flex flex-col w-full">
          <input
            className="w-full p-2"
            type="text"
            placeholder="Project Name"
            value={name}
            onChange={(e) => {
              setError("");
              setName(e.target.value);
            }}
          />
          <input
            className="w-full p-2"
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => {
              setError("");
              setDescription(e.target.value);
            }}
          />
          <input
            className="w-full p-2"
            type="text"
            placeholder="Github Url"
            value={githubUrl}
            onChange={(e) => {
              setError("");
              setGithubUrl(e.target.value);
            }}
          />
          <input
            className="w-full p-2"
            type="text"
            placeholder="Completion"
            value={completion}
            onChange={(e) => {
              setError("");
              setCompletion(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col">
          <input
            className="w-full p-2"
            type="checkbox"
            checked={isPublic}
            onChange={() => setisPublic(!isPublic)}
          />
        </div>
      </div>
      <div className="flex flex-row items-center justify-between">
        <label htmlFor="public" onClick={(e) => toggle()} className="cursor-pointer select-none">
          <input
            name="public"
            className="mr-2 cursor-pointer"
            onChange={(e) => toggle()}
            type="checkbox"
            checked={isPublic ? true : ""}
          />
          Public
        </label>
        <div>
          <button
            className="mr-2 btn-black"
            onClick={() => {
              updateProject();
            }}
          >
            Update
          </button>
          <button
            className="btn-black"
            onClick={() => {
              onDelete();
            }}
          >
            Delete
          </button>
        </div>
      </div>
      {!!messageText && <Success text={messageText} setMessage={setMessage} />}
      <span className="text-red-500">{errorText}</span>
    </li>
  );
};

const Alert = ({ text }) => (
  <div className="p-4 my-3 bg-red-100 rounded-md">
    <div className="text-sm leading-5 text-red-700">{text}</div>
  </div>
);

const Icon = ({ icon, color, path }) => {
  return (
    <svg
      className="icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      <title>{icon}</title>
      <path fill={color} d={path} stroke="none" fillRule="evenodd" />
    </svg>
  );
};

const Success = ({ text, setMessage }) => (
  <div className="flex justify-between p-4 my-3 bg-green-100 rounded-md">
    <div className="text-sm leading-5 text-green-700">{text}</div>
    <div className="rounded-full cursor-pointer" onClick={() => setMessage("")}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </div>
  </div>
);
