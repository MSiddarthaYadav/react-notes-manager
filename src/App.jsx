import { ThemeProvider } from "./ThemeContext";
import Notes from "./Notes";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <Notes />
    </ThemeProvider>
  );
}

export default App;