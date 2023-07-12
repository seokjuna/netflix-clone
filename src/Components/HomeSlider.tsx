import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import useWindowDimensions from "./useWindowDimensions";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { IGetMoviesResult, getMovies } from "../api";
import { makeImagePath } from "../Routes/utils";

const Slider = styled.div`
    position: relative;
    top: -100px; 
    height: -35px;
    padding: 0 5px;
`;

const Row = styled(motion.div)`
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 5px;
    position: absolute;
    width: 100%;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
    background-color: white;
    background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${(props) => props.bgphoto});
    background-size: cover;
    background-position: center center;
    height: 200px;
    &:first-child {
        transform-origin: center left;
    }
    &:last-child {
        transform-origin: center right;
    }
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const boxVariants = {
    normal: { 
        scale: 1,
    },
    hover: {
        scale: 1.3,
        y: -50,
        transition: {
            delay: 0.3,
            type: "tween",
        },
    },
};

const Title = styled.h3`
    padding: 0 3px;
    font-size: 20px;
    font-weight: 400;
    text-align: center;
    text-shadow: black 2px 2px 2px;
`;


const Info = styled(motion.div)`
    padding: 10px;
    background-color: ${(props) => props.theme.black.lighter};
    opacity: 0;
    position: absolute;
    width: 100%;
    bottom: 0;
    h4 {
        text-align: center;
        font-size: 18px;
        font-weight: 400;
    }
`;

const infoVariants = {
    hover: {
        opacity: 1,
        transition: {
            delay: 0.3,
            type: "tween",
        },
    },
}

const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
`;

const BigMovie = styled(motion.div)`
    position: fixed;
    z-index: 99;
    width: 60vw;
    height: 70vh;
    top: 15%;
    right: 0px;
    left: 0px;
    margin: 0 auto;
    background-color: ${(props) => props.theme.black.lighter};
    border-radius: 15px;
    overflow: hidden;
`;

const BigCover = styled.div`
    border-radius: 15px 15px 0 0;
    height: 380px;
    background-color: white;
    background-size: cover;
    background-position: center top;
    flex-direction: column;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const BigTitle = styled.h3`
    color: ${(props) => props.theme.white.lighter};
    padding: 10px;
    font-size: 36px;
    font-weight: 400;
    text-shadow: black 2px 2px 2px;
`;

const BigInfo = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;    
    width: 100%;
    height: 250px;
    padding: 5px 10px;
    background-color: rgba(0, 0, 0, 0.3);
`;

const BigVote = styled.span`
    padding: 10px 15px;
    display: flex;
    h4 {
        font-size: 20px;
        font-weight: 400;  
    }
    h4:first-child {
        margin-right: 5px;
    }
`;

const BigOverview = styled.p`
    padding: 10px;
    color: ${(props) => props.theme.white.lighter};
`;

const offset = 6;

function HomeSlider() {
    const width = useWindowDimensions();
    const { data: nowPlaying } = useQuery<IGetMoviesResult>(
        ["movies", "nowPlaying"],
        getMovies
    );
    const [nowPlayingIndex, setNowPlayingIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const increaseIndex = () => {
        if (nowPlaying) {
            if (leaving) return;
            toggleLeaving();
            const totalMovies = nowPlaying.results.length;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setNowPlayingIndex((prev) => prev === maxIndex ? 0 : prev + 1);
        } 
    };
    const toggleLeaving = () => setLeaving((prev) => !prev);
    const navigate = useNavigate();
    const bigMovieMatch = useMatch("/movies/:movieId"); 
    const onBoxClicked = (movieId: number) => {
        navigate(`/movies/${movieId}`);
    };
    const onOverlayClick = () => navigate(-1);
    const clickedNowPlayingMovie = 
        bigMovieMatch?.params.movieId && 
        nowPlaying?.results.find(movie => String(movie.id) === bigMovieMatch.params.movieId);
    return (
        <>
            <Slider>
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                    <Row 
                        initial={{ x: width + 5 }}
                        animate={{ x: 0 }}
                        exit={{ x: -width - 5 }}
                        key={nowPlayingIndex}
                        transition={{ type: "tween", duration: 1 }}
                    >
                        {nowPlaying?.results
                            .slice(1)
                            .slice(offset * nowPlayingIndex, offset * nowPlayingIndex + offset)
                            .map((movie) => (
                                <Box 
                                    onClick={() => onBoxClicked(movie.id)}
                                    key={movie.id}
                                    whileHover="hover"
                                    initial="normal"
                                    variants={boxVariants}
                                    transition={{ type: "tween" }}
                                    bgphoto={makeImagePath(movie.backdrop_path || movie.poster_path, "w500")}
                                >
                                    <Title>{movie.title}</Title>
                                    <Info 
                                        variants={infoVariants}
                                    >
                                        <h4>⭐️ {movie.vote_average}</h4>
                                        <h4>개봉일: {movie.release_date}</h4>
                                    </Info>
                                </Box>
                            ))
                        }
                    </Row>
                </AnimatePresence>
            </Slider>
            <AnimatePresence>
                {bigMovieMatch ? (
                    <>
                        <Overlay 
                            onClick={onOverlayClick} 
                            exit={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                        />
                        <BigMovie>
                            {clickedNowPlayingMovie && 
                                <>
                                    <BigCover 
                                        style={{
                                            backgroundImage: `
                                                linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent),
                                                url(${makeImagePath(clickedNowPlayingMovie.backdrop_path || clickedNowPlayingMovie.poster_path, "w500")
                                            })`,
                                        }}
                                    >
                                        <BigTitle>{clickedNowPlayingMovie.title}</BigTitle>
                                    </BigCover>
                                    <BigInfo>
                                        <BigVote>
                                            <h4>⭐️ </h4>
                                            <h4>{clickedNowPlayingMovie.vote_average}</h4>
                                        </BigVote>
                                        <BigOverview>{clickedNowPlayingMovie.overview}</BigOverview>
                                    </BigInfo>
                                </>
                            }
                        </BigMovie>
                    </> 
                ) : null}
            </AnimatePresence>
        </>
    );
}

export default HomeSlider;