import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const maxTodoLength = 30;

function App() {
  const BASE_URL =
    "https://to-do-app-express-iela.vercel.app" || "http://localhost:3000";
  const [todos, setTodos] = useState();
  const getTodo = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/todos`);
      if (res?.data?.data) {
        const todosFromServer = res.data.data;
        console.log("todosFromServer ", todosFromServer);
        setTodos(todosFromServer); 
      } else {
        console.error("No todos data received.");
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    getTodo();
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    let todoValue = e.target.children[0].value;
    if (todoValue.length > maxTodoLength) {
      alert(`Todo Can't be this long`);
      return;
    }
    try {
      if (todoValue !== "") {
        const res = await axios.post(`${BASE_URL}/api/v1/todo`, {
          todocontent: todoValue,
        });
        setTodos((previoustodos) => [...previoustodos, res?.data?.data]);
        e.target.children[0].value = "";
      }
    } catch (err) {
      console.log(err);
    }
  };
  const deleteTodo = async (id) => {
    try {
      const res = await axios.delete(`${BASE_URL}/api/v1/todo${id}`);
      if (res?.status == 201) {
        setTodos((previoustodos) =>
          previoustodos.filter((todo) => todo.id !== id)
        );
      }
      toast(res.data?.message, {
        icon: "🗑️",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } catch (error) {
      console.log("error delete in todo", error);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-red-900 text-white flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold text-blue-400 mb-6">To-Do App</h1>
        <div className="w-full sm:w-96 bg-gray-800 p-6 rounded-lg shadow-lg ">
          <form onSubmit={addTodo}>
            {/* Input for new task */}
            <input
              type="text"
              className="w-full p-3 rounded-lg mb-4 bg-gray-700 text-white outline-none placeholder-gray-400"
              placeholder="Enter task..."
            />
            <button className="w-full py-3 bg-blue-500 text-black font-bold rounded-lg hover:bg-blue-600 transition-all">
              Add Task
            </button>
          </form>
          {/* Add Task button */}

          {/* Task List */}
          <ul className="mt-4 space-y-2">
            {todos?.map((todo) => (
              <li
                key={todo.id}
                className="flex justify-between items-center p-2 bg-gray-700 rounded-lg"
              >
                <span className="text-white">{todo.todocontent}</span>
                <div className="flex space-x-2">
                  {/* <button className="text-yellow-400 hover:text-white transition-all">
                    Edit
                  </button> */}
                  <button
                    className="text-red-500 hover:text-white transition-all"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;