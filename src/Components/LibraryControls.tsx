import type {FilterStatus, SortDirection, SortField} from "../types";
type LibraryControlsProps = { //required information for the library controls for it to work
    filter: FilterStatus; 
    sortField: SortField;
    sortDirection: SortDirection;
    onFilterChange:(filter: FilterStatus)=> void;//function that is used when you change the filter in the app
    onSortFieldChange: (field: SortField) => void; //this is the function that changes what the books are sorted by when called too by the user
    onSortDirectionChange: (direction: SortDirection) => void; //now we use this when you change the order in which the filter is moving ascending or descending
};

function LibraryControls({ //this is where the filters and dropdown menues become actually usable
    filter, sortField, sortDirection, onFilterChange, onSortFieldChange, onSortDirectionChange
}:LibraryControlsProps){
    return (// for styling purposes border size and color, gray and white. Grid was also created for alignment purposes
        <section className="rounded border border-gray-200 bg-white p-3 dark:border-gray-750 dark:bg-gray-850">
            <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white"> 
                Filter and Sort
            </h2> 
        <div className="grid gap-2 sm:grid-cols-3"> 
            <label className="flex flex-col gap-1 text-sm text-gray-800 dark:text-gray-300">
                Filter
                <select value={filter} onChange={(event)=> onFilterChange(event.target.value as FilterStatus)}
                className="rounded border border-gray-200 bg-white px-2 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                    <option value="all">All</option>
                    <option value="to-read">To Read</option>
                    <option value="reading">Reading</option>
                    <option value= "finished">Finished</option>
                </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-300">
                Sort By {/*this piece consist of messing with the filter what is displayed how it changes what appears on change*/}
                <select value={sortField} onChange={(event)=>onSortFieldChange(event.target.value as SortField)}
                className="rounded border border-gray-300 bg-white px-2 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                    <option value="title">Title</option>
                    <option value="author">Author</option>
                    <option value="dateAdded">Date Added</option>
                </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-800 dark:text-gray-300">
                Direction {/*this section is all about the direction in which the sorting is taking place either descending or ascending and the values that appear accordingly*/}
                <select value={sortDirection} onChange={(event)=> onSortDirectionChange(event.target.value as SortDirection)}
                className="rounded border border-gray-300 bg-white px-2 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </label>
        </div>
        </section>
    );
}

export default LibraryControls;