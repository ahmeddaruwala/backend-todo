import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const maxTodoLength = 50;

function App() {
  const BASE_URL =
    "http://localhost:3000";
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
          borderRadius: "8px",
          background: "#032470",
          color: "#71b3ff",
        },
      });
    } catch (error) {
      console.log("error deleting todo", error);
    }
  };
  const editTodo = async (event, id) => {
    event.preventDefault();
    const todoValue = event.target.children[0].value;
    if (todoValue.trim() === "") {
      toast("Todo Can't be empty", {
        icon: "❌",
        style: {
          borderRadius: "8px",
          background: "#1261a0",
          color: "#3895d3",
        },
      });
      return;
    }
    try {
      await axios.patch(`${BASE_URL}/api/v1/todo${id}`, {
        todocontent: todoValue,
      });
      setTodos((previoustodos) => {
        return previoustodos.map((todo) => {
          if (todo.id == id) {
            return { ...todo, todocontent: todoValue, isEditing: false };
          }
          return todo;
        });
      });
    } catch (error) {
      console.error("Error editing todo:", error);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-blue-400 text-blue-400 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-6 mt-24">To-Do App</h1>
        <div className="w-full sm:w-96 bg-blue-800 p-6 rounded-lg shadow-lg ">
          <form onSubmit={addTodo}>
            
            <input
              type="text"
              className="w-full p-3 rounded-lg mb-4 bg-blue-400 text-black outline-none placeholder-black"
              placeholder="Enter your task..."
            />
            <button className="w-full py-3 bg-blue-400 text-black font-bold rounded-lg hover:bg-blue-500 transition-all">
              Add Task
            </button>
          </form>  

          <ul className="mt-4 space-y-2">
            {todos?.map((todo, index) => (
              <li
                key={todo.id}
                className="flex justify-between items-center p-2 bg-blue-400 rounded-lg"
              >
                {!todo.isEditing ? (
                  <span className="text-black">{todo.todocontent}</span>
                ) : (
                  <form
                    className="flex gap-6"
                    onSubmit={(e) => editTodo(e, todo.id)}
                  >
                    <input
                      type="text"
                      defaultValue={todo.todocontent}
                      className="border border-blue-600 text-black bg-blue-400 rounded"
                    />
                    <div className="flex gap-3">
                      {" "}
                      <button
                        onClick={() => {
                          const newTodos = todos.map((todo) => {
                            todo.isEditing = false;
                            return todo;
                          });
                          setTodos([...newTodos]);
                        }}
                        type="button"
                        className="text-red-600"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="text-blue-800">
                        Save
                      </button>
                    </div>
                  </form>
                )}
                <div className="flex space-x-2">
                  {!todo.isEditing ? (
                    <button
                      onClick={() => {
                        const newTodos = todos?.map((todo, i) => {
                          if (i == index) {
                            todo.isEditing = true;
                          } else {
                            todo.isEditing = false;
                          }
                          return todo;
                        });
                        setTodos([...newTodos]);
                      }}
                      className="text-blue-800 hover:text-black transition-all"
                    >
                      Edit
                    </button>
                  ) : null}

                  {!todo?.isEditing ? (
                    <button
                      className="text-red-600 hover:text-black transition-all"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      Delete
                    </button>
                  ) : null}
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