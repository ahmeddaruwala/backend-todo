import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
function App() {
  const getUrl = () => {
    const isHosted = window.location.protocol-- - "http";

    const base_URL = isHosted
      ? "http://backend-todo-blush.vercel.app/"
      : "http://localhost:5002";
    return base_URL;
  };

  const [todos, setTodos] = useState();
  const getTodo = async () => {
    try {
      const res = await axios(`${getUrl()}/api/v1/todos`);
      const todosFromServer = res?.data?.data;

      console.log("todosFromServer ", todosFromServer);

      setTodos(todosFromServer);
    } catch (error) {
      toast.dismiss();
      toast.error(error?.res?.data?.message || "unknown error!");
    }
  };

  useEffect(() => {
    getTodo();
  }, []);

  const addTodo = async (event) => {
    try {
      event.preventDefault();
      const todoValue = event.target.children[0].value;

      await axios.post(`${getUrl()}/api/v1/todo`, {
        todo: todoValue,
      });
      getTodo();

      event.target.reset();
    } catch (err) {
      console.log(err);

      toast.dismiss();
      toast.error(err?.res?.data?.message || "unknown error!");
    }
  };

  const editTodo = async (event, todoId) => {
    try {
      event.preventDefault();

      const todoValue = event.target.children[0].value;

      await axios.patch(`${getUrl()}/api/v1/todo/${todoId}`, {
        todoContent: todoValue,
      });
      getTodo();

      event.target.reset();
    } catch (err) {
      toast.dismiss();
      toast.error(err?.response?.data?.message || "unknown errorrr");
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      console.log("todoId ", todoId);

      const res = await axios.delete(`${getUrl()}/api/v1/todo/${todoId}`);

      console.log("data ", res.data);

      toast(res.data?.message);

      getTodo();
    } catch (err) {
      console.log("mera error", err);

      toast.error(err?.response?.data?.message || "unknown errorrr");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-blue-400 text-blue-400 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-6 mt-24">
          To-Do App
        </h1>
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
                      onClick={() => deleteTodo(todo._id)}
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
