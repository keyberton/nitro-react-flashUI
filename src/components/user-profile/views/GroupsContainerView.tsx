import { GroupInformationComposer, GroupInformationEvent, GroupInformationParser, HabboGroupEntryData } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { LocalizeText, SendMessageComposer, ToggleFavoriteGroup } from '../../../api';
import { AutoGrid, Base, Column, Flex, GridProps, LayoutBadgeImageView, LayoutGridItem, Text } from '../../../common';
import { useMessageEvent } from '../../../hooks';
import { GroupInformationView } from '../../groups/views/GroupInformationView';

interface GroupsContainerViewProps extends GridProps
{
    itsMe: boolean;
    groups: HabboGroupEntryData[];
    onLeaveGroup: () => void;
}

export const GroupsContainerView: FC<GroupsContainerViewProps> = props =>
{
    const { itsMe = null, groups = null, onLeaveGroup = null, overflow = 'hidden', gap = 2, ...rest } = props;
    const [ selectedGroupId, setSelectedGroupId ] = useState<number>(null);
    const [ groupInformation, setGroupInformation ] = useState<GroupInformationParser>(null);

    useMessageEvent<GroupInformationEvent>(GroupInformationEvent, event =>
    {
        const parser = event.getParser();

        if(!selectedGroupId || (selectedGroupId !== parser.id) || parser.flag) return;

        setGroupInformation(parser);
    });

    useEffect(() =>
    {
        if(!selectedGroupId) return;
        
        SendMessageComposer(new GroupInformationComposer(selectedGroupId, false));
    }, [ selectedGroupId ]);

    useEffect(() =>
    {
        setGroupInformation(null);

        if(groups.length > 0)
        {
            setSelectedGroupId(prevValue =>
            {
                if(prevValue === groups[0].groupId)
                {
                    SendMessageComposer(new GroupInformationComposer(groups[0].groupId, false));
                }

                return groups[0].groupId;
            });
        }
    }, [ groups ]);

    if(!groups || !groups.length)
    {
        return (
            <Column center fullHeight>
                <Column className="profile-grey-bg py-3 px-4">
                    <Text small> { LocalizeText('extendedprofile.nogroups.user') }</Text>
                    <Flex justifyContent="center" gap={ 4 }>
                        <Base className="no-group-spritesheet image-1" />
                        <Base className="no-group-spritesheet image-2" />
                        <Base className="no-group-spritesheet image-3" />
                    </Flex>
                    <Text small>{ LocalizeText('extendedprofile.nogroups.info') }</Text>
                </Column>
            </Column>
        );
    }
    
    return (
        <Flex fullHeight fullWidth overflow={ overflow } className='groups-container' { ...rest }>
            <Column className='groups-grid' overflow="auto">
                <Flex gap={1}>
                    <Text bold fontSize={7} small>{ LocalizeText('avatar.profile.groups') }:</Text>
                    <Text fontSize={7}>{ groups.length }</Text>
                </Flex>
                <AutoGrid overflow={ null } gap={ 0 } columnCount={ 1 } columnMinHeight={ 50 } className="user-groups-container">
                    { groups.map((group, index) =>
                    {
                        return (
                            <LayoutGridItem key={ index } overflow="unset" itemActive={ (selectedGroupId === group.groupId) } onClick={ () => setSelectedGroupId(group.groupId) } className="p-1">
                                { itsMe &&
                                <i className={ 'position-absolute start-0 top-0 z-index-1 icon icon-group-' + (group.favourite ? 'favorite' : 'not-favorite') } onClick={ () => ToggleFavoriteGroup(group) } /> }
                                <Flex className='group-badge-container'>
                                    <LayoutBadgeImageView badgeCode={ group.badgeCode } isGroup={ true } />
                                </Flex>
                            </LayoutGridItem>
                        )
                    }) }
                </AutoGrid>
            </Column>
            <Column overflow="hidden">
                { groupInformation &&
                    <GroupInformationView groupInformation={ groupInformation } onClose={ onLeaveGroup } /> }
            </Column>
        </Flex>
    );
}
