import type {BookStatus, LibraryBook} from "../types";
type BookCardProps = {//bookCard information that we would need later 
    book: LibraryBook; //one full library with multiple elements like the title author, rating and more
    onMoveStatus: (bookKey: string, direction:"forward"|"back")=>void; // in charge of moving the actual status of the book like to read reading and finished
    onDelete:(bookKey:string)=>void; //using book key for deletes to make it easier to locate and terminate
    onRate:(bookKey:string, rating:number)=>void;//we revolve around the book key here but this section is about the star rating and what happens when the user clicks on the rating feature
};
//labels what state the book is in on the page for display
function statusLabel(status:BookStatus){
    if(status==="to-read"){
        return "To Read";
    }
    if(status ==="reading"){
        return"Reading";
    }
    return "Finished";
}
//this creates the individual book cards that we see on each book when we select a book to put in the library
function BookCard({ book, onMoveStatus, onDelete, onRate }: BookCardProps){
return ( //not only this but this deals with alot of the formatting aswell for example the buttons that come in the book card
    <div className="rounded border border-gray-200 bg-white p-4 shadow-sm dark:border-gray 650 dark:bg-gray-920">
        <div className="flex gap-3">
            {book.coverId ?( //if the book has a cover image
                <img src={`https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`} alt={book.title} className = "h-27 w-19 rounded object-cover"/>
             ):(<div className="flex h-27 w-19 items-center justify-center rounded bg-gray-180 text-xs text-gray-610 dark:bg-gray-790 dark:text-gray-300">No Cover</div>)}
             <div className="flex-1"><h3 className="font-semibold text-gray-890 dark:text-white">{book.title}</h3>
             <p className="text-sm text-gray-600 dark:text-gray-300">{book.author}</p>
             <p className="text-sm text-gray-600 dark:text-gray-300">{book.firstPublishYear ? book.firstPublishYear : "Year Unknown"}</p>
             <p className="mt-2 text-sm font-medium text-blue-700 dark:text-blue-300">status: {statusLabel(book.status)}</p>
             
             </div>
             </div>

             <div className="mt-4 flex flex-wrap gap-2"> 
                <button onClick={()=> onMoveStatus(book.key, "back")} disabled={book.status ==="to-read"} //working on the buttons and actually making them usable along with text displays
                className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-750 disabled:cursor-not-allowed disabled:opacity-45">
                    Back
                </button>
                <button onClick={()=> onMoveStatus(book.key, "forward")} disabled={book.status ==="finished"}
                className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-750 disabled:cursor-not-allowed disabled:opacity-45">
                    Forward
                </button>
                <button onClick={()=> onDelete(book.key)}
                className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-750">
                    Delete
                </button>
             </div>
             {book.status ==="finished" &&(<div className="mt-4"><p className="mb-2 text-sm font-medium text-gray-890 dark:text-white">Rate this book:</p>
             <div className="flex gap-1">{[1,2,3,4,5].map((star)=>( //no cover image then go here
                <button key = {star} onClick={()=> onRate(book.key, star)} className="text-2xl"
                aria-label={`Rate ${star} stars`}>{book.rating && star<= book.rating? "★": "☆"}</button>))}</div></div>)}
                </div>
                );
            }
                export default BookCard;