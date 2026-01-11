import { BotRemoveComposer } from '@nitrots/nitro-renderer';
import { FC, useMemo } from 'react';
import { AvatarInfoRentableBot, BotSkillsEnum, LocalizeText, SendMessageComposer } from '../../../../../api';
import { Base, Button, Column, Flex, LayoutAvatarImageView, LayoutBadgeImageView, Text } from '../../../../../common';

interface InfoStandWidgetRentableBotViewProps
{
    avatarInfo: AvatarInfoRentableBot;
    onClose: () => void;
}

export const InfoStandWidgetRentableBotView: FC<InfoStandWidgetRentableBotViewProps> = props =>
{
    const { avatarInfo = null, onClose = null } = props;

    const canPickup = useMemo(() =>
    {
        if(avatarInfo.botSkills.indexOf(BotSkillsEnum.NO_PICK_UP) >= 0) return false;

        if(!avatarInfo.amIOwner && !avatarInfo.amIAnyRoomController) return false;

        return true;
    }, [ avatarInfo ]);

    const pickupBot = () => SendMessageComposer(new BotRemoveComposer(avatarInfo.webID));

    if(!avatarInfo) return;

    return (
        <Column gap={ 1 }>
            <Column className="nitro-infostand rounded">
                <Column overflow="visible" className="container-fluid content-area" gap={ 1 }>
                    <Column gap={ 1 }>
                        <Flex alignItems="center" justifyContent="between" gap={ 1 }>
                            <Text variant="white" gfbold wrap>{ avatarInfo.name }</Text>
                            <Base className="cursor-pointer infostand-close" onClick={ onClose } />
                        </Flex>
                        <hr className="m-0" />
                    </Column>
                    <Column gap={ 1 }>
                        <Flex gap={ 1 }>
                            <Flex className="infostand-thumb-bg">
                                <Column fullWidth className="body-image bot">
                                    <LayoutAvatarImageView figure={ avatarInfo.figure } direction={ 4 } />
                                </Column>
                            </Flex>
                            <Column grow justifyContent='center' alignItems='center' gap={ 0 }>
                                { (avatarInfo.badges.length > 0) && avatarInfo.badges.map(result =>
                                {
                                    return <LayoutBadgeImageView key={ result } badgeCode={ result } showInfo={ true } />;
                                }) }
                            </Column>
                        </Flex>
                    </Column>
                    <Column gap={ 1 }>
                        <Flex alignItems="center" className="bg-transparent rounded py-1 px-1">
                            <Text fullWidth wrap textBreak variant="white" className="motto-content">{ avatarInfo.motto }</Text>
                        </Flex>
                    </Column>
                    <Column gap={ 1 }>
                        <Flex alignItems="center" className='px-1' gap={ 1 }>
                            <Text variant="white" wrap>
                                { LocalizeText('infostand.text.botowner', [ 'name' ], [ avatarInfo.ownerName ]) }
                            </Text>
                        </Flex>
                        { (avatarInfo.carryItem > 0) &&
                            <>
                                <hr className="m-0" />
                                <Text variant="white" wrap>
                                    { LocalizeText('infostand.text.handitem', [ 'item' ], [ LocalizeText('handitem' + avatarInfo.carryItem) ]) }
                                </Text>
                            </> }
                    </Column>
                </Column>
            </Column>
            { canPickup &&
                <Flex justifyContent="end">
                    <Button className="infostand-buttons" onClick={ pickupBot }>{ LocalizeText('infostand.button.pickup') }</Button>
                </Flex> }
        </Column>
    );
}
