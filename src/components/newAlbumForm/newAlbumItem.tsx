import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { INewAlbumItemProp } from '../../types/newAlbums';

const Container = styled.li`
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    overflow: hidden;
    &:hover {
        background-color: #1a191a;
    }
    @media (max-width: 425px) {
        padding: 5px;
    }
`;
const Cover = styled.img`
    width: 100%;
    border-radius: 8px;
`;
const Title = styled.h1`
    width: 100%;
    margin-top: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    @media (max-width: 425px) {
        font-size: 12px;
    }
`;
const Artist = styled.p`
    width: 100%;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: rgb(160, 160, 160);
    margin-top: 5px;
    @media (max-width: 425px) {
        font-size: 12px;
    }
`;

export const NewAlbumItem = ({ id, name, artist, cover }: INewAlbumItemProp) => {
    const navigate = useNavigate();
    const onClickAlbum = () => {
        navigate(`/home/album/${id}`);
    };
    return (
        <Container onClick={onClickAlbum}>
            <Cover src={cover} />
            <Title>{name}</Title>
            <Artist>{artist}</Artist>
        </Container>
    );
};
