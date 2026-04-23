export const initialState = { notes: [] };

export function reducer(state, action) {
  switch (action.type) {
    case "ADD":
      return { notes: [...state.notes, action.payload] };

    case "DELETE":
      return {
        notes: state.notes.filter(n => n.id !== action.payload)
      };

    case "TOGGLE":
      return {
        notes: state.notes.map(n =>
          n.id === action.payload ? { ...n, important: !n.important } : n
        )
      };
      case "EDIT":
  return {
    notes: state.notes.map(n =>
      n.id === action.payload.id
        ? { ...n, text: action.payload.text }
        : n
    )
  };

    default:
      return state;
  }
}