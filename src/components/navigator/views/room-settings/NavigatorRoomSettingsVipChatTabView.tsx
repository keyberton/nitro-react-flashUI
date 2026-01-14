import { RoomChatSettings } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { IRoomData, LocalizeText } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { Select } from '../../../../common/Select';

interface NavigatorRoomSettingsTabViewProps
{
    roomData: IRoomData;
    handleChange: (field: string, value: string | number | boolean) => void;
}

export const NavigatorRoomSettingsVipChatTabView: FC<NavigatorRoomSettingsTabViewProps> = props =>
{
    const { roomData = null, handleChange = null } = props;
    const [ chatDistance, setChatDistance ] = useState<number>(0);

    useEffect(() =>
    {
        setChatDistance(roomData.chatSettings.distance);
    }, [ roomData.chatSettings ]);

    return (
        <Flex column className="px-3">
            <Column className="pb-4" gap={ 0 }>
                <Text bold>{ LocalizeText('navigator.roomsettings.vip.caption') }</Text>
                <Text>{ LocalizeText('navigator.roomsettings.vip.info') }</Text>
            </Column>
            <Column className="pb-3" gap={ 1 }>
                <Text bold>{ LocalizeText('navigator.roomsettings.vip_settings') }</Text>
                <Flex alignItems="center" gap={ 1 }>
                    <input className="flash-form-check-input" type="checkbox" checked={ roomData.hideWalls } onChange={ event => handleChange('hide_walls', event.target.checked) } />
                    <Text>{ LocalizeText('navigator.roomsettings.hide_walls') }</Text>
                </Flex>
                <Flex className="pe-4" gap={ 1 } column>
                    <Select
                        fullWidth
                        options={ [
                            { value: 0, label: LocalizeText('navigator.roomsettings.wall_thickness.normal') },
                            { value: 1, label: LocalizeText('navigator.roomsettings.wall_thickness.thick') },
                            { value: -1, label: LocalizeText('navigator.roomsettings.wall_thickness.thin') },
                            { value: -2, label: LocalizeText('navigator.roomsettings.wall_thickness.thinnest') }
                        ] }
                        value={ roomData.wallThickness }
                        setValue={ value => handleChange('wall_thickness', Number(value)) } />
                    <Select
                        fullWidth
                        options={ [
                            { value: 0, label: LocalizeText('navigator.roomsettings.floor_thickness.normal') },
                            { value: 1, label: LocalizeText('navigator.roomsettings.floor_thickness.thick') },
                            { value: -1, label: LocalizeText('navigator.roomsettings.floor_thickness.thin') },
                            { value: -2, label: LocalizeText('navigator.roomsettings.floor_thickness.thinnest') }
                        ] }
                        value={ roomData.floorThickness }
                        setValue={ value => handleChange('floor_thickness', Number(value)) } />
                </Flex>
            </Column>
            <Column gap={ 2 }>
                <Text bold>{ LocalizeText('navigator.roomsettings.chat_settings') }</Text>
                <Text>{ LocalizeText('navigator.roomsettings.chat_settings.info') }</Text>
                <Flex className="pe-4" column gap={ 1 }>
                    <Select
                        fullWidth
                        options={ [
                            { value: RoomChatSettings.CHAT_MODE_FREE_FLOW, label: LocalizeText('navigator.roomsettings.chat.mode.free.flow') },
                            { value: RoomChatSettings.CHAT_MODE_LINE_BY_LINE, label: LocalizeText('navigator.roomsettings.chat.mode.line.by.line') }
                        ] }
                        value={ roomData.chatSettings.mode }
                        setValue={ value => handleChange('bubble_mode', Number(value)) } />
                    <Select
                        fullWidth
                        options={ [
                            { value: RoomChatSettings.CHAT_BUBBLE_WIDTH_NORMAL, label: LocalizeText('navigator.roomsettings.chat.bubbles.width.normal') },
                            { value: RoomChatSettings.CHAT_BUBBLE_WIDTH_THIN, label: LocalizeText('navigator.roomsettings.chat.bubbles.width.thin') },
                            { value: RoomChatSettings.CHAT_BUBBLE_WIDTH_WIDE, label: LocalizeText('navigator.roomsettings.chat.bubbles.width.wide') }
                        ] }
                        value={ roomData.chatSettings.weight }
                        setValue={ value => handleChange('chat_weight', Number(value)) } />
                    <Select
                        fullWidth
                        options={ [
                            { value: RoomChatSettings.CHAT_SCROLL_SPEED_FAST, label: LocalizeText('navigator.roomsettings.chat.speed.fast') },
                            { value: RoomChatSettings.CHAT_SCROLL_SPEED_NORMAL, label: LocalizeText('navigator.roomsettings.chat.speed.normal') },
                            { value: RoomChatSettings.CHAT_SCROLL_SPEED_SLOW, label: LocalizeText('navigator.roomsettings.chat.speed.slow') }
                        ] }
                        value={ roomData.chatSettings.speed }
                        setValue={ value => handleChange('bubble_speed', Number(value)) } />
                    <Select
                        fullWidth
                        options={ [
                            { value: RoomChatSettings.FLOOD_FILTER_LOOSE, label: LocalizeText('navigator.roomsettings.chat.flood.loose') },
                            { value: RoomChatSettings.FLOOD_FILTER_NORMAL, label: LocalizeText('navigator.roomsettings.chat.flood.normal') },
                            { value: RoomChatSettings.FLOOD_FILTER_STRICT, label: LocalizeText('navigator.roomsettings.chat.flood.strict') }
                        ] }
                        value={ roomData.chatSettings.protection }
                        setValue={ value => handleChange('flood_protection', Number(value)) } />
                </Flex>
                <Flex gap={ 1 } alignItems="center">
                    <input type="number" min="0" style={ { width: 35 } } className="form-control form-control-sm" value={ chatDistance } onChange={ event => setChatDistance(event.target.valueAsNumber) } onBlur={ event => handleChange('chat_distance', chatDistance) } />
                    <Text>{ LocalizeText('navigator.roomsettings.chat_settings.hearing.distance') }</Text>
                </Flex>
            </Column>
        </Flex>
    );
}
