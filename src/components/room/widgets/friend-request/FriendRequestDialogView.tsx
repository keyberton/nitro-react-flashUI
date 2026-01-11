import { RoomObjectCategory } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { GetUserProfile, LocalizeText, MessengerRequest } from '../../../../api';
import { Base, Button, Column, Flex, Text } from '../../../../common';
import { ObjectLocationView } from '../object-location/ObjectLocationView';

export const FriendRequestDialogView: FC<{ roomIndex: number, request: MessengerRequest, hideFriendRequest: (userId: number) => void, requestResponse: (requestId: number, flag: boolean) => void }> = props =>
{
    const { roomIndex = -1, request = null, hideFriendRequest = null, requestResponse = null } = props;

    return (
        <ObjectLocationView objectId={ roomIndex } category={ RoomObjectCategory.UNIT }>
            <Base className="nitro-friend-request-dialog p-2">
                <Column>
                    <Flex alignItems="start" justifyContent="between" gap={ 2 }>
                        <i className="nitro-friends-spritesheet icon-profile-sm mt-1" onClick={ event => GetUserProfile(request.id) }  />
                        <Text small bold variant="white" className="w-75">{ LocalizeText('widget.friendrequest.from', [ 'username' ], [ request.name ]) }</Text>
                        <i className="friend-req-close" onClick={ event => hideFriendRequest(request.requesterUserId) } />
                    </Flex>
                    <Flex alignItems='center'>
                        <Text small className="ms-1 cursor-pointer" underline onClick={ event => requestResponse(request.requesterUserId, false) }>{ LocalizeText('widget.friendrequest.decline') }</Text>
                        <Button gap={1} className="accept-friend-btn btn-bold p-0 ps-2 pe-4" onClick={ event => requestResponse(request.requesterUserId, true) }>
                            <i className="icon icon-pf-tick" />
                            { LocalizeText('widget.friendrequest.accept') }
                        </Button>
                    </Flex>
                </Column>
            </Base>
        </ObjectLocationView>
    );
}
