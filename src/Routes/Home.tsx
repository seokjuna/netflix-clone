import { useQuery } from "react-query";
import { IGetMoviesResult, getMovies } from "../api";
import styled from "styled-components";
import { makeImagePath } from "./utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import useWindowDimensions from "../Components/useWindowDimensions";
import { useMatch, useNavigate } from "react-router-dom";
import HomeSlider from "../Components/HomeSlider";

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
`;

function Home() {
    const { data: nowPlaying, isLoading } = useQuery<IGetMoviesResult>(
        ["movies", "nowPlaying"], 
        getMovies
    );

    return (
        <Wrapper>
            {isLoading ? (
                <Loader>Loading...</Loader>
            ) : (
                <>
                    <Banner 
                        bgphoto={makeImagePath(nowPlaying?.results[0].backdrop_path || "")}
                    >
                        <Title>{nowPlaying?.results[0].title}</Title>
                        <Overview>{nowPlaying?.results[0].overview}</Overview>
                    </Banner>
                    <HomeSlider />
                </>
            )}
        </Wrapper>
    );
}
export default Home;