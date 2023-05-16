import { useQuery } from "react-query";
import { IGetMoviesResult, getMovies } from "../api";
import styled from "styled-components";
import { makeImagePath } from "./utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import useWindowDimensions from "../Components/useWindowDimensions";
import { useMatch, useNavigate } from "react-router-dom";

const Wrapper = styled.div`
    background: black;
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
`;

const Overview = styled.p`
    font-size: 30px;
    width: 50%;
`;

const Slider = styled.div`
    position: relative;
    top: -100px;
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
    background-image: url(${(props) => props.bgphoto});
    background-size: cover;
    background-position: center center;
    height: 200px;
    font-size: 66px;
    &:first-child {
        transform-origin: center left;
    }
    &:last-child {
        transform-origin: center right;
    }
    cursor: pointer;
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
    }
`;

const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
`;

const BigMovie = styled(motion.div)`
    position: fixed;
    width: 60vw;
    height: 70vh;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
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

const infoVariants = {
    hover: {
        opacity: 1,
        transition: {
            delay: 0.3,
            type: "tween",
        },
    },
}

const overlayVariants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opaicity: 0.7,
    },
    exit: {
        opacity: 0,
    },
}

const offset = 6;

function Home() {
    const navigate = useNavigate();
    const bigMovieMatch = useMatch("/movies/:id"); // const moviePathMatch<string> | null = useMatch("/movies/:id");
    console.log(bigMovieMatch);
    const width = useWindowDimensions();
    const { data, isLoading } = useQuery<IGetMoviesResult>(
        ["movies", "nowPlaying"], 
        getMovies
    );
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const increaseIndex = () => {
        if (data) {
            if (leaving) return;
            toggleLeaving();
            const totalMovies = data.results.length;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex((prev) => prev === maxIndex ? 0 : prev + 1);
        }
    };
    const toggleLeaving = () => setLeaving((prev) => !prev);
    const onBoxClicked = (movieId: number) => {
        navigate(`/movies/${movieId}`);
    };
    const onOverlayClick = () => navigate(-1);

    return (
        <Wrapper>
            {isLoading ? (
                <Loader>Loading...</Loader>
            ) : (
                <>
                    <Banner 
                        onClick={increaseIndex} 
                        bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}
                    >
                        <Title>{data?.results[0].title}</Title>
                        <Overview>{data?.results[0].overview}</Overview>
                    </Banner>
                    <Slider>
                        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                            <Row 
                                initial={{ x: width + 5 }}
                                animate={{ x: 0 }}
                                exit={{ x: -width - 5 }}
                                key={index}
                                transition={{ type: "tween", duration: 1 }}
                            >
                                {data?.results
                                    .slice(1)
                                    .slice(offset * index, offset * index + offset)
                                    .map((movie) => (
                                    <Box 
                                        layoutId={movie.id + ""}
                                        onClick={() => onBoxClicked(movie.id)}
                                        key={movie.id}
                                        whileHover="hover"
                                        initial="normal"
                                        variants={boxVariants}
                                        transition={{ type: "tween" }}
                                        bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                                    >
                                        <Info
                                            variants={infoVariants}
                                        >
                                            <h4>{movie.title}</h4>
                                        </Info>
                                    </Box>
                                ))}
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
                                <BigMovie
                                    layoutId={bigMovieMatch.params.id}
                                />
                            </> 
                        ) : null}
                    </AnimatePresence>
                </>
            )}
        </Wrapper>
    );
}
export default Home;