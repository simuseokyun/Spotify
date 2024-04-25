import styled, { keyframes } from 'styled-components';
import { msTransform } from '../../api';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { playlistList } from '../../atoms';
import { addPlaylistState } from '../../atoms';

interface IList {
    cover: string;
    title: string;
    duration: number;
    artists: { id: string; name: string }[];
    album_id: string;
    album_title: string;
    i: number;
}
const TrackList = styled.tr`
    width: 100%;
    overflow: hidden;
    border-radius: 8px;
    &:hover {
        background-color: #2a2929;
        td > span {
            opacity: 1;
        }
    }
`;
const TrackImg = styled.img`
    width: 45px;
    height: 45px;
`;
const ArtistNameWrap = styled.p`
    margin-top: 4px;

    a {
        color: rgb(160, 160, 160);
    }
`;

const rotateIn = keyframes`
    from {
        transform: rotate(0deg) 
    }
    to {
        transform: rotate(180deg) 
    }
`;
const AddBtn = styled.span`
    opacity: 0;
    &:hover {
        animation: ${rotateIn} 1s forwards;
    }
`;
const Category = styled.ul`
    position: absolute;
    right: 0;
    width: 200px;
    padding: 10px;
    background-color: #282828;
    border-radius: 8px;
`;
const CategoryList = styled.li`
    text-align: left;
    color: white;
    font-size: 14px;
    padding: 5px;
    &:hover {
        background-color: #3e3d3d;
    }
`;
const Td = styled.td`
    width: 25%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;

export const PopularPlaylistTrack = ({ cover, title, duration, artists, album_id, album_title, i }: IList) => {
    const [open, setOpen] = useState(false);
    const [playlists, setPlaylist] = useRecoilState(playlistList);
    const addPlaylistFormState = useSetRecoilState(addPlaylistState);
    const addTrack = (event: React.MouseEvent<HTMLLIElement>) => {
        const {
            currentTarget: { textContent, id },
        } = event;
        setPlaylist((prev) => {
            const newTrack = { id: title, title, duration_ms: duration, cover, album_title, artists, album_id };
            console.log(newTrack);
            const prevArray = prev.map((prev, index) => {
                if (prev.title === textContent) {
                    const confirm = prev.tracks.find((ele) => {
                        return ele.title === title;
                    });
                    if (confirm) {
                        alert('이미 플레이리스트에 곡이 존재합니다');
                        return prev;
                    }
                    return {
                        ...prev,
                        tracks: [...prev.tracks, newTrack],
                    };
                }
                return prev;
            });
            setOpen(false);
            return prevArray;
        });
    };

    const onAddBtn = () => {
        if (!playlists.length) {
            alert('먼저 플레이리스트를 생성해주세요');
            addPlaylistFormState((prev) => !prev);
            return;
        }
        setOpen((prev) => !prev);
    };
    return (
        <TrackList
            onMouseLeave={() => {
                setOpen(false);
            }}
        >
            <Td>{i + 1}</Td>
            <Td style={{ padding: '5px' }}>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <TrackImg src={cover} alt="album_cover" />
                    <div style={{ width: '100%', textAlign: 'left', marginLeft: '10px' }}>
                        <p>{title}</p>
                        <div style={{ display: 'flex', width: '100%' }}>
                            {artists.map((artist, i) => (
                                <ArtistNameWrap>
                                    <Link to={`/home/artist/${artist.id}`}>{artist.name}</Link>
                                    {artists.length == 1 ? undefined : artists[i + 1] ? ',' : undefined}
                                </ArtistNameWrap>
                            ))}
                        </div>
                    </div>
                </div>
            </Td>
            <Td style={{ textAlign: 'left' }}>
                <Link to={`/home/album/${album_id}`}>{album_title}</Link>
            </Td>
            <Td>{`${msTransform(duration).minutes}:${
                String(msTransform(duration).seconds).length === 1
                    ? `0${msTransform(duration).seconds}`
                    : msTransform(duration).seconds
            }`}</Td>

            <Td style={{ paddingRight: '5px', position: 'relative' }}>
                <AddBtn onClick={onAddBtn} style={{ position: 'relative' }} className="material-symbols-outlined">
                    add_circle
                </AddBtn>
                {open ? (
                    <Category>
                        {playlists.map((playlist) => {
                            return (
                                <CategoryList key={playlist.id} id={playlist.title} onClick={addTrack}>
                                    {playlist.title}
                                </CategoryList>
                            );
                        })}
                    </Category>
                ) : null}
            </Td>
        </TrackList>
    );
};
