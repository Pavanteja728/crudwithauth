const createMovieModel = (data) => {
    return {
      movieCode: data.movie_Code,
      title: data.title,
      releasedDate: data.releasedDate,
      genre: data.genre ? { genreName: data.genre.genreName } : null,
      director: data.director ? { directorName: data.director.directorName } : null,
      rating: data.rating,
      duration: data.duration,
      actors: Array.isArray(data.actors) 
        ? data.actors.map(actor => ({
            name: actor.name,
            roleType: actor.roleType
          }))
        : []
    };
  };
  
  export default createMovieModel;