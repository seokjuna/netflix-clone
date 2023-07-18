import { useQuery } from "react-query";
import { IGetMoviesResult, getMovies } from "../api";
import styled from "styled-components";
import { makeImagePath } from "./utils";
import HomeSlider from "../Components/HomeSlider";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

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

function Home() {
    const { data: nowPlaying, isLoading } = useQuery<IGetMoviesResult>(
        ["movies", "nowPlaying"], 
        getMovies
    );
    // Info창 띄우기
    const navigate = useNavigate();
    const onBoxClicked = (movieId: number) => {
        navigate(`/movies/${movieId}`);
    };

    return (
        <Wrapper>
            {isLoading ? (
                <Loader>Loading...</Loader>
            ) : (
                <AnimatePresence>
                    <Banner
                        key={nowPlaying?.results[0].id}
                        bgphoto={makeImagePath(nowPlaying?.results[0].backdrop_path || "")}
                    >
                        {nowPlaying?.results[0] && 
                            <>
                                <Title>{nowPlaying?.results[0].title}</Title>
                                <Overview>{nowPlaying?.results[0].overview ? nowPlaying?.results[0].overview : "설명이 없습니다. 😅"}</Overview>
                                <BannerMovieClick 
                                    onClick={() => onBoxClicked(nowPlaying?.results[0].id)}
                                >
                                    자세히보기
                                </BannerMovieClick>
                            </>
                        }
                    </Banner>
                    <HomeSlider />
                </AnimatePresence>
            )}
        </Wrapper>  
    );
}
export default Home;