import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

export const FriendBarView: FC<{ onlineFriends: MessengerFriend[], isFriendsListReady: boolean }> = props =>
{
    const { onlineFriends = [], isFriendsListReady = false } = props;
    const [ indexOffset, setIndexOffset ] = useState(0);
    const [ maxDisplayCount, setMaxDisplayCount ] = useState(() => getMaxDisplayCount(window.innerWidth));
    const [ newFriendIds, setNewFriendIds ] = useState<Set<number>>(() => new Set());
    const lastFriendIds = useRef<Set<number>>(null);

    const onlineFriendsKey = onlineFriends.map(friend => friend?.id).join(',');

    useEffect(() =>
    {
        const onResize = () => setMaxDisplayCount(getMaxDisplayCount(window.innerWidth));

        window.addEventListener('resize', onResize);

        return () => window.removeEventListener('resize', onResize);
    }, []);

    useEffect(() =>
    {
        const currentIds = new Set<number>(onlineFriends.filter(friend => (friend?.id > 0)).map(friend => friend.id));
        const previousIds = lastFriendIds.current;

        setNewFriendIds(prevValue =>
        {
            const nextValue = new Set<number>();

            for(const friendId of prevValue)
            {
                if(currentIds.has(friendId)) nextValue.add(friendId);
            }

            if(previousIds && isFriendsListReady)
            {
                for(const friendId of currentIds)
                {
                    if(!previousIds.has(friendId)) nextValue.add(friendId);
                }
            }

            return nextValue;
        });

        lastFriendIds.current = currentIds;
    }, [ onlineFriendsKey, isFriendsListReady ]);

    const clearNewFriend = useCallback((friendId: number) =>
    {
        setNewFriendIds(prevValue =>
        {
            if(!prevValue.has(friendId)) return prevValue;

            const nextValue = new Set(prevValue);

            nextValue.delete(friendId);

            return nextValue;
        });
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
            { friendsToRender.map((friend, i) => <FriendBarItemView key={ friend ? friend.id : i } friend={ friend } isNewFriend={ friend ? newFriendIds.has(friend.id) : false } clearNewFriend={ clearNewFriend } />) }
            <button className="friend-bar-button right" disabled={ !((onlineFriends.length > maxDisplayCount) && ((indexOffset + maxDisplayCount) <= (onlineFriends.length - 1))) } onClick={ event => setIndexOffset(indexOffset + 1) } />
        </Flex>
    );
}
