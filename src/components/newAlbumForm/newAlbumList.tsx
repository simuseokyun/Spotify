import styled from 'styled-components';
import { useQuery } from 'react-query';
import { getNewAlbum } from '../../api/api';
import { NewAlbumItem } from './newAlbumItem';
import { setMobile, typeTransform } from '../../state/atoms';
import { useRecoilValue } from 'recoil';
import { useState } from 'react';
import { getLocalStorage } from '../../utils/util';
import { INewAlbums } from '../../types/newAlbums';
import { NextBtn, PrevBtn, Message } from '../../styles/common.style';
import { NewAlbumFirst } from './newAlbumFirst';

const Container = styled.div`
    width: 100%;
`;

const Row = styled.div`
    position: relative;
    width: 100%;
`;
const NewAlbumList = styled.ul<{ state: string }>`
    width: 100%;
    display: grid;
    grid-template-columns: ${({ state }) => `repeat(${state === 'true' ? 3 : 4}, 1fr)`};
    /* gap: 5px; */
    width: 100%;
`;
const BtnWrap = styled.div`
    text-align: right;
`;

const Title = styled.h1`
    font-size: 24px;
    font-weight: 700;
    @media (max-width: 768px) {
        font-size: 20px;
    }
    @media (max-width: 425px) {
        font-size: 16px;
    }
`;
const TopWrap = styled.div`
    margin: 30px 0 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    @media (max-width: 768px) {
        margin: 20px 0 5px 0;
    }
    @media (max-width: 425px) {
    }
`;

export const NewAlbum = () => {
    const isMobile = useRecoilValue(setMobile);
    const offset = isMobile ? 3 : 4;
    const [index, setIndex] = useState(0);
    const onNextBtn = () => {
        if (isMobile) {
            setIndex((prev) => (prev === 6 ? 0 : prev + 1));
        } else {
            setIndex((prev) => (prev === 4 ? 0 : prev + 1));
        }
    };
    const onPrevBtn = () => {
        if (isMobile) {
            setIndex((prev) => (prev === 0 ? 6 : prev - 1));
        } else {
            setIndex((prev) => (prev === 0 ? 4 : prev - 1));
        }
    };
    const token = getLocalStorage('webAccessToken');
    const {
        isLoading: newAlbumLoading,
        data: newAlbumData,
        isError,
    } = useQuery<INewAlbums>(
        'newAlbum',
        async () => {
            if (token) {
                return getNewAlbum(token);
            }
        },
        {
            enabled: !!token,
            onError: (error) => {
                console.error('API 요청 에러:', error);
            },
        }
    );
    if (newAlbumLoading) {
        return <Message>로딩 중</Message>;
    }
    return (
        <>
            {newAlbumData && (
                <Container>
                    <NewAlbumFirst
                        cover={newAlbumData?.albums?.items[0].images[0].url}
                        type={
                            newAlbumData?.albums?.items[0].album_type === 'single'
                                ? typeTransform.single
                                : typeTransform.album
                        }
                        name={newAlbumData?.albums?.items[0].name}
                        artist={newAlbumData?.albums?.items[0].artists[0].name}
                    />
                    <TopWrap>
                        <Title>최신 음악</Title>
                        <BtnWrap>
                            <PrevBtn src="/images/leftArrow.png" onClick={onPrevBtn}></PrevBtn>
                            <NextBtn src="/images/rightArrow.png" onClick={onNextBtn}></NextBtn>
                        </BtnWrap>
                    </TopWrap>
                    <Row>
                        <NewAlbumList state={isMobile.toString()}>
                            {newAlbumData?.albums?.items
                                .slice(1)
                                .slice(offset * index, offset * (index + 1))
                                .map((item) => (
                                    <NewAlbumItem
                                        key={item.id}
                                        id={item.id}
                                        name={item.name}
                                        artist={item.artists[0].name}
                                        cover={item.images[0].url}
                                    ></NewAlbumItem>
                                ))}
                        </NewAlbumList>
                    </Row>
                </Container>
            )}
        </>
    );
};
