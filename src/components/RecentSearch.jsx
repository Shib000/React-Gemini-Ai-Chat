import React from "react";

const RecentSearch = ({ recentHistory, setRecentHistory, handleAskQuery }) => {
  const clearHistory = () => {
    localStorage.clear();
    setRecentHistory([]);
  };
  const deleteSingleItem = (deleteItem) => {
    const updatedHistory = recentHistory.filter(
      (item) => item.toLowerCase() !== deleteItem.toLowerCase()
    );
    localStorage.setItem("history", JSON.stringify(updatedHistory));
    setRecentHistory(updatedHistory);
  };
  return (
    <>
      <div className="col-span-1 dark:bg-zinc-800 bg-red-100 pt-3">
        <h1 className="text-xl dark:text-white text-zinc-800 flex text-center justify-center">
          <span>Recent Search</span>
          <button className="cursor-pointer" onClick={clearHistory}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#e3e3e3"
            >
              <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
            </svg>
          </button>
        </h1>
        <ul className="mt-2 text-left overflow-auto">
          {recentHistory &&
            recentHistory.map((item, index) => (
              <li
                key={index}
                className="px-5 py-2 flex items-center justify-between dark:text-zinc-400 text-zinc-700 cursor-pointer dark:hover:bg-zinc-700 dark:hover:text-zinc-200 hover:bg-red-200 hover:text-zinc-800"
                onClick={() => handleAskQuery(item)}
              >
                <span className="truncate w-[80%]">{item}</span>

                <button
                  className="text-red-500 hover:text-red-700 font-bold ml-3 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSingleItem(item);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="18px"
                    viewBox="0 -960 960 960"
                    width="18px"
                    fill="red"
                  >
                    <path
                      d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186
                       698.85-165T648-144H312Zm336-552H312v480h336v-480Zm-264 384h72v-336h-72v336Zm120 0h72v-336h-72v336Z"
                    />
                  </svg>
                </button>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
};

export default RecentSearch;
