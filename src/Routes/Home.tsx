import { useQuery } from "react-query";
import { IGetMoviesResult, getMovies } from "../api";
import styled from "styled-components";
import { makeImagePath } from "./utils";
import HomeSlider from "../Components/HomeSlider";
import { AnimatePresence, motion } from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";

const Wrapper = styled.div`
    background: black;
    overflow-x: hidden;
`;

const Loader = styled.div`
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
    background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 1)), url(${(props) => props.bgphoto}); 
    background-size: cover;
`;

const Title = styled.h2`
    font-size: 68px;
    margin-bottom: 20px;
    font-weight: 400;
    text-shadow: black 2px 2px 2px;
`;

const Overview = styled.p`
    font-size: 25px;
    width: 60%;
    margin-bottom: 20px;
`;

const BannerMovieClick = styled.div`
    width: 100px;
    background-color: white;
    color: black;
    font-weight: 600;
    padding: 5px 10px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
`

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


function Home() {
    const { data: nowPlaying, isLoading } = useQuery<IGetMoviesResult>(
        ["movies", "nowPlaying"], 
        getMovies
    );
    // Info창 띄우기
    const navigate = useNavigate();
    const bigMovieMatch = useMatch("/movies/:movieId"); 
    const onBoxClicked = (movieId: number) => {
        navigate(`/movies/${movieId}`);
    };
    const onOverlayClick = () => navigate(-1);
    const clickedMovie = 
        bigMovieMatch?.params.movieId && 
        nowPlaying?.results.find(movie => String(movie.id) === bigMovieMatch.params.movieId);

    return (
        <Wrapper>
            {isLoading ? (
                <Loader>Loading...</Loader>
            ) : (
                <AnimatePresence>
                    <Banner 
                        bgphoto={makeImagePath(nowPlaying?.results[0].backdrop_path || "")}
                    >
                        {nowPlaying?.results[0] && 
                            <>
                                <Title>{nowPlaying?.results[0].title}</Title>
                                <Overview>{nowPlaying?.results[0].overview}</Overview>
                                <BannerMovieClick onClick={() => onBoxClicked(nowPlaying?.results[0].id)}>자세히보기</BannerMovieClick>
                            </>
                        }
                    </Banner>
                    <HomeSlider />
                </AnimatePresence>
            )}
            <AnimatePresence>
                {bigMovieMatch ? (
                    <>
                        <Overlay 
                            onClick={onOverlayClick} 
                            exit={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                        />
                        <BigMovie>
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
                                            <h4>{clickedMovie.vote_average}</h4>
                                        </BigVote>
                                        <BigOverview>{clickedMovie.overview || "설명이 없습니다. 😅"}</BigOverview>
                                    </BigInfo>
                                </>
                            }
                        </BigMovie>
                    </>
                ) : null}   
            </AnimatePresence>
        </Wrapper>  
    );
}
export default Home;