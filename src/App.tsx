import {useEffect, useMemo, useReducer, useState} from "react"; //react tools needed for saving the state of the site for the bookcard
import BookCard from "./Components/BookCard"; //this allows us to grab the bookcard components
import LibraryControls from "./Components/LibraryControls"; //grabs the filter and sort dropdown menue
import SearchBar from "./Components/SearchBar"; // grabs the actual searchbar
import SearchResults from "./Components/SearchResults";// allows us to get the search results that were presented
import StatsBar from "./Components/StatsBar";//reading counts and average rating is what is shown here in the stats bar that we grab
import type{ //this gets the type of all of the things that have been listed so that typscript knows what its dealing with
  ApiResponse, BookStatus, FilterStatus, LibraryBook, SearchBook, SortDirection, SortField} from"./types";

  type LibraryAction = | {type: "add";book:SearchBook} //creates the commands that the library is allowed to use doesn't display yet
|{type: "delete"; key: string}
| {type: "move"; key:string; direction: "forward"| "back"}
|{type: "rate"; key:string; rating: number};

const statusOrder: BookStatus[] = ["to-read", "reading", "finished"]; //order of the book movement saved here

function loadLibrary(): LibraryBook[]{ //gets the saved library from the local code when the page is refreshed or when something happens to the page when it can.
  try{
    const savedLibrary = localStorage.getItem("reading-library");

    if(!savedLibrary) {
      return[];
    }
    return JSON.parse(savedLibrary) as LibraryBook[];} catch { //keeping the library array format
      return [];} //empty library no crash
    }
    function loadDarkMode():boolean { //going back into load storage again but this time for the saved preset of what darkmode is supposed to look like along with carrying the rest of the information that the site already had
      try {
        const savedTheme = localStorage.getItem("reading-theme");
        return savedTheme === "dark";
      }
      catch{
        return false;
      }
    }

    function libraryReducer(library: LibraryBook[],action: LibraryAction){//this is the changer it controls all of the ways that the library can change in when they are changing.
      if(action.type === "add"){ //we can add by checking that this is what the user is really trying to do in the first place.
        const alreadyExists = library.some((book) =>book.key === action. book.key);
      
      if(alreadyExists){
return library;
      }
      const newBook:LibraryBook = {
        ...action.book, status: "to-read", rating: null, dateAdded: new Date().toISOString()
      };
      return[...library, newBook];
    }

    if(action.type ==="delete"){ //delete by checking that that is what the user is really tring to do first. 
      return library.filter((book)=>book.key !==action.key);
    }
    if(action.type==="move"){ // and move the books by checking if that is what is realy trying to be done. 
      return library.map((book)=>{
        if (book.key!==action.key){
          return book;
        }
        const currentIndex = statusOrder.indexOf(book.status);
        const nextIndex = action.direction ==="forward" ?currentIndex+1: currentIndex - 1;
        if(nextIndex < 0|| nextIndex >= statusOrder.length){
          return book;
        }
        const nextStatus = statusOrder[nextIndex];

        return {
          ...book,
          status: nextStatus,
          rating: nextStatus ==="finished" ? book.rating: null
        };

      });
    }

    if(action.type ==="rate"){ //this is the rating section of the book by first checking if the action that is really trying to be complete is indeed rate a book, then it makes sure that its the right book. 
      return library.map((book) => {
        if(book.key !== action.key) {
          return book;
        }
        if(book.status !=="finished"){ //needs to be finished to allow the user to rate it and for it to pop up
          return book;
        }

        return {
          ...book, rating: action.rating
        };
      });
    }
    return library; //if the action doesn't match anything then it returns everything without any changes
  }

  function App(){ //this is the section that puts the whole reading tracker really togther with its function calls many of whom are listed below 
    const [library, dispatch] = useReducer(libraryReducer, [], loadLibrary);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchBook[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchError, setSearchError] = useState("");
    const [message, setMessage] = useState("");
    const [filter, setFilter] = useState<FilterStatus>("all");
    const [sortField, setSortField] = useState<SortField>("dateAdded");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
    const [darkMode, setDarkMode] = useState(loadDarkMode);

    useEffect(() =>{ //we are running this when we see that the local library has changed
      localStorage.setItem("reading-library",JSON.stringify(library));
    }, [library]);
    useEffect(()=>{
      localStorage.setItem("reading-theme", darkMode? "dark":"light");
    }, [darkMode]);

    useEffect(()=>{
      if(query===""){
        setResults([]); setSearchError("");setLoading(false);
        return;
      }
      const controller = new AbortController();

      async function fetchBooks(){ //using the open book API search for the books
        try {
          setLoading(true);
          setSearchError("");

          const response = await fetch(
            `https://openlibrary.org/search.json?q=${encodeURIComponent( //our method source
            query
          )}&limit=10`, { signal: controller.signal}
          );

          if(!response.ok){
            throw new Error("The book search failed.");//it is possible to not find a book if the library doesn't have it or if nonsense was written
          }
          const data = (await response.json()) as ApiResponse;

          const mappedBooks: SearchBook[] = data.docs.map((book)=> ({ //gathers all of the information of said book if it is found
            key: book.key ?? crypto.randomUUID(),
            title: book.title?? "Untitled",
            author: book.author_name?.[0]?? "Unknown author",
            firstPublishYear: book.first_publish_year?? null, coverId: book.cover_i ?? null
          }));
          setResults(mappedBooks);
        }catch(error){
          if(error instanceof DOMException&& error.name ==="AbortError") {
            return;
          }

          setSearchError("Could not load books. Please try again.")
        }
finally {
  setLoading(false); //turns off the loading
}
      }
fetchBooks(); //here we are running the book search function
return ()=>{ //this is a sort of clean up as it runs before the next search
  controller.abort();
};
    },[query]);
    function handleAddBook(book:SearchBook){ //if the user wants to add to the library then this is one of the functions that will run
      const alreadyExists = library.some((librarybook) => librarybook.key === book.key); // base case is it already their or what
      if (alreadyExists){
        setMessage("That book is already in your library."); //if so print this message
        return;
      }
      dispatch({type: "add", book});
      setMessage("Book added to your library.");
    }
    const visibleLibrary = useMemo(()=> { //the visible library means the filtered and sorted library that the user actually wants to see
      let books = [...library];

      if (filter!=="all"){ //checking and dealing with the filters that the user wanted
        books = books.filter((book)=>book.status ===filter);
      }

      books.sort((firstBook, secondBook) =>{ //filtering options and methods to organize the books that were selected with some of the information of the books given to use to sort it
        let firstValue = "";
        let secondValue="";
        if(sortField ==="title"){
          firstValue = firstBook.title.toLowerCase();
          secondValue = secondBook.title.toLowerCase();
        }
        if(sortField ==="author"){
          firstValue = firstBook.author.toLowerCase();
          secondValue = secondBook.author.toLowerCase();
        }
        if(sortField ==="dateAdded"){
          firstValue = firstBook.dateAdded;
          secondValue = secondBook.dateAdded;
        }

        if(firstValue < secondValue){
          return sortDirection ==="asc"?-1:1;
        }
        if(firstValue>secondValue) {
          return sortDirection ==="asc" ? 1:-1;
        }
        return 0;
      });
      return books; // the filtered and sorted library finally for real
    }, [library, filter, sortField, sortDirection]);
    return(
      <div className={darkMode ? "dark" : ""}> {/*gives us the dark mode version of the site*/}
        <main className="min-h-screen bg-gray-100 px-4 py-6 text-gray-800 dark:bg-gray-950 dark:text-white">
          <div className="mx-auto max-w-6xl">
            <header className="mb-6 rounded border border-gray-200 bg-white p-5 dark:border-gray-600 dark:bg-gray-800">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold">Reading Tracker</h1>
                  <p className="mt-1 text-gray-600 dark:text-gray-200">
                    Search for books and track your reading progress. {/*small text that would appear under the title*/}
                  </p>
                </div>
                <button onClick={()=> setDarkMode((current)=>!current)} /*this is what happens when you actually click the dark mode button but the sytling size color and color changes are below*/
                className="rounded bg-purple-700 px-4 py-2 text-white hover:bg-purple-800 dark:bg-gray-200 dark:text-gray-800 dark:hover:bg-gray-300">
                  {darkMode?"Light Mode":"Dark Mode"}
                </button>
              </div>
            </header>
            <section className="mb-6 rounded border border-gray-200 bg-white p-4 dark:border-gray-600 dark:bg-gray-900">
              <h2 className="mb-3 text-xl font-semibold">Search Books</h2> {/*this creates the actual search books box size coloring*/}
              <SearchBar onSearch={setQuery}/> 
              {message && (
                <p className="mt-3 rounded bg-blue-50 p-2 text-sm text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                  {message}
                </p>
              )}
            </section>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="flex flex-col gap-6">
                <SearchResults results={results} loading={loading} error={searchError} onAddBook={handleAddBook}/>
                <StatsBar books={library} />

                <LibraryControls filter={filter} sortField={sortField} sortDirection = {sortDirection}
                onFilterChange={setFilter}
                onSortFieldChange={setSortField}
                onSortDirectionChange={setSortDirection}/>
              </div>
              <section className="rounded border border-gray-200 bg-white p-4 dark:border-gray-600 dark:bg-gray-800">
                <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white"> {/*this is where the library box on the right is created formated and styled*/}
                  My Library
                </h2>

                {visibleLibrary.length ===0?(
                  <p className="rounded bg-gray-100 p-4 text-gray-600 dark:bg-gray-800 dark:text-gray-200">
                   No books to show. Search for a book and add it to your library.
                  </p>
                ): (//this is what it runs when their are no books to show
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    {visibleLibrary.map((book)=>(
                      <BookCard key={book.key} book= {book} onMoveStatus={(key,direction) => 
                        dispatch ({type:"move", key, direction})
                      }
                      onDelete={(key) => dispatch ({type: "delete", key})}//allows the bookcard to delete this book
                      onRate={(key,rating)=>//as you would expect bookcard is now allowing for the rating to take place here
                        dispatch ({type:"rate",key, rating})
                      }/>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        </main>
      </div>
    );

  }

export default App; //allows the use of this app in the main.tsx file that we will inevitably use