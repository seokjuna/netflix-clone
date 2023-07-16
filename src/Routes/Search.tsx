import { useLocation, useMatch, useNavigate } from "react-router-dom";
import useWindowDimensions from "../Components/useWindowDimensions";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { API_KEY, BASE_PATH, IGetMoviesResult, IGetTvShowResult } from "../api";
import { useQuery } from "react-query";
import { useState } from "react";
import { makeImagePath } from "./utils";

const Slider = styled.div`
    position: relative;
    top: 150px;
    height: 40vh;
    padding: 0 5px;
`;

const Row = styled(motion.div)`
    display: grid;
    grid-template-columns: repeat(6, 2fr);
    gap: 5px;
    width: 100%;
    position: absolute;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
    background-color: white;
    background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${(props) => props.bgphoto}); 
    height: 200px;
    background-size: cover;
    background-position: center center;
    &:first-child {
        transform-origin: center left;
    }
    &:last-child {
        transform-origin: center right;
    }
    cursor: pointer;
    border-radius: 15px;
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

const NoSearchWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;

const NoSearchTitle = styled.h1`
    font-size: 40px;
    font-weight: 400;
    margin-bottom: 10px;
`

const NoSearchSubtitle = styled.h2`
    font-size: 25px;
    font-weight: 300;
`

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
    background-color: rgba(0, 0, 0, 0.9);
`;

const BigSearch = styled(motion.div)`
    position: fixed;
    z-index: 99;
    width: 60vw;
    height: 70vh;
    top: 15%;
    right: 0px;
    left: 0px;
    margin: 0px auto;
    color: rgb(218, 223, 223);
    border-radius: 15px;
    background-color: ${(props) => props.theme.black.lighter};
    overflow-y: hidden;
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

const BigOverview = styled.span`
    padding: 10px;
    color: ${(props) => props.theme.white.lighter};
`;

const Category = styled.h2`
    color: white;
    padding-left: 5px;
    margin-bottom: 10px;
    font-weight: 600;
    font-size: 30px;
    text-shadow: black 2px 2px 2px;
`;


const offset = 6;

function Search() {
    const width = useWindowDimensions();
    const location = useLocation();
    const keyword = new URLSearchParams(location.search).get("keyword");
    const getMovieSearch = () => {
        return fetch(`${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${keyword}&language=ko`)
            .then((response) => response.json()
        );
    };
    const getTvSearch = () => {
        return fetch(`${BASE_PATH}/search/tv?api_key=${API_KEY}&query=${keyword}&language=ko`)
        .then((response) => response.json()
        );
    };
    const { data: movie } = useQuery<IGetMoviesResult>(
        ["search", "movie"], 
        getMovieSearch,
    );
    const { data: tv } = useQuery<IGetTvShowResult>(
        ["search", "tv"],
        getTvSearch
    );
    const result = movie?.results || tv?.results;
    // 슬라이더 index
    const [movieIndex, setMovieIndex] = useState(0);
    const [tvIndex, setTvIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const toggleLeaving = () => setLeaving((prev) => !prev);
    const increaseMovieIndex = () => {
        if (movie) {
            if (leaving) return;
            toggleLeaving();
            const totalMovie = movie.results.length;
            const maxIndex = Math.floor(totalMovie / offset) - 1;
            setMovieIndex((prev) => prev === maxIndex ? 0 : prev + 1);
        }
    };
    const increaseTvIndex = () => {
        if (tv) {
            if (leaving) return;
            toggleLeaving();
            const totalTv = tv.results.length;
            const maxIndex = Math.floor(totalTv / offset) - 1;
            setTvIndex((prev) => prev === maxIndex ? 0 : prev + 1);
        }
    };
    // Info창 띄우기
    const navigate = useNavigate();
    const onMovieClicked = (movieId: number) => {
        navigate(`/search/movies/${movieId}`)
    };
    const onTvClicked = (tvId: number) => {
        navigate(`/search/tv/${tvId}`)
    };
    const onOverlayClick = () => navigate(-1);
    const bigMovieMatch = useMatch("/search/movies/:movieId");
    const bigTvMatch = useMatch("/search/tv/:tvId");
    const clickedMovie = 
        bigMovieMatch?.params.movieId &&
        movie?.results.find(movie => String(movie.id) === bigMovieMatch.params.movieId);
    const clickedTv =
        bigTvMatch?.params.tvId &&
        tv?.results.find(tv => String(tv.id) === bigTvMatch.params.tvId);

    return (
        <>
            {keyword && result?.length !== 0 ? (
                <>
                    <Slider>
                        <Category>영화</Category>
                        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                            <Row
                                initial={{ x: width + 5 }}
                                animate={{ x: 0 }}
                                exit={{ x: -width - 5 }}
                                key={movieIndex}
                                transition={{ type: "tween", duration: 1}}
                            >
                                {movie?.results
                                    .slice(offset * movieIndex, offset * movieIndex + offset)
                                    .map((movie) => (
                                        <Box
                                            onClick={() => onMovieClicked(movie.id)}
                                            key={movie.id}
                                            bgphoto={makeImagePath(movie.backdrop_path || movie.poster_path, "w500")}
                                            whileHover="hover"
                                            initial="normal"
                                            variants={boxVariants}
                                            transition={{ type: "tween" }}
                                        >
                                            <Title>{movie.title}</Title>
                                            <Info
                                                variants={infoVariants}
                                            >
                                            <h4>⭐️ {movie.vote_average.toFixed(1)}</h4>
                                            <h4>개봉일: {movie.release_date}</h4>
                                            </Info>  
                                        </Box> 
                                    ))
                                }
                            </Row>
                        </AnimatePresence>
                    </Slider>
                    <Slider>
                        <Category>TV 프로그램</Category>
                        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                            <Row
                                initial={{ x: width + 5 }}
                                animate={{ x: 0 }}
                                exit={{ x: -width - 5 }}
                                key={tvIndex}
                            transition={{ type: "tween", duration: 1}}
                            >
                                {tv?.results
                                    .slice(offset * tvIndex, offset * tvIndex + offset)
                                    .map((tv) => (
                                        <Box
                                            onClick={() => onTvClicked(tv.id)}
                                            key={tv.id}
                                            bgphoto={makeImagePath(tv.backdrop_path || tv.poster_path, "w500")}
                                            whileHover="hover"
                                            initial="normal"
                                            variants={boxVariants}
                                            transition={{ type: "tween" }}
                                        >
                                            <Title>{tv.name}</Title>
                                            <Info
                                                variants={infoVariants}
                                            >
                                            <h4>⭐️ {tv.vote_average.toFixed(1)}</h4>
                                            <h4>방영일: {tv.first_air_date}</h4>
                                            </Info>  
                                        </Box>  
                                    ))
                                }
                            </Row>
                        </AnimatePresence>
                    </Slider>
                </>
            ) : (
                <NoSearchWrapper>
                    <NoSearchTitle>검색결과가 없습니다.</NoSearchTitle>
                    <NoSearchSubtitle>검색 아이콘을 클릭하여 작품을 검색하세요!</NoSearchSubtitle>
                </NoSearchWrapper>
            )}
            <AnimatePresence>
                {bigMovieMatch ? (
                    <>
                        <Overlay
                            onClick={onOverlayClick}
                            exit={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                        />
                        <BigSearch
                                transition={{ type: "tween", duration: 1 }} 
                        >
                            {clickedMovie && 
                                <>
                                    <BigCover 
                                        style={{
                                            backgroundImage: `
                                                linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent),
                                                url(${makeImagePath(clickedMovie.backdrop_path || clickedMovie.poster_path, "w500")
                                            })`,
                                        }}
                                    >
                                        <BigTitle>{clickedMovie.title}</BigTitle>
                                    </BigCover>
                                    <BigInfo>
                                        <BigVote>
                                            <h4>⭐️ </h4>
                                            <h4>{clickedMovie.vote_average.toFixed(1)}</h4>
                                        </BigVote>
                                        <BigOverview>{clickedMovie.overview || "설명이 없습니다. 😅"}</BigOverview>
                                    </BigInfo>
                                </>
                            }
                        </BigSearch>
                    </>
                ) : null}
                {bigTvMatch ? (
                    <>
                        <Overlay
                            onClick={onOverlayClick}
                            exit={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                        />
                        <BigSearch
                                transition={{ type: "tween", duration: 1 }} 
                        >
                            {clickedTv && 
                                <>
                                    <BigCover 
                                        style={{
                                            backgroundImage: `
                                                linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent),
                                                url(${makeImagePath(clickedTv.backdrop_path || clickedTv.poster_path, "w500")
                                            })`,
                                        }}
                                    >
                                        <BigTitle>{clickedTv.name}</BigTitle>
                                    </BigCover>
                                    <BigInfo>
                                        <BigVote>
                                            <h4>⭐️ </h4>
                                            <h4>{clickedTv.vote_average.toFixed(1)}</h4>
                                        </BigVote>
                                        <BigOverview>{clickedTv.overview || "설명이 없습니다. 😅"}</BigOverview>
                                    </BigInfo>
                                </>
                            }   
                        </BigSearch>
                    </>
                ) : null}
            </AnimatePresence>
        </>
    )
}
export default Search;