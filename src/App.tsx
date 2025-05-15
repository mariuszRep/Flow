import Editor from "./components/Editor";
import './App.css';

function App() {
  return (
    <div className="w-full h-screen flex flex-col">
      <header className="bg-gray-800 text-white px-4 py-2 flex items-center">
        <h1 className="text-xl font-bold">React Flow Editor</h1>
      </header>
      <main className="flex-1 w-full">
        <Editor />
      </main>
    </div>
  );
}

export default App;
