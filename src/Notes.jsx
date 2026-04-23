import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useContext,
  useReducer
} from "react";

import { ThemeContext } from "./ThemeContext";
import { reducer, initialState } from "./NotesReducer";

function Notes() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");

  // edit states
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const inputRef = useRef();
  const { dark, setDark } = useContext(ThemeContext);

  // load notes
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("notes"));
    if (saved) {
      saved.forEach(n => dispatch({ type: "ADD", payload: n }));
    }
  }, []);

  // save notes
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(state.notes));
  }, [state.notes]);

  // filter notes
  const filtered = useMemo(() => {
    return state.notes.filter(n =>
      n.text.toLowerCase().includes(search.toLowerCase())
    );
  }, [state.notes, search]);

  // add note
  const addNote = useCallback(() => {
    if (!text) return;

    dispatch({
      type: "ADD",
      payload: { id: Date.now(), text, important: false }
    });

    setText("");
    inputRef.current.focus();
  }, [text]);

  return (
    <div className={`notes-app ${dark ? "dark" : "light"}`}>
      <div className="notes-container">
        <h1 className="notes-title">📝 Notes App</h1>

        <button className="notes-toggle" onClick={() => setDark(!dark)}>
          Toggle Theme
        </button>

        <br />
        <br />

        <input
          className="notes-search"
          placeholder="🔍 Search notes..."
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="notes-add-row">
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a note..."
            className="notes-input"
          />
          <button className="notes-add-button" onClick={addNote}>
            Add
          </button>
        </div>

        <div className="notes-grid">
          {filtered.map(n => (
            <div key={n.id} className="note-card">
              {editId === n.id ? (
                <>
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="note-edit-input"
                  />

                  <button
                    className="note-save-btn"
                    onClick={() => {
                      dispatch({
                        type: "EDIT",
                        payload: { id: n.id, text: editText }
                      });
                      setEditId(null);
                    }}
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <span
                    className={`note-text ${n.important ? "important" : ""}`}
                    onClick={() => dispatch({ type: "TOGGLE", payload: n.id })}
                  >
                    {n.text} {n.important ? "⭐" : ""}
                  </span>

                  <div className="note-actions">
                    <button
                      className="note-btn note-btn-edit"
                      onClick={() => {
                        setEditId(n.id);
                        setEditText(n.text);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="note-btn note-btn-delete"
                      onClick={() => dispatch({ type: "DELETE", payload: n.id })}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Notes;