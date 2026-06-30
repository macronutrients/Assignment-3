import {useState} from "react"; //an attempt to gather memory for the file on user actions
import type {FormEvent} from "react"; //further information for the file like telling it that its a form that also came from the user and should be remembered

type SearchBarProps = {//list out what we need for searchbar when it is used by onsearch
    onSearch: (query: string) => void;
};

function SearchBar({onSearch}: SearchBarProps){//creates the actual searchbar and stores what the user tells it too
    const [input, setInput] = useState("");

    function handleSubmit(event: FormEvent<HTMLFormElement>){// this function stops the page from refreshing when their is a form that is sumbitted and it handles it activates when their is a form that is submitted. 
        event.preventDefault();//what actually stops the refreshing
        const trimmedInput = input.trim(); //deals with formatting like the extra spaces that we don't need

    if(trimmedInput.length > 0){ //did the user type anything? question is answered here
        onSearch(trimmedInput);
    }
    }
    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <input type = "text" value={input} onChange= {(event) => setInput(event.target.value)}
            placeholder="Search for a book"
            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white"/>
            <button type ="submit" className="rounded bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700">
                Search
            </button>
        </form> /*creates the form and handles it once its submitted*/
    );
}

export default SearchBar;