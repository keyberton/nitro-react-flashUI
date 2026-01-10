import { FC, useEffect, useMemo, useState } from 'react';
import { MessengerFriend } from '../../../../api';
import { Flex } from '../../../../common';
import { FriendBarItemView } from './FriendBarItemView';

const getMaxDisplayCount = (viewportWidth: number) =>
{
    if(viewportWidth >= 1225) return 3;
    if(viewportWidth >= 1055) return 2;
    if(viewportWidth >= 900) return 1;

    return 0;
}

export const FriendBarView: FC<{ onlineFriends: MessengerFriend[] }> = props =>
{
    const { onlineFriends = null } = props;
    const [ indexOffset, setIndexOffset ] = useState(0);
    const [ maxDisplayCount, setMaxDisplayCount ] = useState(() => getMaxDisplayCount(window.innerWidth));

    useEffect(() =>
    {
        const onResize = () => setMaxDisplayCount(getMaxDisplayCount(window.innerWidth));

        window.addEventListener('resize', onResize);

        return () => window.removeEventListener('resize', onResize);
    }, []);

    useEffect(() =>
    {
        if(maxDisplayCount <= 0)
        {
            if(indexOffset !== 0) setIndexOffset(0);

            return;
        }

        const maxOffset = Math.max(0, onlineFriends.length - maxDisplayCount);

        if(indexOffset > maxOffset) setIndexOffset(maxOffset);
    }, [ indexOffset, maxDisplayCount, onlineFriends.length ]);

    const friendsToRender = useMemo(() =>
    {
        if(maxDisplayCount <= 0) return [];

        return Array.from(Array(maxDisplayCount), (e, i) => (onlineFriends[ indexOffset + i ] || null));
    }, [ indexOffset, maxDisplayCount, onlineFriends ]);

    if(maxDisplayCount <= 0) return null;

    return (
        <Flex alignItems="center" className="friend-bar">
            <button className="friend-bar-button left" disabled={ (indexOffset <= 0) } onClick={ event => setIndexOffset(indexOffset - 1) } />
            { friendsToRender.map((friend, i) => <FriendBarItemView key={ i } friend={ friend } />) }
            <button className="friend-bar-button right" disabled={ !((onlineFriends.length > maxDisplayCount) && ((indexOffset + maxDisplayCount) <= (onlineFriends.length - 1))) } onClick={ event => setIndexOffset(indexOffset + 1) } />
        </Flex>
    );
}
