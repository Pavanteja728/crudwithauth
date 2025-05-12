import {render,screen,fireEvent, waitFor} from "@testing-library/react"
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import Movie from "./Movie"

test('user title', async() => {
    render(<Movie />);
    await userEvent.click(screen.getByRole("button", { name: /add new movie/i }));
    const input = screen.getByPlaceholderText("Title");
    
    expect(input).toBeInTheDocument();
    
  });
  
test("releaseDate", async()=>{
    render(<Movie/>)
    await userEvent.click(screen.getByRole("button", { name: /add new movie/i }));
    const input=screen.getByTestId("release-date-input")
   
    expect(input).toBeInTheDocument();
    
})

test("Genre", async()=>{
    render(<Movie/>)
    await userEvent.click(screen.getByRole("button", { name: /add new movie/i }));
    const input=screen.getByPlaceholderText("Genre")
    
    expect(input).toBeInTheDocument();
})

test("Director", async()=>{
    render(<Movie/>)
    await userEvent.click(screen.getByRole("button", { name: /add new movie/i }));
    const input=screen.getByPlaceholderText("Director")
    
    expect(input).toBeInTheDocument();
})


test("Rating", async()=>{
    render(<Movie/>)
    await userEvent.click(screen.getByRole("button", { name: /add new movie/i }));
    const input=screen.getByPlaceholderText("Rating")
    
    expect(input).toBeInTheDocument();
})

test("Duration", async()=>{
    render(<Movie/>)
    await userEvent.click(screen.getByRole("button", { name: /add new movie/i }));
    const input=screen.getByPlaceholderText("Duration")
    
    expect(input).toBeInTheDocument();
})

test("Actors", async()=>{
    render(<Movie/>)
    await userEvent.click(screen.getByRole("button", { name: /add new movie/i }));
    const input=screen.getByPlaceholderText("Actors (name-role)")
   
    expect(input).toBeInTheDocument();
})

test("form submission", async()=>{
    render(<Movie/>)
    await userEvent.click(screen.getByRole("button", { name: /add new movie/i }));
    const input1 = screen.getAllByRole("textbox");
    const dateInput = screen.getByTestId("release-date-input"); 
    const numberInput = screen.getByRole("spinbutton"); 
    
    expect(input1).toHaveLength(5);
    expect(dateInput).toBeInTheDocument();
  expect(numberInput).toBeInTheDocument();

})



test("the search input should be", async()=>{
    render(<Movie/>)
    const input = screen.getByPlaceholderText("Search Movie by Title");
    await userEvent.type(input,"Inception")
    expect(input.value).toBe("Inception");
    

})

test("the search input should be", async()=>{
    render(<Movie/>)
    //const input = screen.getByPlaceholderText("Search Movie by Title");
    const btn = screen.getByRole('button',{name:/search/i});
    expect(btn).toBeInTheDocument();
    

})



  test("fetches and displays all movies", async () => {
    const mockMovies = [
      {
        title: "Inception",
        director: "Nolan",
        genre: "Action",
        rating: 5,
        duration: "02:30:00",
        releaseDate: "2025-01-01T00:00:00",
        actors: [{ name: "Dhoni", role: "Cricket" }],
        uniqueName: "some-uuid"
      }
    ];

    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockMovies),
      })
    );

    render(<Movie />);

    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/GetAllMovies"));
    await screen.findByText("Inception"); 
  });





// test("The form should be submitted correctly", async () => {
//   const mockSubmit = jest.fn();
//   render(<Movie onSubmitProp={mockSubmit} />);

//   const [titleInput, directorInput, durationInput, actorsInput, genreInput] =
//     screen.getAllByRole("textbox");

//   const dateInput = screen.getByTestId("release-date-input");
//   const ratingInput = screen.getByPlaceholderText("Rating");
//   const submitButton = screen.getByRole("button", { name: /add movie/i });

//   // Fill out the form
//   await userEvent.type(titleInput, "Inception");
//   await userEvent.type(directorInput, "Nolan");
//   await userEvent.type(durationInput, "03:00:00");
//   await userEvent.type(actorsInput, "Dhoni-Cricketer");
//   await userEvent.type(genreInput, "Action");
//   await userEvent.type(ratingInput, "5");
//   await userEvent.type(dateInput, "2025-04-14");

//   // Submit the form
//   await userEvent.click(submitButton);

//   // Check that handleSubmit was called with expected form data
//   expect(mockSubmit).toHaveBeenCalledWith({
//     title: "Inception",
//     directorName: "Nolan",
//     duration: "03:00:00",
//     actors: "Dhoni-Cricketer",
//     genre: "Action",
//     rating: "5",
//     releaseDate: "2025-04-14",
//   });
// });


// test("Movie component is correctly rendering",()=>{
//   render(<Movie/>)

//   expect(screen.getByRole("form")).toBeInTheDocument();
//   expect(screen.getAllByRole("textbox")).toBeInTheDocument();
//   expect(screen.getByTestId('release-date-input')).toBeInTheDocument();
//   expect(screen.getByPlaceholderText("Rating")).toBeInTheDocument();
//   expect(screen.getByPlaceholderText("Search Movie by Title")).toBeInTheDocument();
// })


test("Updates search title dynamically",()=>{
  render(<Movie/>)
  const searchInput=screen.getByPlaceholderText("Search Movie by Title");
  fireEvent.change(searchInput,{target:{value:"Inception"}})
  expect(searchInput.value).toBe("Inception");
})



test("Movie Management is present in the document",()=>{
  render(<Movie/>)
  const head=screen.getByText("Movie Management App");
  expect(head).toBeInTheDocument();
})





test('user title', async() => {
  render(<Movie />);
  await userEvent.click(screen.getByRole("button", { name: /add new movie/i }));
  const input = screen.getByPlaceholderText("Title");
  await userEvent.type(input, 'Avengers');
 
  expect(input.value).toBe('Avengers');
});

test("releaseDate", async()=>{
  render(<Movie/>)
  await userEvent.click(screen.getByRole("button", { name: /add new movie/i }));
  const input=screen.getByTestId("release-date-input")
  await userEvent.type(input,"2025-01-04");
  
  expect(input.value).toBe("2025-01-04");
})

test("Genre", async()=>{
  render(<Movie/>)
  await userEvent.click(screen.getByRole("button", { name: /add new movie/i }));
  const input=screen.getByPlaceholderText("Genre")
  await userEvent.type(input,"Action")
  expect(input.value).toBe("Action");
})

test("Director", async()=>{
  render(<Movie/>)
  await userEvent.click(screen.getByRole("button", { name: /add new movie/i }));
  const input=screen.getByPlaceholderText("Director")
  await userEvent.type(input,"Cameroon")
  expect(input.value).toBe("Cameroon");
})


test("Rating", async()=>{
  render(<Movie/>)
  await userEvent.click(screen.getByRole("button", { name: /add new movie/i }));
  const input=screen.getByPlaceholderText("Rating")
  await userEvent.type(input,"5")
  expect(input.value).toBe("5");
})

test("Duration", async()=>{
  render(<Movie/>)
  await userEvent.click(screen.getByRole("button", { name: /add new movie/i }));
  const input=screen.getByPlaceholderText("Duration")
  await userEvent.type(input,"03:00:00")
  expect(input.value).toBe("03:00:00");
})

test("Actors", async()=>{
  render(<Movie/>)
  await userEvent.click(screen.getByRole("button", { name: /add new movie/i }));
  const input=screen.getByPlaceholderText("Actors (name-role)")
  await userEvent.type(input,"Robert Downwey Jr-Iron Man")
  expect(input.value).toBe("Robert Downwey Jr-Iron Man");
})








// test('displays title from API', async () => {
//   render(<Movie />);

//   // Wait until at least one row appears in the table
//   const rows = await screen.findAllByRole('row'); // includes header + data rows

//   // Find a cell with "Inception" in it
//   const titleCell = await screen.findByText("Inception");

//   screen.debug(); // shows current DOM in terminal


//   expect(titleCell).toBeInTheDocument();
// });

global.fetch = jest.fn();

describe("Movie Management App", () => {
  test("should fetch and display all movies on load", async () => {
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          movieCode: '1',
          title: 'Inception',
          releasedDate: '2010-07-16',
          genre: { genreName: 'Sci-Fi' },
          director: { directorName: 'Christopher Nolan' },
          rating: 8.8,
          duration: '148 minutes',
          actors: [{ name: 'Leonardo DiCaprio', roleType: 'Main' }],
        },
      ],
    });


    render(<Movie />);


    await waitFor(() => expect(screen.getByText('Inception')).toBeInTheDocument());

    expect(screen.getByText('Inception')).toBeInTheDocument();
    expect(screen.getByText('Sci-Fi')).toBeInTheDocument();
    expect(screen.getByText('Christopher Nolan')).toBeInTheDocument();
    expect(screen.getByText('8.8')).toBeInTheDocument();
    expect(screen.getByText('148 minutes')).toBeInTheDocument();
    expect(screen.getByText('Leonardo DiCaprio (Main)')).toBeInTheDocument();

  });


  test("should handle API failure gracefully", async () => {
    
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Failed to fetch data" }),
    });

    render(<Movie />);

    await waitFor(() => expect(screen.getByText("No movies found.")).toBeInTheDocument());
  });
});

  
    
  




beforeEach(() => {
  global.fetch = jest.fn(); 
});

// test("should not display all movies table if search result is present", async () => {
//   // Mock for initial fetchMovies (GetAllMovies)
//   fetch.mockResolvedValueOnce({
//     ok: true,
//     json: async () => [
//       {
//         movieCode: "Dummy-1",
//         title: "Dummy Movie",
//         releasedDate: "2022-01-01",
//         genre: { genreName: "Drama" },
//         director: { directorName: "Jane Doe" },
//         rating: 7.5,
//         duration: "02:00:00",
//         actors: [{ name: "Actor A", roleType: "Supporting" }],
//       },
//     ],
//   });

//   render(<Movie />);

//   // Mock for search fetch (GetMovieByTitle)
//   fetch.mockResolvedValueOnce({
//     ok: true,
//     json: async () => [
//       {
//         movieCode: "Interstellar-2014-11-07",
//         title: "Interstellar",
//         releasedDate: "2014-11-07",
//         genre: { genreName: "Sci-Fi" },
//         director: { directorName: "Christopher Nolan" },
//         rating: 8.6,
//         duration: "03:00:00",
//         actors: [{ name: "Matthew McConaughey", roleType: "Main" }],
//       },
//     ],
//   });

//   // Simulate search
//   fireEvent.change(screen.getByPlaceholderText("Search Movie by Title"), {
//     target: { value: "Interstellar" },
//   });

//   fireEvent.click(screen.getByText("Search"));

//   // Wait for the search result to show up
//   expect(await screen.findByText("Interstellar")).toBeInTheDocument();
//   expect(screen.getByText("Search Result")).toBeInTheDocument();

//   // Ensure "All Movies" table is not shown
//   await waitFor(() => {
//     expect(screen.queryByText("All Movies")).not.toBeInTheDocument();
//   });
// });
  



test('should not render search result after not searching by title', () => {
  render(<Movie />);
  const head = screen.queryByRole("heading", { name: /search result/i });
  
  expect(head).not.toBeInTheDocument();
});


test("All table headers are shown since no search is done", () => {
  render(<Movie />);

  const movieCodeHeader = screen.getAllByRole("columnheader");

  expect(movieCodeHeader).toHaveLength(8);
});





test("user can type into title input field in Add Movie mode", async () => {
  render(<Movie />);

  await userEvent.click(screen.getByRole("button", { name: /add new movie/i }));

  const title=screen.getByPlaceholderText("Title");
  expect(title).toBeInTheDocument();
  
});

test('shows an alert when submitting an empty form', async() => {
 
  global.alert = jest.fn();

  render(<Movie />);

  await userEvent.click(screen.getByRole("button", { name: /add new movie/i }));
  fireEvent.click(screen.getByText('Save'));

  expect(global.alert).toHaveBeenCalledWith('All fields are required!');
});


test('opens the modal when the "Add New Movie" button is clicked', () => {
  render(<Movie />);

  fireEvent.click(screen.getByText('Add New Movie'));

  expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
  expect(screen.getByText('Save')).toBeInTheDocument();
});

test('closes the modal when the "Cancel" button is clicked', () => {
  render(<Movie />);

  fireEvent.click(screen.getByText('Add New Movie'));
  fireEvent.click(screen.getByText('Cancel'));

  expect(screen.queryByPlaceholderText('Title')).not.toBeInTheDocument();
});

test('handles movie creation successfully', async () => {
  global.fetch.mockImplementationOnce(() =>
    Promise.resolve({
      ok: true,
    })
  );

  render(<Movie />);
  fireEvent.click(screen.getByText('Add New Movie'));

  fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'New Movie' } });
  fireEvent.change(screen.getByTestId('release-date-input'), { target: { value: '2023-04-22' } });
  fireEvent.change(screen.getByPlaceholderText('Genre'), { target: { value: 'Action' } });
  fireEvent.change(screen.getByPlaceholderText('Director'), { target: { value: 'John Doe' } });
  fireEvent.change(screen.getByPlaceholderText('Rating'), { target: { value: '8' } });
  fireEvent.change(screen.getByPlaceholderText('Duration'), { target: { value: '120' } });
  fireEvent.change(screen.getByPlaceholderText('Actors (name-role)'), { target: { value: 'John-Lead, Jane-Support' } });

  fireEvent.click(screen.getByText('Save'));

  await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(
    'https://localhost:44362/api/Movies/AddMovie',
    expect.objectContaining({
      method: 'POST',
      body: expect.stringContaining('New Movie'),
    })
  ));
});



test('shows a message when no movies are found', async () => {
  global.fetch.mockImplementationOnce(() =>
    Promise.resolve({
      json: () => Promise.resolve([]),
    })
  );

  render(<Movie />);

  await waitFor(() => expect(screen.getByText('No movies found.')).toBeInTheDocument());
});


beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

















