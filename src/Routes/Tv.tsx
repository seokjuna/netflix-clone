import { useQuery } from "react-query";
import styled from "styled-components";
import { IGetTvShowResult, getTvShow } from "../api";
import { makeImagePath } from "./utils";
import TvSlider from "../Components/TvSlider";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

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

const BannerTvClick = styled.div`
    width: 100px;
    background-color: white;
    color: black;
    font-weight: 600;
    padding: 5px 10px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
`

function Tv() {    
    const { data: onTheAir, isLoading } = useQuery<IGetTvShowResult>(
        ["tvshows", "onTheAir"],
        getTvShow
    );
    // Info창 띄우기
    const navigate = useNavigate();
    const onBoxClicked = (tvId: number) => {
        navigate(`/tv/${tvId}`);
    };

    return (
        <Wrapper>
            {isLoading ? (
                <Loader>Loading...</Loader>
            ) : (
                <AnimatePresence>
                    <Banner
                        key={onTheAir?.results[0].id}
                        bgphoto={makeImagePath(onTheAir?.results[0].backdrop_path || "")}
                    >
                        {onTheAir?.results[0] &&
                            <>
                                <Title>{onTheAir?.results[0].name}</Title>
                                <Overview>{onTheAir?.results[0].overview ? onTheAir?.results[0].overview : "설명이 없습니다. 😅"}</Overview>
                                <BannerTvClick onClick={() => onBoxClicked(onTheAir?.results[0].id)}>자세히보기</BannerTvClick>
                            </>
                        }
                    </Banner>
                    <TvSlider />
                </AnimatePresence>
            )}
        </Wrapper>
    );
}

export default Tv;