import movieTrailer from "movie-trailer";
import React, { useEffect, useState } from "react";
import YouTube from "react-youtube";
import axio from "./axios";
import "./row.css";
const baseURL = "https://image.tmdb.org/t/p/original/";
function Row({ title, fetchUrl, isLargRow }) {
  const [movie, setMovie] = useState([]);
  const [youtubeurl, setYoutubeurl] = useState();
  useEffect(() => {
    async function fetchData() {
      const request = await axio.get(fetchUrl);
      setMovie(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);
  const opts = {
    height: "400",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };
  const handelClick = (movie) => {
    console.log("click");
    if (youtubeurl) {
      setYoutubeurl("");
    } else {
      movieTrailer(movie?.name || "")
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setYoutubeurl(urlParams.get("v"));
        })
        .catch((err) => console.log(err));
    }
  };
  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row_posters">
        {movie.map((movie) => (
          <img
            onClick={() => handelClick(movie)}
            key={movie.id}
            className={`row_poster ${isLargRow && "row__posterLarge"}`}
            src={`${baseURL}${
              isLargRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.name}
          />
        ))}
      </div>
      {youtubeurl && <YouTube videoId={youtubeurl} opts={opts} />}
    </div>
  );
}

export default Row;
