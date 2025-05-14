import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Movie from './Movie';
import AuthService from './AuthService';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';


jest.mock('./AuthService');
global.fetch = jest.fn();

const mockOnLogout = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

test('renders Movie component without crashing', () => {
  render(<Movie userRole="Admin" onLogout={mockOnLogout} />);
  expect(screen.getByText(/Movie Management App/i)).toBeInTheDocument();
});

test('renders Movie component without crashing', () => {
  render(<Movie userRole="User" onLogout={mockOnLogout} />);
  expect(screen.getByText(/Movie Management App/i)).toBeInTheDocument();
});

test('displays error message when fetching movies fails', async () => {
  fetch.mockResolvedValueOnce({ ok: false });
  render(<Movie userRole="Admin" onLogout={mockOnLogout} />);
  await waitFor(() => expect(screen.getByText(/Error fetching movies/i)).toBeInTheDocument());
});

test('renders movie list when fetch is successful', async () => {
  const mockMovies = [
    { movieCode: 1, title: 'Movie 1', releasedDate: '2025-01-01', genre: { genreName: 'Action' }, director: { directorName: 'Director 1' }, rating: 8.5, duration: '120 min', actors: [{ name: 'Actor 1', roleType: 'Lead' }] },
    { movieCode: 2, title: 'Movie 2', releasedDate: '2025-02-01', genre: { genreName: 'Comedy' }, director: { directorName: 'Director 2' }, rating: 7.5, duration: '90 min', actors: [{ name: 'Actor 2', roleType: 'Supporting' }] },
  ];
  fetch.mockResolvedValueOnce({ ok: true, json: () => mockMovies });
  render(<Movie userRole="Admin" onLogout={mockOnLogout} />);
  await waitFor(() => expect(screen.getByText(/Movie 1/i)).toBeInTheDocument());
  expect(screen.getByText(/Movie 2/i)).toBeInTheDocument();
});

test('opens modal for adding a new movie', () => {
  render(<Movie userRole="Admin" onLogout={mockOnLogout} />);
  fireEvent.click(screen.getByText(/Add New Movie/i));
  expect(screen.getByText(/Add Movie/i)).toBeInTheDocument();
});

test('opens modal for editing an existing movie', () => {
  const mockMovies = [
    { movieCode: 1, title: 'Movie 1', releasedDate: '2025-01-01', genre: { genreName: 'Action' }, director: { directorName: 'Director 1' }, rating: 8.5, duration: '120 min', actors: [{ name: 'Actor 1', roleType: 'Lead' }] },
  ];
  fetch.mockResolvedValueOnce({ ok: true, json: () => mockMovies });
  render(<Movie userRole="Admin" onLogout={mockOnLogout} />);
  fireEvent.click(screen.getByText(/Edit/i));
  expect(screen.getByText(/Edit Movie/i)).toBeInTheDocument();
});

test('closes modal when cancel is clicked', () => {
  render(<Movie userRole="Admin" onLogout={mockOnLogout} />);
  fireEvent.click(screen.getByText(/Add New Movie/i));
  fireEvent.click(screen.getByText(/Cancel/i));
  expect(screen.queryByText(/Add Movie/i)).not.toBeInTheDocument();
});

test('submits form to add a new movie', async () => {
  const mockMovies = [
    { movieCode: 1, title: 'Movie 1', releasedDate: '2025-01-01', genre: { genreName: 'Action' }, director: { directorName: 'Director 1' }, rating: 8.5, duration: '120 min', actors: [{ name: 'Actor 1', roleType: 'Lead' }] },
  ];
  fetch.mockResolvedValueOnce({ ok: true, json: () => mockMovies });
  render(<Movie userRole="Admin" onLogout={mockOnLogout} />);
  fireEvent.click(screen.getByText(/Add New Movie/i));
  fireEvent.change(screen.getByPlaceholderText(/Title/i), { target: { value: 'New Movie' } });
  fireEvent.change(screen.getByPlaceholderText(/Release Date/i), { target: { value: '2025-05-01' } });
  fireEvent.change(screen.getByPlaceholderText(/Genre/i), { target: { value: 'Drama' } });
  fireEvent.change(screen.getByPlaceholderText(/Director/i), { target: { value: 'Director 3' } });
  fireEvent.change(screen.getByPlaceholderText(/Rating/i), { target: { value: '9.0' } });
  fireEvent.change(screen.getByPlaceholderText(/Duration/i), { target: { value: '100 min' } });
  fireEvent.change(screen.getByPlaceholderText(/Actors/i), { target: { value: 'Actor 3-Lead' } });
  fireEvent.click(screen.getByText(/Save/i));
  await waitFor(() => expect(screen.getByText(/New Movie/i)).toBeInTheDocument());
});

test('submits form to update an existing movie', async () => {
  const mockMovies = [
    { movieCode: 1, title: 'Movie 1', releasedDate: '2025-01-01', genre: { genreName: 'Action' }, director: { directorName: 'Director 1' }, rating: 8.5, duration: '120 min', actors: [{ name: 'Actor 1', roleType: 'Lead' }] },
  ];
  fetch.mockResolvedValueOnce({ ok: true, json: () => mockMovies });
  render(<Movie userRole="Admin" onLogout={mockOnLogout} />);
  fireEvent.click(screen.getByText(/Edit/i));
  fireEvent.change(screen.getByPlaceholderText(/Title/i), { target: { value: 'Updated Movie' } });
  fireEvent.click(screen.getByText(/Save/i));
  await waitFor(() => expect(screen.getByText(/Updated Movie/i)).toBeInTheDocument());
});

test('deletes a movie when delete button is clicked', async () => {
  const mockMovies = [
    { movieCode: 1, title: 'Movie 1', releasedDate: '2025-01-01', genre: { genreName: 'Action' }, director: { directorName: 'Director 1' }, rating: 8.5, duration: '120 min', actors: [{ name: 'Actor 1', roleType: 'Lead' }] },
  ];
  fetch.mockResolvedValueOnce({ ok: true, json: () => mockMovies });
  render(<Movie userRole="Admin" onLogout={mockOnLogout} />);
  fireEvent.click(screen.getByText(/Delete/i));
  window.confirm = jest.fn().mockReturnValue(true); // Mock the confirm dialog
  fetch.mockResolvedValueOnce({ ok: true }); // Simulate successful delete
  await waitFor(() => expect(screen.queryByText(/Movie 1/i)).not.toBeInTheDocument());
});

test('does not delete a movie if user cancels the deletion', async () => {
  const mockMovies = [
    { movieCode: 1, title: 'Movie 1', releasedDate: '2025-01-01', genre: { genreName: 'Action' }, director: { directorName: 'Director 1' }, rating: 8.5, duration: '120 min', actors: [{ name: 'Actor 1', roleType: 'Lead' }] },
  ];
  fetch.mockResolvedValueOnce({ ok: true, json: () => mockMovies });
  render(<Movie userRole="Admin" onLogout={mockOnLogout} />);
  fireEvent.click(screen.getByText(/Delete/i));
  window.confirm = jest.fn().mockReturnValue(false); // Mock user canceling delete
  await waitFor(() => expect(screen.getByText(/Movie 1/i)).toBeInTheDocument());
});

test('handles search correctly when search term is entered', async () => {
  const mockMovies = [
    { movieCode: 1, title: 'Movie 1', releasedDate: '2025-01-01', genre: { genreName: 'Action' }, director: { directorName: 'Director 1' }, rating: 8.5, duration: '120 min', actors: [{ name: 'Actor 1', roleType: 'Lead' }] },
  ];
  fetch.mockResolvedValueOnce({ ok: true, json: () => mockMovies });
  render(<Movie userRole="Admin" onLogout={mockOnLogout} />);
  fireEvent.change(screen.getByPlaceholderText(/Search Movie by Title/i), { target: { value: 'Movie 1' } });
  fireEvent.click(screen.getByText(/Search/i));
  await waitFor(() => expect(screen.getByText(/Movie 1/i)).toBeInTheDocument());
});

test('does not show any movies if no search result matches', async () => {
  fetch.mockResolvedValueOnce({ ok: true, json: () => [] }); // No results
  render(<Movie userRole="Admin" onLogout={mockOnLogout} />);
  fireEvent.change(screen.getByPlaceholderText(/Search Movie by Title/i), { target: { value: 'Non-existing Movie' } });
  fireEvent.click(screen.getByText(/Search/i));
  await waitFor(() => expect(screen.getByText(/No movies found/i)).toBeInTheDocument());
});

test('does not show search results if search term is empty', async () => {
  render(<Movie userRole="Admin" onLogout={mockOnLogout} />);
  fireEvent.change(screen.getByPlaceholderText(/Search Movie by Title/i), { target: { value: '' } });
  fireEvent.click(screen.getByText(/Search/i));
  expect(screen.queryByText(/No movies found/i)).not.toBeInTheDocument();
});

test('allows non-admin users to view movies but not edit or delete', async () => {
  const mockMovies = [
    { movieCode: 1, title: 'Movie 1', releasedDate: '2025-01-01', genre: { genreName: 'Action' }, director: { directorName: 'Director 1' }, rating: 8.5, duration: '120 min', actors: [{ name: 'Actor 1', roleType: 'Lead' }] },
  ];
  fetch.mockResolvedValueOnce({ ok: true, json: () => mockMovies });
  render(<Movie userRole="User" onLogout={mockOnLogout} />);
  await waitFor(() => expect(screen.getByText(/Movie 1/i)).toBeInTheDocument());
  expect(screen.queryByText(/Edit/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Delete/i)).not.toBeInTheDocument();
});

test('shows correct error message when movie form validation fails', () => {
  render(<Movie userRole="Admin" onLogout={mockOnLogout} />);
  fireEvent.click(screen.getByText(/Add New Movie/i));
  fireEvent.click(screen.getByText(/Save/i)); // Trying to submit without filling the form
  expect(screen.getByText(/All fields are required!/i)).toBeInTheDocument();
});

test('shows error message when submit fails', async () => {
  fetch.mockResolvedValueOnce({ ok: false });
  render(<Movie userRole="Admin" onLogout={mockOnLogout} />);
  fireEvent.click(screen.getByText(/Add New Movie/i));
  fireEvent.change(screen.getByPlaceholderText(/Title/i), { target: { value: 'New Movie' } });
  fireEvent.click(screen.getByText(/Save/i));
  await waitFor(() => expect(screen.getByText(/Operation failed/i)).toBeInTheDocument());
});







test('checks that logout button works correctly', () => {
  render(<Movie userRole="Admin" onLogout={mockOnLogout} />);
  fireEvent.click(screen.getByText(/Logout/i));
  expect(mockOnLogout).toHaveBeenCalledTimes(1);
});

test('hides add movie button for non-admin users', () => {
  render(<Movie userRole="User" onLogout={mockOnLogout} />);
  expect(screen.queryByText(/Add New Movie/i)).not.toBeInTheDocument();
});

test('ensures date input accepts valid date format', () => {
  render(<Movie userRole="Admin" onLogout={mockOnLogout} />);
  fireEvent.click(screen.getByText(/Add New Movie/i));
  fireEvent.change(screen.getByPlaceholderText(/Release Date/i), { target: { value: '2025-05-01' } });
  expect(screen.getByPlaceholderText(/Release Date/i).value).toBe('2025-05-01');
});

test('checks if rating input only allows valid numeric values', () => {
  render(<Movie userRole="Admin" onLogout={mockOnLogout} />);
  fireEvent.click(screen.getByText(/Add New Movie/i));
  fireEvent.change(screen.getByPlaceholderText(/Rating/i), { target: { value: '9.5' } });
  expect(screen.getByPlaceholderText(/Rating/i).value).toBe('9.5');
  fireEvent.change(screen.getByPlaceholderText(/Rating/i), { target: { value: 'invalid' } });
  expect(screen.getByPlaceholderText(/Rating/i).value).toBe('9.5');
});

test('tests actor input with proper name-role format', () => {
  render(<Movie userRole="Admin" onLogout={mockOnLogout} />);
  fireEvent.click(screen.getByText(/Add New Movie/i));
  fireEvent.change(screen.getByPlaceholderText(/Actors/i), { target: { value: 'Actor 1-Lead' } });
  expect(screen.getByPlaceholderText(/Actors/i).value).toBe('Actor 1-Lead');
  fireEvent.change(screen.getByPlaceholderText(/Actors/i), { target: { value: 'Actor 2-Secondary' } });
  expect(screen.getByPlaceholderText(/Actors/i).value).toBe('Actor 2-Secondary');
});

test('ensures the correct duration value is entered', () => {
  render(<Movie userRole="Admin" onLogout={mockOnLogout} />);
  fireEvent.click(screen.getByText(/Add New Movie/i));
  fireEvent.change(screen.getByPlaceholderText(/Duration/i), { target: { value: '120 min' } });
  expect(screen.getByPlaceholderText(/Duration/i).value).toBe('120 min');
});



test('displays correct number of movies when fetched', async () => {
  const mockMovies = [
    { movieCode: 1, title: 'Movie 1', releasedDate: '2025-01-01', genre: { genreName: 'Action' }, director: { directorName: 'Director 1' }, rating: 8.5, duration: '120 min', actors: [{ name: 'Actor 1', roleType: 'Lead' }] },
    { movieCode: 2, title: 'Movie 2', releasedDate: '2025-02-01', genre: { genreName: 'Comedy' }, director: { directorName: 'Director 2' }, rating: 7.5, duration: '90 min', actors: [{ name: 'Actor 2', roleType: 'Supporting' }] },
  ];
  fetch.mockResolvedValueOnce({ ok: true, json: () => mockMovies });
  render(<Movie userRole="Admin" onLogout={mockOnLogout} />);
  await waitFor(() => expect(screen.getAllByRole('row')).toHaveLength(3)); // Includes header row
});






test('checks that search results are updated after submitting search query', async () => {
  const mockMovies = [
    { 
      movieCode: 1, 
      title: 'Movie 1', 
      releasedDate: '2025-01-01', 
      genre: { genreName: 'Action' }, 
      director: { directorName: 'Director 1' }, 
      rating: 8.5, 
      duration: '120 min', 
      actors: [{ name: 'Actor 1', roleType: 'Lead' }]
    },
  ];

  // Mock fetch to return the movies
  global.fetch = jest.fn().mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve(mockMovies),
  });

  render(<Movie userRole="Admin" onLogout={mockOnLogout} />);

  // Simulate typing in the search field and clicking the search button
  fireEvent.change(screen.getByPlaceholderText(/Search Movie by Title/i), { target: { value: 'Movie 1' } });
  fireEvent.click(screen.getByText(/Search/i));

  // Wait for the search results to appear in the DOM
  await waitFor(() => {
    expect(screen.getByText(/Movie 1/i)).toBeInTheDocument();  // Check that "Movie 1" appears in the DOM
  });
});



jest.mock("./AuthService", () => ({
  getAuthHeader: () => ({ Authorization: "Bearer test-token" }),
}));

jest.mock("./MovieModel", () => (movie) => movie);

describe("Movie Component", () => {
  it("renders title input when userRole is Admin and modal is open", async () => {
    const mockLogout = jest.fn();

    render(<Movie userRole="Admin" onLogout={mockLogout} />);

    // Click on "Add New Movie" button to open modal
    const addButton = screen.getByRole("button", { name: /add new movie/i });
    fireEvent.click(addButton);

    // Check that the title input is present
    const titleInput = screen.getByPlaceholderText("Title");
    expect(titleInput).toBeInTheDocument();
  });
});

jest.mock("./AuthService", () => ({
  getAuthHeader: () => ({ Authorization: "Bearer test-token" }),
}));

jest.mock("./MovieModel", () => (movie) => movie);

describe("Movie Component", () => {
  it("renders release date input when userRole is Admin and modal is open", async () => {
    const mockLogout = jest.fn();

    render(<Movie userRole="Admin" onLogout={mockLogout} />);

    // Click on "Add New Movie" button to open modal
    const addButton = screen.getByRole("button", { name: /add new movie/i });
    fireEvent.click(addButton);

    // Check that the title input is present
    const titleInput = screen.getByTestId("release-date-input");
    expect(titleInput).toBeInTheDocument();
  });
});

jest.mock("./AuthService", () => ({
  getAuthHeader: () => ({ Authorization: "Bearer test-token" }),
}));

jest.mock("./MovieModel", () => (movie) => movie);

describe("Movie Component", () => {
  it("renders Gnere input when userRole is Admin and modal is open", async () => {
    const mockLogout = jest.fn();

    render(<Movie userRole="Admin" onLogout={mockLogout} />);

    // Click on "Add New Movie" button to open modal
    const addButton = screen.getByRole("button", { name: /add new movie/i });
    fireEvent.click(addButton);

    // Check that the title input is present
    const titleInput = screen.getByPlaceholderText("Genre");
    expect(titleInput).toBeInTheDocument();
  });
});

jest.mock("./AuthService", () => ({
  getAuthHeader: () => ({ Authorization: "Bearer test-token" }),
}));

jest.mock("./MovieModel", () => (movie) => movie);

describe("Movie Component", () => {
  it("renders director input when userRole is Admin and modal is open", async () => {
    const mockLogout = jest.fn();

    render(<Movie userRole="Admin" onLogout={mockLogout} />);

    // Click on "Add New Movie" button to open modal
    const addButton = screen.getByRole("button", { name: /add new movie/i });
    fireEvent.click(addButton);

    // Check that the title input is present
    const titleInput = screen.getByPlaceholderText("Director");
    expect(titleInput).toBeInTheDocument();
  });
});

jest.mock("./AuthService", () => ({
  getAuthHeader: () => ({ Authorization: "Bearer test-token" }),
}));

jest.mock("./MovieModel", () => (movie) => movie);

describe("Movie Component", () => {
  it("renders rating input when userRole is Admin and modal is open", async () => {
    const mockLogout = jest.fn();

    render(<Movie userRole="Admin" onLogout={mockLogout} />);

    // Click on "Add New Movie" button to open modal
    const addButton = screen.getByRole("button", { name: /add new movie/i });
    fireEvent.click(addButton);

    // Check that the title input is present
    const titleInput = screen.getByPlaceholderText("Rating");
    expect(titleInput).toBeInTheDocument();
  });
});

jest.mock("./AuthService", () => ({
  getAuthHeader: () => ({ Authorization: "Bearer test-token" }),
}));

jest.mock("./MovieModel", () => (movie) => movie);

describe("Movie Component", () => {
  it("renders duration input when userRole is Admin and modal is open", async () => {
    const mockLogout = jest.fn();

    render(<Movie userRole="Admin" onLogout={mockLogout} />);

    // Click on "Add New Movie" button to open modal
    const addButton = screen.getByRole("button", { name: /add new movie/i });
    fireEvent.click(addButton);

    // Check that the title input is present
    const titleInput = screen.getByPlaceholderText("Duration");
    expect(titleInput).toBeInTheDocument();
  });
});

jest.mock("./AuthService", () => ({
  getAuthHeader: () => ({ Authorization: "Bearer test-token" }),
}));

jest.mock("./MovieModel", () => (movie) => movie);

describe("Movie Component", () => {
  it("renders actors names and roles input when userRole is Admin and modal is open", async () => {
    const mockLogout = jest.fn();

    render(<Movie userRole="Admin" onLogout={mockLogout} />);

    // Click on "Add New Movie" button to open modal
    const addButton = screen.getByRole("button", { name: /add new movie/i });
    fireEvent.click(addButton);

    // Check that the title input is present
    const titleInput = screen.getByPlaceholderText("Actors (name-role)");
    expect(titleInput).toBeInTheDocument();
  });
});

jest.mock("./AuthService", () => ({
  getAuthHeader: () => ({ Authorization: "Bearer test-token" }),
}));

jest.mock("./MovieModel", () => (movie) => movie);

describe("Movie Component", () => {
  it(" not renders title input when userRole is user and modal is close", async () => {
    const mockLogout = jest.fn();

    render(<Movie userRole="User" onLogout={mockLogout} />);

     expect(screen.queryByRole("button", { name: /add new movie/i })).not.toBeInTheDocument();
      expect(screen.queryByPlaceholderText("Title")).not.toBeInTheDocument();
  });
});

jest.mock("./AuthService", () => ({
  getAuthHeader: () => ({ Authorization: "Bearer test-token" }),
}));

jest.mock("./MovieModel", () => (movie) => movie);

describe("Movie Modal Input Fields should NOT render for regular User", () => {
  let mockLogout;

  beforeEach(() => {
    mockLogout = jest.fn();
    render(<Movie userRole="User" onLogout={mockLogout} />);
  });

  it("does NOT render title input", () => {
    expect(screen.queryByPlaceholderText("Title")).not.toBeInTheDocument();
  });

  it("does NOT render release date input", () => {
    expect(screen.queryByTestId("release-date-input")).not.toBeInTheDocument();
  });

  it("does NOT render genre input", () => {
    expect(screen.queryByPlaceholderText("Genre")).not.toBeInTheDocument();
  });

  it("does NOT render director input", () => {
    expect(screen.queryByPlaceholderText("Director")).not.toBeInTheDocument();
  });

  it("does NOT render rating input", () => {
    expect(screen.queryByPlaceholderText("Rating")).not.toBeInTheDocument();
  });

  it("does NOT render duration input", () => {
    expect(screen.queryByPlaceholderText("Duration")).not.toBeInTheDocument();
  });

  it("does NOT render actors input", () => {
    expect(screen.queryByPlaceholderText("Actors (name-role)")).not.toBeInTheDocument();
  });

  it("does NOT render Add New Movie button", () => {
    expect(screen.queryByRole("button", { name: /add new movie/i })).not.toBeInTheDocument();
  });
});


jest.mock("./AuthService", () => ({
  getAuthHeader: jest.fn().mockReturnValue({ Authorization: "Bearer mockToken" }),
}));

// Mock fetch to simulate API responses
global.fetch = jest.fn();

describe("Movie Component", () => {
  let onLogout;

  beforeEach(() => {
    // Mock the logout function passed as prop
    onLogout = jest.fn();
    
    // Reset mocks and render the component
    fetch.mockClear();
  });

  test("should render Add New Movie button", () => {
    render(<Movie userRole="Admin" onLogout={onLogout} />);

    const addButton = screen.getByRole("button", { name: /add new movie/i });
    expect(addButton).toBeInTheDocument();
  });

  test("should open modal when Add New Movie button is clicked", () => {
    render(<Movie userRole="Admin" onLogout={onLogout} />);

    const addButton = screen.getByRole("button", { name: /add new movie/i });
    fireEvent.click(addButton);

    const modal = screen.getByRole("dialog");
    expect(modal).toBeInTheDocument();
  });

  test("should show modal with correct title for adding a movie", () => {
    render(<Movie userRole="Admin" onLogout={onLogout} />);
    
    const addButton = screen.getByRole("button", { name: /add new movie/i });
    fireEvent.click(addButton);

    const modalTitle = screen.getByText(/add movie/i);
    expect(modalTitle).toBeInTheDocument();
  });

  test("should fill out the form and submit a movie", async () => {
    render(<Movie userRole="Admin" onLogout={onLogout} />);

    const addButton = screen.getByRole("button", { name: /add new movie/i });
    fireEvent.click(addButton);

    fireEvent.change(screen.getByPlaceholderText(/title/i), { target: { value: "Movie 1" } });
    fireEvent.change(screen.getByPlaceholderText(/genre/i), { target: { value: "Action" } });
    fireEvent.change(screen.getByPlaceholderText(/director/i), { target: { value: "Director 1" } });
    fireEvent.change(screen.getByPlaceholderText(/rating/i), { target: { value: "8" } });
    fireEvent.change(screen.getByPlaceholderText(/duration/i), { target: { value: "120" } });
    fireEvent.change(screen.getByPlaceholderText(/actors/i), { target: { value: "Actor 1-Lead" } });

    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);

    // Simulate API call to create a movie
    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue([]),
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "https://localhost:44362/api/Movies/AddMovie",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: "Bearer mockToken",
          }),
          body: expect.stringContaining("Movie 1"), // Ensure movie data is sent
        })
      );
    });
  });

  test("should close modal when Cancel button is clicked", () => {
    render(<Movie userRole="Admin" onLogout={onLogout} />);
    
    const addButton = screen.getByRole("button", { name: /add new movie/i });
    fireEvent.click(addButton);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    const modal = screen.queryByRole("dialog");
    expect(modal).not.toBeInTheDocument();
  });

  test("should render Edit icon and allow editing a movie", () => {
    const movie = {
      movieCode: "1",
      title: "Movie 1",
      releasedDate: "2021-01-01",
      genre: { genreName: "Action" },
      director: { directorName: "Director 1" },
      rating: 8,
      duration: 120,
      actors: [{ name: "Actor 1", roleType: "Lead" }],
    };
    
    render(<Movie userRole="Admin" onLogout={onLogout} />);

    const editIcon = screen.getByLabelText(/edit movie/i);
    fireEvent.click(editIcon);

    const modal = screen.getByRole("dialog");
    expect(modal).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/title/i).value).toBe("Movie 1");
  });

  test('should render Delete icon and confirm before deleting', () => {
  // Mock the confirm method
  global.confirm = jest.fn().mockReturnValue(true);

  // Render the Movie component
  render(<Movie />);

  // Find the delete icon using its aria-label
  const deleteIcon = screen.getByLabelText(/delete movie/i);

  // Click the delete icon
  fireEvent.click(deleteIcon);

  // Ensure the confirm function was called
  expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this movie?');

});


  
  test("should render logout button", () => {
    render(<Movie userRole="Admin" onLogout={onLogout} />);

    const logoutButton = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(logoutButton);

    expect(onLogout).toHaveBeenCalled();
  });
});
 


// Mocking AuthService
jest.mock("./AuthService", () => ({
  getAuthHeader: jest.fn(() => ({ Authorization: "Bearer token" }))
}));

// Mock global fetch
global.fetch = jest.fn();

describe("Movie Component", () => {
  beforeEach(() => {
    // Reset the mock function before each test
    fetch.mockReset();
  });

 


it("should fetch and display movies on component load", async () => {
  const mockMovies = [
    { movieCode: 1, title: "Movie 1", releasedDate: "2023-01-01", genre: { genreName: "Action" } },
    { movieCode: 2, title: "Movie 2", releasedDate: "2023-02-01", genre: { genreName: "Comedy" } },
  ];

  // Mock the response for fetching movies
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockMovies,
    status: 200,
  });

  render(<Movie userRole="Admin" onLogout={jest.fn()} />);

  // Wait for the movies to load and appear in the document
  await waitFor(() => screen.getByText("Movie 1"));
  await waitFor(() => screen.getByText("Movie 2"));

  // Verify if the movie titles are displayed
  const movie1 = screen.getByText("Movie 1");
  const movie2 = screen.getByText("Movie 2");

  expect(movie1).toBeInTheDocument();
  expect(movie2).toBeInTheDocument();
});


});


