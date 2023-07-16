import { useQuery } from "react-query";
import styled from "styled-components";
import { IGetTvShowResult, getTvShow } from "../api";
import { makeImagePath } from "./utils";
import TvSlider from "../Components/TvSlider";

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

function Tv() {    
    const { data: onTheAir, isLoading } = useQuery<IGetTvShowResult>(
        ["tvshows", "onTheAir"],
        getTvShow
    );

    return (
        <Wrapper>
            {isLoading ? (
                <Loader>Loading</Loader>
            ) : (
                <>
                    <Banner
                        bgphoto={makeImagePath(onTheAir?.results[0].backdrop_path || "")}
                    >
                        <Title>{onTheAir?.results[0].name}</Title>
                        <Overview>{onTheAir?.results[0].overview ? onTheAir?.results[0].overview : "설명이 없습니다. 😅"}</Overview>
                    </Banner>
                    <TvSlider />
                </>
            )}
        </Wrapper>
    );
}

export default Tv;