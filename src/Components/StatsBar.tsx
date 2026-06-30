import type {LibraryBook} from "../types";// this is basically like the other files telling typescript how a library book should look like.

type StatsBarProps = { //information sent into the stats bar
    books: LibraryBook[]; //now this is the full list of books in the library
};

function StatsBar({books}: StatsBarProps){ //stats section created using the sent books ofcourse
    const toReadCount = books.filter((book)=> book.status ==="to-read").length; //each describe the # of books in each category and lists it
    const readingCount= books.filter((book)=>book.status === "reading").length;
    const finishedBooks = books.filter((book)=> book.status === "finished");
    const finishedCount = finishedBooks.length;
    const ratedBooks = finishedBooks.filter((book)=>book.rating!==null);
    const averageRating=ratedBooks.length===0?"No ratings yet":(ratedBooks.reduce((total, book)=> total +(book.rating?? 0), 0)/ratedBooks.length).toFixed(1);

    return ( //here we get another outside box but this time it is for the reading stats, and below is all the shapes and colors that will be used for this box.
        <section className="rounded border border-gray-200 bg-white p-4 dark:border-gray-600 dark:bg-gray-800">
            <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                Reading Stats 
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
                {toReadCount} to read , {readingCount} reading , {finishedCount} finished 
            </p>
            <p className="text-gray-800 dark:text-gray-300">
                Average rating: {averageRating}</p>

        </section>
    );
}

export default StatsBar //this line is what allows this stats bar to be used in another file