import { useEffect, useState } from "react";
import "./App.css";
import supabase from "./supabase-client";

type Todo = {
  id: number;
  name: string | null;
  isCompleted: boolean | null;
  created_at: string;
};

function App() {
  const [todoList, settodoList] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fectTodos();
  }, []);

  const fectTodos = async () => {
    const { data, error } = await supabase.from("ToDoLIst").select("*");

    if (error) {
      console.error("Error fetching todos:", error);
    } else {
      settodoList(data);
    }
  };

  const addTodo = async () => {
    const newTodoData = {
      name: newTodo,
      isCompleted: false,
    };
    const { data, error } = await supabase
      .from("ToDoLIst")
      .insert([newTodoData])
      .single();

    if (error) {
      console.error("Error adding todo:", error);
    } else {
      settodoList((prevToDO) => [...prevToDO, data]);
      setNewTodo("");
    }
  };

  const CompleteTask = (id: number, isComplete: boolean | null) => async () => {
    const { data, error } = await supabase
      .from("ToDoLIst")
      .update({ isCompleted: isComplete })
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error completing todo:", error);
    } else {
      settodoList((prevToDO) =>
        prevToDO.map((todo) =>
          todo.id === id ? { ...todo, isCompleted: true } : todo
        )
      );
    }
  };
  const deleteTodo = async (id: number) => {
    const { data, error } = await supabase
      .from("ToDoLIst")
      .delete()
      .eq("id", id)
      .single();
    if (error) {
      console.error("Error deleting todo:", error);
    } else {
      settodoList((prevToDO) => prevToDO.filter((todo) => todo.id !== id));
    }
  };

  return (
    <>
      <div>
        {" "}
        <h1>ToDo List</h1>
        <div>
          <input
            type="text"
            name="todo"
            id="todo"
            placeholder="New Todo..."
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button onClick={addTodo}> Add Todo Button</button>
        </div>
        <ul>
          {todoList.map((todo) => (
            <li key={todo.id}>
              <span>{todo.name}</span>
              <button onClick={() => CompleteTask(todo.id, todo.isCompleted)}>
                {todo.isCompleted ? "✔️" : "❌"}
              </button>
              // Delete icon
              <button onClick={() => deleteTodo(todo.id)}>Delete Todo</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
