import express from "express";
import cors from "cors";
import 'dotenv/config'
import './database.js'
import { Todo } from "./models/model.js";

const app = express();
const port = process.env.PORT || 3000;

// redeploying

app.use(express.json()); 
app.use(
  cors({ origin: ["https://backend-todo.surge.sh/", "http://localhost:5173",] }),
);

app.get("/api/v1/todos", async (request, response) => {
  try {

    const todos = await Todo.find({},
      { ip: 0, __v: 0, updatedAt: 0 }
    ).sort({ _id: -1 })

    const message = !todos.length ? "todos empty" : "todos available";

    response.send({ data: todos, message: message });
  } catch (err) {
    response.status(500).send("Internal server error")
  }
});

app.post("/api/v1/todo", async (request, response) => {
  const obj = {
    todoContent: request.body.todo,
    ip: request.ip,
  };

  const result = await Todo.create(obj)

  response.send({ message: "todo added seccessfully", data: result });
});

app.patch("/api/v1/todo/:id", async (request, response) => {
  const id = request.params.id;

  const result = await Todo.findByIdAndUpdate(id,
    { todoContent: request.body.todoContent }
  )

  console.log('result=>', result);

  if (result) {
    response.status(201).send({
      data: result,
      message: "todo updated successfully!",
    });
  } else {
    response.status(200).send({ data: null, message: "todo not found" });
  }
});

app.delete("/api/v1/todo/:id", async (request, response) => {
  const id = request.params.id;

  const result = await Todo.findByIdAndDelete(id)

  if (result) {
    response.status(201).send({
      message: "todo deleted successfully!",
    });
  } else {
    response.status(200).send({ data: null, message: "todo not found" });
  }
});

//

app.use((request, response) => {
  response.status(404).send({ message: "no route found!" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});