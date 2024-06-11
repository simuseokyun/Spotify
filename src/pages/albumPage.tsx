import { useParams } from 'react-router-dom';
import { clickMenuAlbum, clickMenuPlaylist, saveAlbumList, typeTransform } from '../state/atoms';
import { useQuery } from 'react-query';
import { getAlbum } from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { AlbumTracks } from '../components/albumForm/albumTrackItem';
import { getLocalStorage } from '../utils/util';
import styled from 'styled-components';
import { Button } from '../components/buttonForm/button';
import { IAlbumInfo } from '../types/albumInfo';
import { Message } from '../styles/common.style';
import { AlbumInfo } from '../components/albumForm/albumInfo';
import { AlbumTrackList } from '../components/albumForm/albumTrackList';

const Container = styled.div`
    background-color: rgba(0, 0, 0, 0.7);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 50px 0;
    box-sizing: border-box;
    z-index: 3;
`;
const AlbumWrap = styled.div`
    width: 90%;
    max-width: 860px;
    height: 700px;
    position: relative;
    border-radius: 8px;
    overflow-y: scroll;
`;
const TrackListsWrap = styled.div`
    padding: 20px;
    background: linear-gradient(90deg, black 0%, #392f31);
`;
const CloseBtn = styled.span`
    position: absolute;
    top: 20px;
    right: 20px;
    background-color: rgba(0, 0, 0, 0.4);
    font-size: 25px;
    border-radius: 25px;
    padding: 5px;
    cursor: pointer;
    &:hover {
        background-color: rgba(0, 0, 0, 0.8);
    }
`;

const Copyright = styled.p`
    font-size: 12px;
    padding-top: 20px;
    color: #e2e2e2;
`;

export const AlbumForm = () => {
    const navigate = useNavigate();
    const onClose = () => {
        navigate(-1);
    };
    const { albumId } = useParams();
    const token = getLocalStorage('webAccessToken');
    const [albums, setAlbum] = useRecoilState(saveAlbumList);
    const clickPlaylistState = useSetRecoilState(clickMenuPlaylist);
    const clickAlbumState = useSetRecoilState(clickMenuAlbum);
    const { isLoading, data } = useQuery<IAlbumInfo>([albumId], () => {
        if (token) {
            return getAlbum(token, albumId!);
        }
        return Promise.resolve(null);
    });
    console.log(data);
    console.log(data?.tracks.items);
    if (isLoading) {
        return <Message>로딩 중</Message>;
    }
    return (
        <Container>
            {data && (
                <AlbumWrap>
                    <CloseBtn className="material-symbols-outlined" onClick={onClose}>
                        close
                    </CloseBtn>
                    <AlbumInfo
                        id={data?.id}
                        name={data?.name}
                        artist={data?.artists[0].name}
                        cover={data?.images[0].url}
                        type={data?.album_type! === 'single' ? typeTransform.single : typeTransform.album}
                        year={data?.release_date.slice(0, 4)}
                        trackLength={data?.total_tracks}
                    />
                    <TrackListsWrap>
                        <AlbumTrackList data={data} />
                        <Copyright>{data?.copyrights[0].text}</Copyright>
                    </TrackListsWrap>
                </AlbumWrap>
            )}
        </Container>
    );
};
