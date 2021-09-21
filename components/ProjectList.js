import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseInit";

export default function Projets({ user }) {
  const [projects, setProjects] = useState([]);
  const [newProjectText, setNewProjectText] = useState("");
  const [errorText, setError] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    let { data: projects, error } = await supabase
      .from("projects")
      .select("*")
      .order("id", true);
    if (error) console.log("error", error);
    else setProjects(projects);
  };

  const addProject = async (projectText) => {
    let name = projectText.trim();
    console.log({ name });
    console.log({ user });
    // return;

    if (name.length) {
      let { data: project, error } = await supabase
        .from("projects")
        .insert({ project: name, user_id: user.id })
        .single();
      console.log({ project });
      if (error) setError(error.message);
      else setProjects([...projects, project]);
    }
  };

  const deleteProject = async (id) => {
    try {
      await supabase.from("projects").delete().eq("id", id);
      setProjects(projects.filter((x) => x.id != id));
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="w-full">
      <h1 className="mb-12">The Project Basement.</h1>
      <div className="flex gap-2 my-2">
        <input
          className="w-full p-2 rounded"
          type="text"
          placeholder="Not another fucking todo app..."
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
      {!!errorText && <Alert text={errorText} />}
      <div className="overflow-hidden bg-white rounded-md shadow">
        <ul>
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
  const [isCompleted, setIsCompleted] = useState(project.is_complete);
  //set name, description, githubUrl, completion inputs
  const [name, setName] = useState(project.project);
  const [description, setDescription] = useState(project.description);
  const [githubUrl, setGithubUrl] = useState(project.github_url);
  const [completion, setCompletion] = useState(project.completion);
  const [errorText, setError] = useState("");

  const updateProject = async () => {
    let { data: project, error } = await supabase
      .from("projects")
      .update({
        project: name,
        description: description,
        github_url: githubUrl,
        completion: completion,
        is_complete: isCompleted,
      })
      .eq("id", project.id)
      .single();
    if (error) console.log("error", error);
    else {
      project.is_complete = isCompleted;
      setProjects(projects.map((x) => (x.id == project.id ? project : x)));
    }
  };

  return (
    <li className="flex flex-col p-2">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <input
            className="w-full p-2 rounded"
            type="text"
            placeholder="Project Name"
            value={name}
            onChange={(e) => {
              setError("");
              setName(e.target.value);
            }}
          />
          <input
            className="w-full p-2 rounded"
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => {
              setError("");
              setDescription(e.target.value);
            }}
          />
          <input
            className="w-full p-2 rounded"
            type="text"
            placeholder="Github Url"
            value={githubUrl}
            onChange={(e) => {
              setError("");
              setGithubUrl(e.target.value);
            }}
          />
          <input
            className="w-full p-2 rounded"
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
            className="w-full p-2 rounded"
            type="checkbox"
            checked={isCompleted}
            onChange={() => setIsCompleted(!isCompleted)}
          />
        </div>
      </div>
      <div className="flex flex-row justify-end">
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
      <span className="text-red-500">{errorText}</span>
    </li>
  );
};

//   const toggle = async () => {
//     try {
//       const { data, error } = await supabase
//         .from("projects")
//         .update({ is_complete: !isCompleted })
//         .eq("id", project.id)
//         .single();

//       if (error) {
//         throw new Error(error);
//       }
//       setIsCompleted(data.is_complete);
//     } catch (error) {
//       console.log("error", error);
//     }
//   };

//   return (
//     <li
//       onClick={(e) => {
//         e.preventDefault();
//         toggle();
//       }}
//       className="block w-full transition duration-150 ease-in-out cursor-pointer hover:bg-gray-200 focus:outline-none focus:bg-gray-200"
//     >
//       <div className="flex items-center px-4 py-4 sm:px-6">
//         <div className="flex items-center flex-1 min-w-0">
//           <div className="text-sm font-medium leading-5 truncate">
//             {project.project}
//           </div>
//         </div>
//         <div>
//           <input
//             className="cursor-pointer"
//             onChange={(e) => toggle()}
//             type="checkbox"
//             checked={isCompleted ? true : ""}
//           />
//         </div>
//         <button
//           onClick={(e) => {
//             e.preventDefault();
//             e.stopPropagation();
//             onDelete();
//           }}
//           className="w-4 h-4 ml-2 border-2 rounded hover:border-black"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 20 20"
//             fill="gray"
//           >
//             <path
//               fillRule="evenodd"
//               d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
//               clipRule="evenodd"
//             />
//           </svg>
//         </button>
//       </div>
//     </li>
//   );
// };

const Alert = ({ text }) => (
  <div className="p-4 my-3 bg-red-100 rounded-md">
    <div className="text-sm leading-5 text-red-700">{text}</div>
  </div>
);
