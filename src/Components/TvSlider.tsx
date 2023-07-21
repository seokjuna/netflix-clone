import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import useWindowDimensions from "./useWindowDimensions";
import { IGetTvShowResult, getPopularTvShow, getTopRatedTvShow, getTvShow } from "../api";
import { useQuery } from "react-query";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import { makeImagePath } from "../Routes/utils";
import { Helmet } from "react-helmet-async";

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

const Category = styled.h2`
    color: white;
    padding-left: 5px;
    margin-bottom: 10px;
    font-weight: 600;
    font-size: 30px;
    text-shadow: black 2px 2px 2px;
`;

const Arrow = styled(motion.img)`
    width: 70px;
    height: 70px;
    cursor: pointer;
    position: absolute;
    top: 100px;
    z-index: 99;
    right: 0;
    opacity: 0.5;
`;

const arrowVariants = {
    hover: {
        opacity: 1,
    },
}

const offset = 6;

function TvSlider() {
    const width = useWindowDimensions();
    // api 받아오기
    const { data: onTheAir } = useQuery<IGetTvShowResult>(
        ["tvShow", "onTheAir"],
        getTvShow
    );
    const { data: popular } = useQuery<IGetTvShowResult>(
        ["tvShow", "popular"],
        getPopularTvShow
    );
    const { data: topRated } = useQuery<IGetTvShowResult>(
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
                <Category>방영 중인 TV 프로그램</Category>
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                    <Arrow 
                        variants={arrowVariants}
                        whileHover="hover"
                        onClick={increaseOnTheAirIndex}
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABmJLR0QA/wD/AP+gvaeTAAAJlElEQVR4nO2dX0xU2R3Hv5dRHHCdPwR8AWFgoQ70r+24EEJqXfsgKiabZttNu9kmbTaoYAKBZNO6adpqja5sagMJ8UEfSEh8aOKDvkBhLYXpBAqlNYFhTRQYBMuAzF9E+XNPHy4znrkM/65z77no+SQ3XibjPed8v3POued3zzkX4HA4HA6Hw+FwOBwOh8PhcDgcBQisM7AN9gKwA/jG6r85q59ZALyz+p0wAD+AeQDjAEYAfL16zGucX0Xo2ZBkAD8EcBTA+wAcAHYpvNYygH8B+ArAfQDdABYTkMe3gm8CuAJgGgBR6ZgDcANAGXT2o9RLZgwAPgTwGwDf2eB7xGq1hvLy8haKiooMaWlpuzIyMvaYzeZkAAgEAoter/elz+dbHhoaEkdHR40+n28fNi7nfwFcBvBXAGKCyrNjEQD8EsBDxPklC4KwbLfbp+vr6wOdnZ0kHA6T7RIOh0lHRwepq6sL2O12ryAIK/HSgtTffAz9/Eg157sAnIgjTmZm5tylS5eeP336dNsGbMbU1BRpaGh4npeXNxMvbUj9y0a19I1jD4AvASwhVgixtLR02ul0igl3YR16enpIWVnZHNaasgTgC0g3Fm807wLoh0yA4uLi2cHBQa18WMPAwABxOByz8nwB6AOQy0gr1fkAQABUgc1mc/D27duLzJyQ0draumgymYKINcUHoIKZaipxBtJYIFrQioqK2WAwyNqDNfj9fnLy5El5M7YM4FNm6iWYz0AVzmAwLDY0NCywFn4zbt269dxgMLxArDFXGOqYEH4HqkApKSnhvr6+FdZibxWXyyWmpKTMI9aUzxnq+VpUgipIWlpaYGRkhLXG28btdhOr1RrT9wE4z1BXRXwAqs9IS0sLTExMsNZWMR6PR27KMnZQR/8upIhrtJlyu92sNX1tHj58SFJTU0OIvfvS/S3xHlDjDIPB8LKvr0+zgZ7auFwu0WAwLOKVKb3Q+eDxS1BtbXNzs+7vprZLU1PTAmL7k6sM9d6Qb4MKh5w4cWKOtXhqcfr0aXpUvwQpLqcrkgD8E9QIXI+DvkTh9/uJbET/D+gsSvwJqGqsVjhEFEXS2NhIzp8/T548eaJGElumtbWV7ksIgF8w1D8GA6Rn1tFAoVoi3LlzJyqAzWYjo6OjaiW1JWQBSTekloI5H4EKoasZtb17925MNJa1Kf39/fLo8IesTKD5D1YzVFZWNqO2CGfOnNGVKSUlJV4qP/9mZ4PEe6DEcTqdqgsgiqKuTOnu7pbXEgcrMwCgKZKRnJwc1foOOaIokqqqqhghsrOzyaNHj7TKQgwHDhyg+5K/sDIjGUD0ufTVq1efaymCnky5fPnycyofXgC7WRjy40gmBEFYVmNCwmaIokgqKyuZN1+Tk5NENpvlKAtDLkcyYLfbpzVVgEIvNaWgoIDu3P/IwhBXJAP19fUBTUsvQw+m1NbW0uH5Hq3N2AsqbtXZ2alZwdeDdfPV3t5Op70IIFVLQ35AJS4qmVGoBixNCYVCBNJU1Ejah7Q05OeRhK1WK9PmSg7L5stsNtMBx58pEVZp7OVg5CQvL++FwmuogiAIaGxsRFVVVfQzj8eDo0eP4vHjx6qmnZubu0D9eXDdL26AUkNyIieFhYW6CKjRREyprKyMfubxeHDs2DGMjY2plm5RURGthU3JNZSKaYqc7N+/n8kgaDMEQUBzc3NMTRkbG8ORI0dUqykZGRn0gqJ9Sq6h1JC9kROLxaLbZ8ob1ZTx8fGEp2e1WmktTOt+cQOUGhJ1X8+GAK9qCm3K2NgYqqurE56WzBBNawhHJZQaEoqc+P1+XS+eJITg7NmzuHHjRvQzm82GpqamhKfl8/loLULrfnEDlBoSjpzo2RBCCKqrq2PMyM7ORmdnJ3Jycjb4n8qQGRJUcg2ly4yj7nu93iWF11CV9WrG/fv3YbMpuiPdlJmZmWXqT01rSPQWxe12627l6kY1Qy0zAGB4eJjWQr0BTxx0HTo5d+7cjg2dKOX74MHFGILBoDy4+D0tDYkJv3d0dKhe4M1gHX5va2tjGn4HqAdUdXV1b/0DqpqaGvoBVbfWZgDAnyIZsNvtXs1KLkMPZhBCSH5+Pv0I9w8sDDkWyYAgCCtTU1OaCkAI+2YqwsTEBBEEge4/fsTCkN2gpgFduXLlrZ0GdPHiRXph6DQYTQMCgMZIRrKysp5pJYCezCCEkKysLHqi3J9ZmQEAh2lRenp6VC+83qaSdnV10U0VgTTfgCmDqxkhpaWlb91k68OHD9Od+QA7G17xU1CDxIGBAdUKr7flCL29vfKJ1j9hZQKNAdLmXwQAcTgcqk26vnfvnm7MEEWRHDp0iO47hqCj50sfg/qltLa2qrbDT3NzM6mrqyOTk5NqJbElWlpaXiK2dnzEUP81CJBGpwQAMZlMwUBAVzHHhOLz+ci+ffvoTQT+Dp0t+gSAb0GK4RAApLy8/I1dFn3q1Cn5smjdbgn4Bahq3NjYqOlgUQuuX79OrwUhkFYB6JZkSNviEUDaG8vlcr0xW2s4nc6VpKQkejm0CwxH5VslG8AzrGbaaDSGh4eHWWv52gwNDRGj0UiHSOawAzafiVABansmq9Ua8Hg8rDVVzPj4OLFYLHR4fQnACYb6KuITUE/QzGZz6MGDB6y13TbDw8PyvbJEAL9mqOtr8TmoDtBoNIZdLteO2eLP6XSKsmaKQNoOfUfzGaiakpSUtCM2wbx58+a8wWCgB38igN8z1DGhfArZNrHl5eWzfr+fte5r8Pl85Pjx4/JtYpcA/IqZeipRAWlbvGhBTSZTUM0wy3YQRZG0tLS8lI3ACaQ7xh3XgW+VXEjb4sVESR0Ox2x/fz8zM3p7e+WBQnqckfg5pzojGdK2ePL9pkhJSYm3u7tbs4FkV1cXKS4ujmfEIqQRuO4HfYnkIIC/Ya0YJDMzc+7ChQsLaoTXJycnybVr1+ZtNps3XtoAuiDF5d5KBEg7sbkRRxxBEFYKCgq8tbW1gfb2dhIKhbZtQDAYJG1tbaSmpsafn5/vlc0OoY8hSCF0plFbvYSMkyA9bfstNpmCabFYgrm5uS8KCwuT0tPTd6WnpydbLJY9AOD3+1/Ozs4uzszMLLvdbnF0dNQYCAQ2W1o2CGmO2R3wVx7FJfJSsP8h/i85EcczvHopmK7QSw2Jx25Igr2/erwH5etZliBFob9aPXogjYt0h54NkZMK6UaAfrHkOwCseLUqeB7SWCcMaX3G15BeODYCYAEcDofD4XA4HA6Hw+FwOBwOh/Om8n8I2CLksrqcUAAAAABJRU5ErkJggg=="  
                    />
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
                <Category>인기있는 TV 프로그램</Category>
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                    <Arrow 
                        variants={arrowVariants}
                        whileHover="hover"
                        onClick={increasePopularIndex} 
                        src="data:image/png;base64,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"  
                    />
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
                <Category>평점 높은 TV 프로그램</Category>
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                    <Arrow 
                        variants={arrowVariants}
                        whileHover="hover"
                        onClick={increaseTopRatedIndex}
                        src="data:image/png;base64,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"  
                    />
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
                                    <Helmet>
                                        <title>{clickedOnTheAirTv.name}</title>
                                    </Helmet>
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
                                    <Helmet>
                                        <title>{clickedPopularTv.name}</title>
                                    </Helmet>
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
                                    <Helmet>
                                        <title>{clickedTopRatedTv.name}</title>
                                    </Helmet>
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