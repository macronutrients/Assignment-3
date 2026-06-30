export type BookStatus = "to-read" |"reading"| "finished"; //creates the only options that the books is allowed to have as a status

export type SearchBook = {//the information that the book from the search results should have
    key:string;
    title:string;
    author:string;
    firstPublishYear:number|null;
    coverId: number|null;
};

export type LibraryBook = SearchBook&{ //so here we start with searchbook but then we tak on some extra information
    status: BookStatus;
    rating: number|null;
    dateAdded:string;
};

export type ApiBook = { // this section gives us an idea of what a book from the library that we used as our source might look like.
    key?: string;
    title?: string;
    author_name?:string[];
    first_publish_year?:number;
    cover_i?:number;
};

export type ApiResponse = { // and this is the response that comes back from the library when tugging on its books
    docs: ApiBook[];
};
// and here we ofcourse have our options filter sort direction and regular sorting like date author title 
export type FilterStatus = "all"|BookStatus; 
export type SortField = "title" | "author" | "dateAdded";
export type SortDirection = "asc" | "desc";

