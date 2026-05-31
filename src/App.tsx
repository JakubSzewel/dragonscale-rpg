import { useState, useCallback } from "react";
import CharacterSheet from "./components/CharacterSheet";
import { newCharacter } from "./data/newCharacter";
import { Character } from "./types";
import "./index.css";
import useLocalStorage from "./hooks/useLocalStorage";

const App = () => {
  const [characters, setCharacters] = useLocalStorage<Character[]>(
    "dragonscale-characters",
    [newCharacter("Bohater")]
  );
  const [activeId, setActiveId] = useLocalStorage<number>(
    "dragonscale-active-id",
    characters[0]?.id ?? 0
  );
  const [editingNameId, setEditingNameId] = useState<number | null>(null);

  const activeChar = characters.find(c => c.id === activeId);

  const updateChar = useCallback((updated: Character) => {
    setCharacters(cs => cs.map(c => c.id === updated.id ? updated : c));
  }, []);

  const addChar = () => {
    const c = newCharacter("Nowa Postać");
    setCharacters(cs => [...cs, c]);
    setActiveId(c.id);
  };

  const removeChar = (id: number) => {
    const updated = characters.filter(c => c.id !== id);
    setCharacters(updated);
    if (activeId === id && updated.length > 0) {
      setActiveId(updated[0].id);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-title">
          <img src={'../public/dragonscale.png'} sizes="sm" height={50}/>
          <span>DragonScale</span>
        </div>
        <nav className="char-tabs">
          {characters.map(c => (
            <div key={c.id} className={`char-tab ${c.id === activeId ? "active" : ""}`}>
              {editingNameId === c.id ? (
                <input
                  autoFocus
                  className="tab-name-input"
                  value={c.name}
                  onChange={e => setCharacters(cs =>
                    cs.map(ch => ch.id === c.id ? { ...ch, name: e.target.value } : ch)
                  )}
                  onBlur={() => setEditingNameId(null)}
                  onKeyDown={e => e.key === "Enter" && setEditingNameId(null)}
                />
              ) : (
                <span
                  onClick={() => setActiveId(c.id)}
                  onDoubleClick={() => setEditingNameId(c.id)}
                >
                  {c.name}
                </span>
              )}
              {characters.length > 1 && (
                <button
                  className="tab-close"
                  onClick={e => { e.stopPropagation(); removeChar(c.id); }}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button className="add-char-btn" onClick={addChar}>+</button>
        </nav>
      </header>

      <main className="app-main">
        {activeChar && (
          <CharacterSheet key={activeChar.id} char={activeChar} onUpdate={updateChar} />
        )}
      </main>
    </div>
  );
};

export default App;