import React, { useState, useEffect , useCallback} from "react";
import { FaEdit, FaTrashAlt, FaPlus, FaSignOutAlt } from "react-icons/fa";
import { GoSortAsc } from "react-icons/go";
import { GoSortDesc } from "react-icons/go";
import createMovieModel from "./MovieModel";
import AuthService from "./AuthService";
import "./Movie.css";

const api_url = "https://localhost:44362/api/Movies";


const Movie = ({ userRole, onLogout }) => {
  const [movies, setMovies] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMovieCode, setEditMovieCode] = useState(null);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [genre, setGenre] = useState("");
  const [directorName, setDirectorName] = useState("");
  const [rating, setRating] = useState("");
  const [duration, setDuration] = useState("");
  const [actors, setActors] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 10;
  const [sortOrder, setSortOrder] = useState('asc');
  //const [dateRange, setDateRange] = useState([new Date(), new Date()]);




  useEffect(() => {
    if (searchTitle.trim() === "") {
      setSearchResult(null);
    }
  }, [searchTitle]);

  const handleSort = () => {
  const sortedMovies = [...displayedMovies].sort((a, b) => {
    const titleA = a.title.toLowerCase();
    const titleB = b.title.toLowerCase();
    if (titleA < titleB) return sortOrder === 'asc' ? -1 : 1;
    if (titleA > titleB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  setMovies(sortedMovies);
};

// const handleDateChange = (range) => {
//   setDateRange(range);
//   const [startDate, endDate] = range;
//   const filteredMovies = movies.filter(movie => {
//     const releaseDate = new Date(movie.releasedDate);
//     return releaseDate >= startDate && releaseDate <= endDate;
//   });
//   setMovies(filteredMovies);
// };

  const fetchMovies = useCallback(async () => {
    try {
       
      const res = await fetch(`${api_url}/GetAllMovies`, {
        headers: AuthService.getAuthHeader()
      });
      
      if (res.status === 401) {
        onLogout();
        return;
      }
  
      const data = await res.json();
     
      if (!Array.isArray(data)) throw new Error("Invalid data");
      setMovies(data.map(movie => createMovieModel(movie)));
      setCurrentPage(1);
    } catch (err) {
      setError("Error fetching movies: " + err.message);
    }
  }, [onLogout]); 
  
  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]); 
  
  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const resetForm = () => {
    setTitle("");
    setReleaseDate("");
    setGenre("");
    setDirectorName("");
    setRating("");
    setDuration("");
    setActors("");
    setEditMovieCode(null);
  };

  const openModal = (movie = null) => {
    if (movie) {
      setEditMovieCode(movie.movieCode);
      setTitle(movie.title || "");
      setReleaseDate(movie.releasedDate || "");
      setGenre(movie.genre?.genreName || "");
      setDirectorName(movie.director?.directorName || "");
      setRating(movie.rating?.toString() || "");
      setDuration(movie.duration || "");
      setActors(movie.actors?.map(a => `${a.name}-${a.roleType}`).join(", ") || "");
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const closeModal = () => {  
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userRole !== "Admin") {
    setError("Only admins can perform this action.");
    return;
  }

    if (!title || !releaseDate || !genre || !directorName || !rating || !duration || !actors) {
      setError("All fields are required!");
      return;
    }

    const movieData = {
      actors: actors.split(",").map(a => {
        const [name, role] = a.split("-").map(s => s.trim());
        return { name: name || "Unknown", roleType: role || "Unknown" };
      }),
      director: { directorName },
      duration,
      genre: { genreName: genre },
      movie_Code: editMovieCode || undefined,
      rating: parseFloat(rating),
      releasedDate: releaseDate,
      title
    };

    try {
      const url = editMovieCode ? `${api_url}/UpdateMovie?movieCode=${editMovieCode}` : `${api_url}/AddMovie`;
      const method = editMovieCode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: AuthService.getAuthHeader(),
        body: JSON.stringify(movieData)
      });

      if (res.status === 401) {
        onLogout();
        return;
      }

      if (!res.ok) throw new Error("Operation failed");

      await fetchMovies();
      closeModal();
      setError("");
    } catch (err) {
      setError("Operation failed: " + err.message);
    }
  };

  const handleDelete = async (movieCode) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    
    try {
      const res = await fetch(`${api_url}/DeleteMovie?movieCode=${movieCode}`, { 
        method: "DELETE",
        headers: AuthService.getAuthHeader()
      });

      if (res.status === 401) {
        onLogout();
        return;
      }

      if (!res.ok) throw new Error("Delete failed");
      await fetchMovies();
      setError("");
    } catch (err) {
      setError("Delete failed: " + err.message);
    }
  };

  const handleSearch = async () => {
    if (!searchTitle.trim()) return;

    try {
      const res = await fetch(`${api_url}/GetMovieByTitle?Title=${searchTitle}`, {
        headers: AuthService.getAuthHeader()
      });
      
      if (res.status === 401) {
        onLogout();
        return;
      }

      if (!res.ok) {
  setSearchResult([]);
  setCurrentPage(1);
  return;
}

      const data = await res.json();
      const movieArray = Array.isArray(data) ? data : [data];
      setSearchResult(movieArray.map(m => createMovieModel(m)));
      setCurrentPage(1);
    } catch (err) {
      setSearchResult([]);
    }
  };

  const displayedMovies = searchResult !== null ? searchResult : movies;
  const totalMovies = displayedMovies.length;
  const totalPages = Math.ceil(totalMovies / moviesPerPage);
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = displayedMovies.slice(indexOfFirstMovie, indexOfLastMovie);

  useEffect(() => {
  if (currentPage > totalPages) {
    setCurrentPage(Math.max(totalPages, 1));
  }
}, [totalPages, currentPage]);



  return (
    <div className="mainContainer">
      <div className="header-container">
        <h2 className="mainHead"><center>Movie Management App</center></h2>
        <div className="logout-section">
          <button onClick={onLogout} className="logout-button">
          <FaSignOutAlt /> Logout
        </button>
        </div>
        
        
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="action-bar">
  {userRole === "Admin" && (
    <>
      <button className="formbutton" onClick={() => openModal()}>
        <FaPlus /> Add New Movie
      </button>
      <div className="searchcont">
        <div className="search-input-wrapper">
  <input
    className="inputsearch"
    type="search"
    placeholder="Search Movie by Title"
    value={searchTitle}
    onChange={(e) => setSearchTitle(e.target.value)}
  />
  {searchTitle && (
    <button
      className="clear-search"
      onClick={() => {
        setSearchTitle('');
        setSearchResult(null);
        setCurrentPage(1);
      }}
      aria-label="Clear search"
    >
      &times;
    </button>
  )}
</div>

        <button className="formbutton" onClick={handleSearch}>Search</button>
        <button className="sortbutton" onClick={handleSort}>
        {sortOrder === 'asc' ? <GoSortAsc /> : <GoSortDesc />}
      </button>
      </div>
      

      {/* <div className="date-range-picker-wrapper">
        <DateRangePicker
          onChange={handleDateChange}
          ranges={[dateRange]}
          moveRangeOnFirstSelection={false}
        />
      </div> */}

    </>
  )}
</div>


      <table border="1">
        <thead>
          <tr>
            <th>Code</th><th>Title</th><th>Release</th><th>Genre</th><th>Director</th><th>Rating</th><th>Duration</th><th>Actors</th>
            {userRole === "Admin" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {displayedMovies.length === 0 ? (
            <tr>
              <td colSpan={userRole === "Admin" ? "9" : "8"}><center>No movies found.</center></td>
            </tr>
          ) : (
            currentMovies.map(movie => (
              <tr key={movie.movieCode}>
                <td>{movie.movieCode}</td>
                <td>{movie.title}</td>
                <td>{new Date(movie.releasedDate).toLocaleDateString()}</td>
                <td>{movie.genre?.genreName}</td>
                <td>{movie.director?.directorName}</td>
                <td>{movie.rating}</td>
                <td>{movie.duration}</td>
                <td>{movie.actors.map(a => `${a.name} (${a.roleType})`).join(", ")}</td>
                {userRole === "Admin" && (
                  <td>
                    <FaEdit 
                      aria-label="edit movie" 
                      className="icon-button" 
                      onClick={() => openModal(movie)} 
                    />
                    <FaTrashAlt 
                      aria-label="delete movie"
                      className="icon-button" 
                      onClick={() => handleDelete(movie.movieCode)} 
                    />
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {totalPages > 1 && (
  <div className="pagination">
    <button
      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
    >
      Previous
    </button>
    {[...Array(totalPages)].map((_, i) => (
      <button
        key={i + 1}
        onClick={() => setCurrentPage(i + 1)}
        className={currentPage === i + 1 ? "active" : ""}
      >
        {i + 1}
      </button>
    ))}
    <button
      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
    >
      Next
    </button>
  </div>
)}


      {showModal && userRole === "Admin" &&(
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editMovieCode ? "Edit Movie" : "Add Movie"}</h3>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
              <input type="date" data-testid="release-date-input" value={releaseDate} onChange={e => setReleaseDate(e.target.value)} />
              <input type="text" placeholder="Genre" value={genre} onChange={e => setGenre(e.target.value)} />
              <input type="text" placeholder="Director" value={directorName} onChange={e => setDirectorName(e.target.value)} />
              <input type="number" placeholder="Rating" value={rating} onChange={e => setRating(e.target.value)} min="0" max="10" step="0.1" />
              <input type="text" placeholder="Duration" value={duration} onChange={e => setDuration(e.target.value)} />
              <input type="text" placeholder="Actors (name-role)" value={actors} onChange={e => setActors(e.target.value)} />
              <div className="modal-actions">
                <button type="submit">{editMovieCode ? "Update" : "Save"}</button>
                <button type="button" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Movie;