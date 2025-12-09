import { useEffect, useRef, useState } from "react";
import "./App.css";
import { url } from "./api/constants";

import RecentSearch from "./components/RecentSearch";
import QuestionAnswer from "./components/QuestionAnswer";

function App() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);
  const [recentHistory, setRecentHistory] = useState(
    JSON.parse(localStorage.getItem("history"))
  );
  const [loader, setLoader] = useState(false);
  const scrollToAns = useRef();
  useEffect(() => {
    if (scrollToAns.current) {
      scrollToAns.current.scrollTop = scrollToAns.current.scrollHeight;
    }
  }, [result]);

  const handleAskQuery = async (customQuery) => {
    let finalQuery = (customQuery || query).trim();
    if (!finalQuery) return;

    setQuery("");

    let history = recentHistory || [];
    if (
      !history.some((item) => item.toLowerCase() === finalQuery.toLowerCase())
    ) {
      history = [finalQuery, ...history];
    }
    history = history.slice(0, 20);
    localStorage.setItem("history", JSON.stringify(history));
    setRecentHistory(history);

    try {
      setLoader(true);
      const response = await fetch(
        `${url}?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: finalQuery }],
              },
            ],
          }),
        }
      );
      const data = await response.json();
      console.log("API DATA", data);

      let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      let arr = text.split("* ").map((item) => item.trim());

      setResult((prev) => [
        ...prev,
        { type: "q", text: finalQuery },
        { type: "a", text: arr },
      ]);
    } catch (error) {
      console.log("API ERROR:", error);
    } finally {
      setLoader(false);
    }
  };

  const isEnter = (e) => {
    if (e.key === "Enter") {
      handleAskQuery();
    }
  };
  const [darkMode, setDarkMode] = useState("dark");
  useEffect(() => {
    if (darkMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className={darkMode === "dark" ? "dark" : "light"}>
      <div className="grid grid-cols-5 h-screen text-center">
        <select
          onChange={(e) => {
            setDarkMode(e.target.value);
          }}
          className="fixed bottom-5 left-5 p-2 bg-zinc-700 text-white rounded"
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
        <RecentSearch
          recentHistory={recentHistory}
          setRecentHistory={setRecentHistory}
          handleAskQuery={handleAskQuery}
        />
        <div className="col-span-4 p-10">
          <h1 className="text-4xl bg-clip-text text-transparent bg-gradient-to-r from-pink-700 to-violet-700">
            Hello User, Ask me Anything
          </h1>
          {loader ? (
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
          ) : null}
          <div className="container h-110 overflow-scroll" ref={scrollToAns}>
            <div className="dark:text-zinc-300 text-zinc-800">
              <ul>
                {result.map((item, index) => (
                  <QuestionAnswer item={item} index={index} key={index} />
                ))}
              </ul>
            </div>
          </div>
          <div className="dark:bg-zinc-800 bg-red-100 w-1/2 dark:text-white text-zinc-800 m-auto p-1 pr-5 rounded-4xl border border-zinc-700 flex h-16">
            <input
              type="text"
              className="w-full h-full p-3 outline-none"
              placeholder="Ask me anything"
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              value={query}
              onKeyDown={isEnter}
            />
            <button onClick={handleAskQuery}>Ask</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
