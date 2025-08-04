import { useState, useEffect } from "react"; // React ke hooks import kiye ja rahe hain
import Navbar from "./components/navbar"; // Navbar component ko import kiya gaya hai
import { v4 as uuidv4 } from 'uuid'; // Unique id generate karne ke liye uuid library ka use

function App() {
  // Todo input field ke liye state banayi gayi hai
  const [todo, setTodo] = useState("");
  
  // Sabhi todos ko store karne ke liye state
  const [todos, setTodos] = useState([]);

  // Component load hone par localStorage se todos uthakar state mein set karte hain
  useEffect(() => {
    let todoString = localStorage.getItem("todos")
    if (todoString) {
      let todos = JSON.parse(todoString); // JSON string ko JS array mein convert kiya
      setTodos(todos); // State update kiya
    }
  }, []);

  // LocalStorage mein current todos ko save karne ka function
  const saveToLocalStorage = () => {
    localStorage.setItem("todos", JSON.stringify(todos)); // Array ko string mein convert karke store kiya
  };

  // Kisi todo ko edit karne ke liye - pehle usko input mein laate hain, fir list se hata dete hain
  const handleEdit = (e, id) => {
    let t = todos.filter(item => item.id === id); // Id match karke us todo ko nikaala
    setTodo(t[0].todo); // Input box mein us todo ka text daala
    let newTodos = todos.filter(item => item.id !== id); // Baaki todos nikaale
    setTodos(newTodos); // State update
    saveToLocalStorage(); // LocalStorage update
  };

  // Todo ko delete karne ka function
  const handleDelete = (e, id) => {
    let newTodos = todos.filter(item => item.id !== id); // Delete ke liye matching id hata di
    setTodos(newTodos);
    saveToLocalStorage();
  };

  // Naya todo add karne ka function
  const handleAdd = () => {
    if (!todo.trim()) return; // Agar input empty hai toh kuchh bhi na kare
    setTodos([...todos, { id: uuidv4(), todo, isCompleted: false }]); // New todo object banake todos mein daala
    setTodo(""); // Input field ko empty kiya
    saveToLocalStorage(); // LocalStorage update
  };

  // Input box mein type hone par text ko state mein save karna
  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  // Checkbox click hone par todo complete/incomplete toggle karna
  const handleCheckbox = (e) => {
    let id = e.target.name;
    let index = todos.findIndex(item => item.id === id); // Index dhunda
    let newTodos = [...todos]; // Copy banayi
    newTodos[index].isCompleted = !newTodos[index].isCompleted; // Complete toggle kiya
    setTodos(newTodos);
    saveToLocalStorage();
  };

  return (
    <>
      <Navbar /> {/* Navbar component dikhaya gaya */}
      <div className="container mx-auto p-5 sm:p-10 bg-violet-100 rounded-2xl min-h-[80vh] w-full max-w-4xl shadow-2xl">
        <div className="addtodo mb-8">
          <h2 className="text-2xl font-bold mb-4 text-violet-900">Add a ToDo</h2>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              onChange={handleChange} // Jab input badle, state update ho
              value={todo} // Input ki value todo state se bind hai
              type="text"
              placeholder="Enter your task..."
              className="w-full sm:flex-1 bg-white p-3 rounded-md shadow border border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-600"
            />
            <button
              onClick={handleAdd} // Add button click hone par naya todo add hoga
              className="bg-violet-800 hover:bg-violet-950 p-3 px-6 text-white rounded-xl font-semibold shadow whitespace-nowrap"
            >
              Add
            </button>
          </div>
        </div>

        <h2 className="text-xl font-bold text-violet-900 mb-4">Your Todos</h2>
        <div className="todos space-y-4">
          {/* Agar koi todo nahi hai toh message dikhaye */}
          {todos.length === 0 && (
            <div className="font-bold text-center text-2xl text-gray-500 py-10">
              Nothing to Display
            </div>
          )}

          {/* Sabhi todos ko map karke render kiya jaa raha hai */}
          {todos.map(item => (
            <div
              key={item.id} // Unique key har todo ke liye
              className="todo flex flex-col sm:flex-row sm:items-center bg-white p-4 rounded-lg shadow hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start sm:items-center w-full gap-3">
                <input
                  name={item.id} // Checkbox ka name id se match karega
                  onChange={handleCheckbox} // Checkbox change hone par complete toggle
                  type="checkbox"
                  checked={item.isCompleted} // Checked true/false
                  className="h-5 w-5 accent-violet-800 shrink-0"
                />
                <div
                  className={`text-lg break-words flex-1 ${item.isCompleted ? "line-through text-gray-500" : "text-gray-800"}`}
                  style={{ wordBreak: "break-word", overflowWrap: "break-word" }} // Long text wrap ho jaye
                >
                  {item.todo} {/* Todo ka text dikhaya */}
                </div>
              </div>
              <div className="buttons mt-3 sm:mt-0 flex gap-3 sm:ml-4 justify-end">
                <button
                  onClick={(e) => handleEdit(e, item.id)} // Edit button
                  className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-1 rounded-lg font-medium whitespace-nowrap"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => handleDelete(e, item.id)} // Delete button
                  className="bg-red-600 hover:bg-red-800 text-white px-4 py-1 rounded-lg font-medium whitespace-nowrap"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App; // Component export kiya jaa raha hai
