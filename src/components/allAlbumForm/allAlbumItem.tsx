import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { IAllAlbumProp } from '../../types/albumInfo';

const Item = styled.li`
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    padding: 10px;
    &:hover {
        background-color: #1a191a;
    }
    @media (max-width: 768px) {
        padding: 5px;
        &:hover {
            background-color: unset;
        }
    }
`;
const Title = styled.p`
    margin-top: 10px;
    text-overflow: ellipsis;
    overflow: hidden;
    line-height: 1.4;
    white-space: nowrap;
`;
const Cover = styled.img`
    width: 100%;
    border-radius: 8px;
`;
const RelaseWrap = styled.div`
    margin-top: 5px;
`;
const Release = styled.span`
    color: rgb(160, 160, 160);
`;
const Type = styled(Release)`
    margin-left: 3px;
`;

export const AllAlbumItem = ({ id, cover, name, release, type }: IAllAlbumProp) => {
    const navigate = useNavigate();
    const onClickAlbum = () => {
        navigate(`/home/album/${id}`);
    };
    return (
        <Item onClick={onClickAlbum}>
            <Cover src={cover} alt="앨범 커버" />
            <Title>{name}</Title>
            <RelaseWrap>
                <Release>{release}</Release>
                <Type>{type}</Type>
            </RelaseWrap>
        </Item>
    );
};
