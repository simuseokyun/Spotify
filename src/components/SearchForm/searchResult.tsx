import { useQuery } from 'react-query';
import styled, { keyframes } from 'styled-components';
import { useRecoilValue } from 'recoil';
import { searchState } from '../../atoms';
import { searchTrack } from '../../api';
import { SearchTrackList } from './searchTrackList';
import { getTokenLocalStorage } from '../../util';

interface ITracks {
    tracks: {
        items: IAlbum[];
        next: string;
    };
}
interface IAlbum {
    id: string;
    album: {
        images: {
            url: string;
        }[];
        id: string;
        name: string;
        artists: { name: string; id: string }[];
    };
    duration_ms: number;
    uri: string;
    name: string;
}

const Container = styled.div`
    padding: 20px 20px 140px 20px;

    height: 500px;
    overflow-y: scroll;
    overflow-x: hidden;
    background-color: #131212;
    border-radius: 8px;
    &::-webkit-scrollbar {
        display: none;
    }
    @media (max-width: 768px) {
        height: 100vh;
        padding: 10px 10px 140px 10px;
    }
`;
const ResultMessage = styled.h1`
    font-size: 20px;
    margin: 20px 0;
`;
const Table = styled.table`
    width: 100%;
    vertical-align: middle;
`;
const Thead = styled.thead``;
const Tbody = styled.tbody``;
const Tr = styled.tr``;
const Th = styled.th`
    cursor: pointer;
    padding: 5px 0;
    max-width: 0;
    overflow: hidden;
    &:first-child {
        width: 6%;
        text-align: left;
        @media (max-width: 425px) {
            width: 100px;
        }
    }
    &:nth-child(4) {
        @media (max-width: 768px) {
            display: none;
        }
    }
`;

export const SearchResult = () => {
    const search = useRecoilValue(searchState);
    const token = getTokenLocalStorage('webAccessToken');
    const { isLoading: TrackLoading, data: trackData } = useQuery<ITracks>(['searchResult', search], async () => {
        if (token) {
            const trackData = await searchTrack(token, search);
            return trackData;
        }
    });

    return (
        <Container>
            <ResultMessage>{search ? `"${search}"에 대한 검색결과` : '검색 결과가 없습니다'}</ResultMessage>
            {TrackLoading ? (
                'Loading'
            ) : (
                <Table>
                    <Thead>
                        <Tr>
                            <Th></Th>
                            <Th></Th>
                            <Th></Th>
                            <Th></Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {trackData?.tracks?.items?.map((item, i) => {
                            return (
                                <SearchTrackList
                                    key={item.id}
                                    id={item.id}
                                    cover={item.album.images[0].url}
                                    title={item.name}
                                    artists={item.album.artists}
                                    album_id={item.album.id}
                                    album_title={item.album.name}
                                    duration_ms={item.duration_ms}
                                    uri={item.uri}
                                />
                            );
                        })}
                    </Tbody>
                </Table>
            )}
        </Container>
    );
};
