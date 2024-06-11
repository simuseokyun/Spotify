import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { clickPlaylistState, titleChangeState } from '../../state/atoms';
import { IMyPlaylist } from '../../types/myPlaylist';

const Item = styled.li`
    display: flex;
    align-items: center;
    border-radius: 8px;
    transition: all 0.2s;
    padding: 5px;
    width: 100%;
    overflow: hidden;
    &:first-child {
        margin-top: 10px;
    }
`;
const Cover = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 8px;
    object-fit: cover;
    background-color: #232323;
`;
const Info = styled.div`
    width: calc(100% - 50px);
    margin-left: 8px;
`;
const Title = styled.h1`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

const Pin = styled.span`
    vertical-align: middle;
    font-size: 16px;
    color: #65d46e;
    margin-right: 2px;
`;

export const MyPlaylistItem = ({ id, cover, name, top }: IMyPlaylist) => {
    const setPlaylist = useSetRecoilState(clickPlaylistState);
    const setChangeForm = useSetRecoilState(titleChangeState);
    const navigate = useNavigate();
    const clickPlaylist = () => {
        navigate(`/home/playlist/${id}`);
        setPlaylist(id);
        setChangeForm(false);
    };
    return (
        <Item key={id} onClick={clickPlaylist}>
            <Cover src={cover} />
            <Info>
                <Title>
                    {name}
                    {top && <Pin className="material-symbols-outlined">check</Pin>}
                </Title>
            </Info>
        </Item>
    );
};
