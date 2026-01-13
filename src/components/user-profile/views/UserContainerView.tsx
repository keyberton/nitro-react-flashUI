import { FriendlyTime, RequestFriendComposer, UserProfileParser } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { GetSessionDataManager, LocalizeText, SendMessageComposer } from '../../../api';
import { Button, Column, Flex, LayoutAvatarImageView, Text } from '../../../common';

interface UserContainerViewProps
{
    userProfile: UserProfileParser;
}

export const UserContainerView: FC<UserContainerViewProps> = props =>
{
    const { userProfile = null } = props;
    const [ requestSent, setRequestSent ] = useState(userProfile.requestSent);
    const isOwnProfile = (userProfile.id === GetSessionDataManager().userId);
    const canSendFriendRequest = !requestSent && (!isOwnProfile && !userProfile.isMyFriend && !userProfile.requestSent);

    const addFriend = () =>
    {
        setRequestSent(true);

        SendMessageComposer(new RequestFriendComposer(userProfile.username));
    }

    useEffect(() =>
    {
        setRequestSent(userProfile.requestSent);
    }, [ userProfile ])

    return (
        <Flex gap={ 2 }>
            <Column center className="avatar-container">
                <LayoutAvatarImageView figure={ userProfile.figure } direction={ 2 } />
            </Column>
            <Column>
                <Column gap={ 0 }>
                    <Text fontSize={ 7 } bold small>{ userProfile.username }</Text>
                    <Text fontSize={ 7 } italics textBreak small>{ userProfile.motto }&nbsp;</Text>
                </Column>
                <Column gap={ 0 }>
                    <Text fontSize={ 7 } small>
                        <b>{ LocalizeText('extendedprofile.created') }</b> { userProfile.registration }
                    </Text>
                    <Text fontSize={ 7 } small>
                        <b>{ LocalizeText('extendedprofile.last.login') }</b> { FriendlyTime.format(userProfile.secondsSinceLastVisit, '.ago', 2) }
                    </Text>
                    <Text fontSize={ 7 } small>
                        <b>{ LocalizeText('extendedprofile.achievementscore') }</b> { userProfile.achievementPoints }
                    </Text>
                    <Flex alignItems='center' gap={ 3 }>
                    { userProfile.isOnline &&
                        <i className="icon icon-pf-online" /> }
                    { !userProfile.isOnline &&
                        <i className="icon icon-pf-offline" /> }
                    <Flex alignItems="center" gap={ 1 }>
                        { canSendFriendRequest &&
                            <Button className='p-1 px-3'>
                                <Text small pointer onClick={ addFriend }>{ LocalizeText('extendedprofile.addasafriend') }</Text>
                            </Button> }
                        { !canSendFriendRequest &&
                            <>
                                <i className="icon icon-pf-tick" />
                                { isOwnProfile &&
                                    <Text bold  small>{ LocalizeText('extendedprofile.me') }</Text> }
                                { userProfile.isMyFriend &&
                                    <Text small bold>{ LocalizeText('extendedprofile.friend') }</Text> }
                                { (requestSent || userProfile.requestSent) &&
                                    <Text>{ LocalizeText('extendedprofile.friendrequestsent') }</Text> }
                            </> }
                    </Flex>
                </Flex>
                </Column>
            </Column>
        </Flex>
    )
}
