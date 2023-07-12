import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import useWindowDimensions from "./useWindowDimensions";
import { IGetTvShow, getPopularTvShow, getTopRatedTvShow, getTvShow } from "../api";
import { useQuery } from "react-query";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import { makeImagePath } from "../Routes/utils";

const Slider = styled.div`
    position: relative;
    top: -100px;
    height: 35vh;
    padding: 0 5px;
`;

const Row = styled(motion.div)`
    display: grid;
    grid-template-columns: repeat(6, 3fr);
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

const BigTv = styled(motion.div)`
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

function TvSlider() {
    const width = useWindowDimensions();
    // api 받아오기
    const { data: onTheAir } = useQuery<IGetTvShow>(
        ["tvShow", "onTheAir"],
        getTvShow
    );
    const { data: popular } = useQuery<IGetTvShow>(
        ["tvShow", "popular"],
        getPopularTvShow
    );
    const { data: topRated } = useQuery<IGetTvShow>(
        ["tvShow", "topRated"],
        getTopRatedTvShow
    );
    // 슬라이더 index
    const [onTheAirIndex, setOnTheAirIndex] = useState(0);
    const [popularIndex, setPopularIndex] = useState(0);
    const [topRatedIndex, setTopRatedIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const toggleLeaving = () => setLeaving((prev) => !prev);
    const increaseOnTheAirIndex= () => {
        if (onTheAir) {
            if (leaving) return;
            toggleLeaving();
            const totalOnTheAirTvShow = onTheAir.results.length;
            const maxIndex = Math.floor(totalOnTheAirTvShow / offset) - 1;
            setOnTheAirIndex((prev) => prev === maxIndex ? 0 : prev + 1);
        }
    };
    const increasePopularIndex= () => {
        if (popular) {
            if (leaving) return;
            toggleLeaving();
            const totalPopularTvShow = popular.results.length;
            const maxIndex = Math.floor(totalPopularTvShow / offset) - 1;
            setPopularIndex((prev) => prev === maxIndex ? 0 : prev + 1);
        }
    };
    const increaseTopRatedIndex= () => {
        if (topRated) {
            if (leaving) return;
            toggleLeaving();
            const totalTopRatedTvShow = topRated.results.length;
            const maxIndex = Math.floor(totalTopRatedTvShow / offset) - 1;
            setTopRatedIndex((prev) => prev === maxIndex ? 0 : prev + 1);
        }
    };

    // Info창 띄우기
    const navigate = useNavigate();
    const onBoxClicked = (tvId: number) => {
        navigate(`/tv/${tvId}`);
    };
    const onOverlayClick = () => navigate(-1);
    const bigTvMatch = useMatch("/tv/:tvId");
    const clickedOnTheAirTv = 
        bigTvMatch?.params.tvId &&
        onTheAir?.results.find(tvshow => String(tvshow.id) === bigTvMatch.params.tvId);
    const clickedPopularTv =
        bigTvMatch?.params.tvId &&
        popular?.results.find(tvshow => String(tvshow.id) === bigTvMatch.params.tvId);
    const clickedTopRatedTv = 
        bigTvMatch?.params.tvId &&
        topRated?.results.find(tvshow => String(tvshow.id) === bigTvMatch.params.tvId);
        
    return (
        <>
            <Slider>
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                    <Row
                        initial={{ x: width + 5 }}
                        animate={{ x: 0 }}
                        exit={{ x: -width - 5 }}
                        key={onTheAirIndex}
                        transition={{ type: "tween", duration: 1}}
                    >
                        {onTheAir?.results
                            .slice(1)
                            .slice(offset * onTheAirIndex, offset * onTheAirIndex + offset)
                            .map((tvshow) => (
                                <Box 
                                    onClick={() => onBoxClicked(tvshow.id)}
                                    key={tvshow.id}
                                    bgphoto={makeImagePath(tvshow.backdrop_path || tvshow.poster_path, "w500")}
                                    whileHover="hover"
                                    initial="normal"
                                    variants={boxVariants}
                                    transition={{ type: "tween" }}
                                    layoutId={tvshow.id + ""}
                                >
                                    <Title>{tvshow.name}</Title>
                                    <Info
                                        variants={infoVariants}
                                    >
                                        <h4>⭐️ {tvshow.vote_average}</h4>
                                        <h4>방영일: {tvshow.first_air_date}</h4>
                                    </Info>   
                                </Box>
                            ))
                        }
                    </Row>
                </AnimatePresence>
            </Slider>
            <Slider>
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                    <Row
                        initial={{ x: width + 5 }}
                        animate={{ x: 0 }}
                        exit={{ x: -width - 5 }}
                        key={popularIndex}
                        transition={{ type: "tween", duration: 1 }}
                    >
                        {popular?.results
                            .slice(offset * popularIndex, offset * popularIndex + offset)
                            .map((tvshow) => (
                                <Box 
                                    onClick={() => onBoxClicked(tvshow.id)}
                                    key={tvshow.id}
                                    bgphoto={makeImagePath(tvshow.backdrop_path || tvshow.poster_path, "w500")}
                                    whileHover="hover"
                                    initial="normal"
                                    variants={boxVariants}
                                    transition={{ type: "tween" }}
                                >
                                    <Title>{tvshow.name}</Title>
                                    <Info
                                        variants={infoVariants}
                                    >
                                        <h4>⭐️ {tvshow.vote_average}</h4>
                                        <h4>방영일: {tvshow.first_air_date}</h4>
                                    </Info>   
                                </Box>
                            ))
                        }
                    </Row>
                </AnimatePresence>
            </Slider>
            <Slider>
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                    <Row
                        initial={{ x: width + 5 }}
                        animate={{ x: 0 }}
                        exit={{ x: -width - 5 }}
                        key={popularIndex}
                        transition={{ type: "tween", duration: 1}}
                    >
                        {popular?.results
                            .slice(1)
                            .slice(offset * popularIndex, offset * popularIndex + offset)
                            .map((tvshow) => (
                                <Box 
                                    onClick={() => onBoxClicked(tvshow.id)}
                                    key={tvshow.id}                                        
                                    bgphoto={makeImagePath(tvshow.backdrop_path || tvshow.poster_path, "w500")}
                                    whileHover="hover"
                                    initial="normal"
                                    variants={boxVariants}
                                    transition={{ type: "tween" }}
                                >
                                    <Title>{tvshow.name}</Title>
                                    <Info
                                        variants={infoVariants}
                                    >
                                        <h4>⭐️ {tvshow.vote_average}</h4>
                                        <h4>방영일: {tvshow.first_air_date}</h4>
                                    </Info>   
                                </Box>
                            ))
                        }                        
                    </Row>
                </AnimatePresence>
            </Slider>
            <Slider>
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                    <Row
                        initial={{ x: width + 5 }}
                        animate={{ x: 0 }}
                        exit={{ x: -width - 5 }}
                        key={topRatedIndex}
                        transition={{ type: "tween", duration: 1}}
                    >
                        {topRated?.results
                            .slice(1)
                            .slice(offset * topRatedIndex, offset * topRatedIndex + offset)
                            .map((tvshow) => (
                                <Box 
                                    onClick={() => onBoxClicked(tvshow.id)}
                                    key={tvshow.id}                                        
                                    bgphoto={makeImagePath(tvshow.backdrop_path || tvshow.poster_path, "w500")}
                                    whileHover="hover"
                                    initial="normal"
                                    variants={boxVariants}
                                    transition={{ type: "tween" }}
                                >
                                    <Title>{tvshow.name}</Title>
                                    <Info
                                        variants={infoVariants}
                                    >
                                        <h4>⭐️ {tvshow.vote_average}</h4>
                                        <h4>방영일: {tvshow.first_air_date}</h4>
                                    </Info>   
                                </Box>
                            ))
                        }                        
                    </Row>
                </AnimatePresence>
            </Slider>
            <AnimatePresence>
                {bigTvMatch ? (
                    <>
                        <Overlay 
                            onClick={onOverlayClick}
                            exit={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        />
                        <BigTv
                            transition={{ type: "tween", duration: 1 }}
                        >
                            {clickedOnTheAirTv &&
                                <>
                                    <BigCover 
                                        style={{
                                            backgroundImage: `
                                                linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent),
                                                url(${makeImagePath(clickedOnTheAirTv.backdrop_path || clickedOnTheAirTv.poster_path, "w500")
                                            })`,
                                        }}
                                    >
                                        <BigTitle>{clickedOnTheAirTv.name}</BigTitle>
                                    </BigCover>
                                    <BigInfo>
                                        <BigVote>
                                            <h4>⭐️ </h4>
                                            <h4>{clickedOnTheAirTv.vote_average}</h4>
                                        </BigVote>
                                        <BigOverview>{clickedOnTheAirTv.overview ? clickedOnTheAirTv.overview : "설명이 없습니다. 😅"}</BigOverview>
                                    </BigInfo>
                                </>
                            }
                            {clickedPopularTv && 
                                <>
                                    <BigCover 
                                        style={{
                                            backgroundImage: `
                                                linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent),
                                                url(${makeImagePath(clickedPopularTv.backdrop_path || clickedPopularTv.poster_path, "w500")
                                            })`,
                                        }}
                                     >
                                        <BigTitle>{clickedPopularTv.name}</BigTitle>
                                    </BigCover>
                                    <BigInfo>
                                        <BigVote>
                                            <h4>⭐️ </h4>
                                            <h4>{clickedPopularTv.vote_average}</h4>
                                        </BigVote>
                                        <BigOverview>{clickedPopularTv.overview ? clickedPopularTv.overview : "설명이 없습니다. 😅"}</BigOverview>
                                    </BigInfo>
                                </>
                            }
                                                        {clickedTopRatedTv && 
                                <>
                                    <BigCover 
                                        style={{
                                            backgroundImage: `
                                                linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent),
                                                url(${makeImagePath(clickedTopRatedTv.backdrop_path || clickedTopRatedTv.poster_path, "w500")
                                            })`,
                                        }}
                                    >
                                        <BigTitle>{clickedTopRatedTv.name}</BigTitle>
                                    </BigCover>
                                    <BigInfo>
                                        <BigVote>
                                            <h4>⭐️ </h4>
                                            <h4>{clickedTopRatedTv.vote_average}</h4>
                                        </BigVote>
                                        <BigOverview>{clickedTopRatedTv.overview ? clickedTopRatedTv.overview : "설명이 없습니다. 😅"}</BigOverview>
                                    </BigInfo>
                                </>
                            }
                        </BigTv>
                    </>
                ) : null}
            </AnimatePresence>
        </>
    );
}

export default TvSlider;