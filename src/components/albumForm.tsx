import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { tokenValue, typeTransform } from '../atoms';
import { useQuery } from 'react-query';
import { getAlbum } from '../api';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { Link } from 'react-router-dom';

interface IAlbum {
    album_type: string;
    images: { height: number; url: string; width: number }[];
    artists: { id: string; name: string }[];
    name: string;
    release_date: string;
    total_tracks: number;
    tracks: {
        items: { name: string; track_number: number; duration_ms: number; artists: { name: string; id: string }[] }[];
    };
    copyrights: { text: string }[];
}

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
`;
const AlbumWrap = styled.div`
    width: 1000px;
    height: 700px;
    position: relative;
    border-radius: 8px;
    overflow-y: scroll;
    &::-webkit-scrollbar {
        display: none;
    }
`;
const AlbumTop = styled.div`
    display: flex;
    background: linear-gradient(90deg, rgba(2, 0, 36, 1) 0%, #392f31);
    align-items: end;
    padding: 20px;
`;
const AlbumImg = styled.img`
    width: 200px;
    height: 200px;
    border-radius: 8px;
`;
const AlbumInfo = styled.div`
    margin-left: 20px;
`;

const AlbumTitle = styled.h2`
    font-size: 40px;
    font-weight: 700;
    margin-top: 10px;
    margin-bottom: 10px;
`;
const ArtistName = styled.span`
    font-weight: 700;
`;
const ReleaseYear = styled.span`
    margin-left: 10px;
`;
const RunningTime = styled(ReleaseYear)``;
const TotalTracks = styled(ReleaseYear)``;

const TrackListsWrap = styled.div`
    padding: 20px;
    background: linear-gradient(90deg, black 0%, #392f31);
`;
const TrackLists = styled.table`
    width: 100%;
    height: 100%;
    border-collapse: collapse;
`;
const TrackList = styled.tr`
    &:hover {
        background-color: rgba(0, 0, 0, 0.5);
    }
    a {
        color: #a0a0a0;
        &:hover {
            color: white;
        }
    }
    border-radius: 10px;
`;
const TrackArtist = styled.span`
    /* margin-left: 5px; */
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
const CopyrightWrap = styled.div`
    padding: 20px 0;
`;
const Copyright = styled.p`
    font-size: 12px;
    color: #e2e2e2;
`;

export const AlbumForm = () => {
    const navigate = useNavigate();
    const onClose = () => {
        navigate(-1);
    };
    const msTransform = (ms: number) => {
        const totalSeconds = ms / 1000;
        const minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        return { minutes, seconds };
    };

    const { albumId } = useParams();
    const token = useRecoilValue(tokenValue);
    console.log(token);

    const { isLoading, data } = useQuery<IAlbum>(['albumId', albumId], () => getAlbum(token, albumId!));
    console.log(data);
    return (
        <Container>
            {isLoading ? (
                'Loading...'
            ) : (
                <AlbumWrap>
                    <CloseBtn className="material-symbols-outlined" onClick={onClose}>
                        close
                    </CloseBtn>
                    <AlbumTop>
                        <AlbumImg src={data?.images[0].url} />
                        <AlbumInfo>
                            <p>
                                {data?.album_type === 'single'
                                    ? typeTransform.single
                                    : data?.album_type === 'ep'
                                    ? typeTransform.ep
                                    : typeTransform.album}
                            </p>
                            <AlbumTitle>{data?.name}</AlbumTitle>
                            <ArtistName>{data?.artists[0].name}</ArtistName>
                            <ReleaseYear>{data?.release_date.slice(0, 4)}</ReleaseYear>
                            <TotalTracks>{data?.total_tracks}곡</TotalTracks>
                        </AlbumInfo>
                    </AlbumTop>
                    <TrackListsWrap>
                        <TrackLists>
                            <thead>
                                <tr style={{ padding: '5px 0', borderBottom: '1px solid #808080' }}>
                                    <th style={{ width: '10%', padding: '10px 0' }}>#</th>
                                    <th style={{ textAlign: 'left', padding: '10px 0' }}>제목</th>
                                    <th style={{ padding: '10px 0 ' }}>러닝타임</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.tracks.items.map((track, i) => (
                                    <TrackList key={track.name} style={{ borderRadius: '5px' }}>
                                        <td style={{ width: '10%' }}>{track.track_number}</td>
                                        <td style={{ textAlign: 'left', padding: '10px 0' }}>
                                            <p style={{ marginBottom: '5px' }}>{track.name}</p>
                                            {track.artists.map((artist, i) => (
                                                <TrackArtist key={artist.name}>
                                                    <Link to={`/artist/${artist.id}`}>
                                                        {track.artists.length == 1
                                                            ? artist.name
                                                            : track.artists.length == i + 1
                                                            ? artist.name
                                                            : artist.name + ' , '}
                                                    </Link>
                                                </TrackArtist>
                                            ))}
                                        </td>
                                        <td>{`${msTransform(track.duration_ms).minutes}:${
                                            String(msTransform(track.duration_ms).seconds).length === 1
                                                ? `0${msTransform(track.duration_ms).seconds}`
                                                : msTransform(track.duration_ms).seconds
                                        }`}</td>
                                    </TrackList>
                                ))}
                            </tbody>
                        </TrackLists>
                        <CopyrightWrap>
                            {data?.copyrights.map((copyright) => (
                                <Copyright>{copyright.text}</Copyright>
                            ))}
                        </CopyrightWrap>
                    </TrackListsWrap>
                </AlbumWrap>
            )}
        </Container>
    );
};
