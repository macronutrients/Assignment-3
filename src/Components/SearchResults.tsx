import type {SearchBook} from "../types"; //here we get the type that we need so that we know what a searched book should look like

type SearchResultsProps = {//same as before the information that is required in order to complete search results and searchbook
    results: SearchBook[];
    loading: boolean;
    error: string;
    onAddBook: (book: SearchBook)=> void; //the actual function that search results uses
};

function SearchResults({ // this function makes the actual section that shows the results, 
    results, loading, error, onAddBook 
}: SearchResultsProps){
    if(loading){ //this line checks if were actually looking for books at this point
        return(<section className="reounded border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <p className="text-gray-700 dark:text-gray-300">Searching...</p>
        </section>);
    }
    if(error){ // here we check if their is an error message in the search
        return ( //formatting found below for what is actually displayed
            <section className="rounded border border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900">
                <p className="text-red-600 dark:text-red-100">{error}</p>
            </section>
        );
    }

    if(results.length===0){ //the result if their are no search results to even show
        return(//text along with formatting color width height distance from
            <section className="rounded border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                <p className="text-gray-700 dark:text-gray-200">Search results will appear here.
                </p> 
            </section>
        );
    }
    return(<section className="rounded border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
            Search Results
        </h2> {/*the outside box of the search results can be found/customized here*/}
        <div className="grid gap-2 md:grid-cols-2">
            {results.map((book)=>(
                <div key={book.key}
                className="flex gap-2 rounded border border-gray-300 p-3 dark_border-gray-800">
                    {book.coverId?(
                        <img
                        src={`https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`}
                        alt ={book.title}
                        className="h-24 w-16 rounded object-cover"/>
                    ):(
                        <div className="flex h-26 w-17 items-center justify-center rounded bg-gray-300 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                            No Cover </div>
                    )}
                    <div className="flex flex-1 flex-col justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                {book.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                {book.author}
                            </p>

                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                {book.firstPublishYear ? book.firstPublishYear: "year unkown"}

                                </p>

                        </div>
                        <button onClick={()=>onAddBook(book)} //deals with the colors and the size of the addbook button below and the actual pressing of the button is on this line
                        className="mt-2 rounded bg-green-600 px-3 py-1 text-sm font-medium text-white hover:gb-green-800">
                            Add to Library
                        </button>

                    </div>
                    </div>
            ))}
            </div>
    </section>);
}

export default SearchResults;