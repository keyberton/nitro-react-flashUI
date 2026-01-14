import { GetRoomAdPurchaseInfoComposer, GetUserEventCatsMessageComposer, PurchaseRoomAdMessageComposer, RoomAdPurchaseInfoEvent, RoomEntryData } from '@nitrots/nitro-renderer';
import { FC, useEffect, useMemo, useState } from 'react';
import { LocalizeText, SendMessageComposer } from '../../../../../api';
import { Base, Button, Column, Select, Text } from '../../../../../common';
import { useCatalog, useMessageEvent, useNavigator, useNotification, useRoomPromote } from '../../../../../hooks';
import { CatalogLayoutProps } from './CatalogLayout.types';

export const CatalogLayoutRoomAdsView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props;
    const [ eventName, setEventName ] = useState<string>('');
    const [ eventDesc, setEventDesc ] = useState<string>('');
    const [ roomId, setRoomId ] = useState<number>(-1);
    const [ availableRooms, setAvailableRooms ] = useState<RoomEntryData[]>([]);
    const [ extended, setExtended ] = useState<boolean>(false);
    const [ categoryId, setCategoryId ] = useState<number>(1);
    const { categories = null } = useNavigator();
    const { setIsVisible = null } = useCatalog();
    const { simpleAlert = null } = useNotification();
    const { promoteInformation, isExtended, setIsExtended } = useRoomPromote();

    const roomSelectOptions = useMemo(() =>
    {
        const seenRoomIds = new Set<number>();
        const uniqueRooms = (availableRooms ?? []).filter(room =>
        {
            if(seenRoomIds.has(room.roomId)) return false;
            seenRoomIds.add(room.roomId);
            return true;
        });

        return [
            { value: -1, label: LocalizeText('roomad.catalog_roomname') },
            ...uniqueRooms.map(room => ({ value: room.roomId, label: room.roomName }))
        ];
    }, [ availableRooms ]);

    useEffect(() =>
    {
        if(isExtended && promoteInformation)
        {
            const data = promoteInformation.data;

            if(!data) return;

            setRoomId(data.flatId);
            setEventName(data.eventName);
            setEventDesc(data.eventDescription);
            setCategoryId(data.categoryId);
            setExtended(isExtended); // This is for sending to packet
            setIsExtended(false); // This is from hook useRoomPromotte
        }

    }, [ isExtended, eventName, eventDesc, categoryId, roomId, promoteInformation, setIsExtended ]);

    const resetData = () =>
    {
        setRoomId(-1);
        setEventName('');
        setEventDesc('');
        setCategoryId(1);
        setIsExtended(false);
        setIsVisible(false);
    }

    const purchaseAd = () =>
    {
        if (!eventName || eventName.length < 5) return simpleAlert(LocalizeText('roomad.alert.name.empty'), null, null, null, LocalizeText('roomad.error.title'));

        if (!roomId || roomId === -1) return simpleAlert(LocalizeText('roomad.no.available.room'), null, null, null, LocalizeText('roomad.error.title'));

        const pageId = page.pageId;
        const offerId = page.offers.length >= 1 ? page.offers[0].offerId : -1;
        const flatId = roomId;
        const name = eventName;
        const desc = eventDesc;
        const catId = categoryId;

        SendMessageComposer(new PurchaseRoomAdMessageComposer(pageId, offerId, flatId, name, extended, desc, catId));
        resetData();
    }

    useMessageEvent<RoomAdPurchaseInfoEvent>(RoomAdPurchaseInfoEvent, event =>
    {
        const parser = event.getParser();

        if(!parser) return;

        setAvailableRooms(parser.rooms);
    });

    useEffect(() =>
    {
        SendMessageComposer(new GetRoomAdPurchaseInfoComposer());
        // TODO: someone needs to fix this for morningstar
        SendMessageComposer(new GetUserEventCatsMessageComposer());
    }, []);

    return (
        <>
            <Column size={ 12 } overflow="hidden" className="text-black px-2 mt-3">
                <Text bold noWrap>{ LocalizeText('roomad.catalog_text', [ 'duration' ], [ '120' ]) }</Text>
                <Base className="rounded p-1">
                    <Column gap={ 2 }>
                        <Select
                            fullWidth
                            options={ categories?.map(cat => ({ value: cat.id, label: LocalizeText(cat.name) })) ?? [] }
                            value={ categoryId }
                            setValue={ value => setCategoryId(Number(value)) }
                            disabled={ extended } />
                    </Column>
                    <Column gap={ 0 } className="mt-2">
                        <Text small>{ LocalizeText('roomad.catalog_name') }</Text>
                        <input type="text" className="form-control form-control-sm" maxLength={ 64 } value={ eventName } onChange={ event => setEventName(event.target.value) } readOnly={ extended } />
                    </Column>
                    <Column gap={ 0 } className="mt-2">
                        <Text small>{ LocalizeText('roomad.catalog_description') }</Text>
                        <textarea className="form-control form-control-sm height-roomads-description" maxLength={ 64 } value={ eventDesc } onChange={ event => setEventDesc(event.target.value) } readOnly={ extended } />
                    </Column>
                    <Column gap={ 0 } className="mt-2">
                        <Text small>{ LocalizeText('roomad.catalog_roomname') }</Text>
                        <Select
                            fullWidth
                            options={ roomSelectOptions }
                            value={ roomId }
                            setValue={ value =>
                            {
                                const nextValue = Number(value);
                                if(nextValue === -1) return;
                                setRoomId(nextValue);
                            } }
                            disabled={ extended } />
                    </Column>
                    <Column className="mt-5" alignItems="end">
                        <Button className="btn btn-success w-50" onClick={ purchaseAd }>{ extended ? LocalizeText('roomad.extend.event') : LocalizeText('buy') }</Button>
                    </Column>
                </Base>
            </Column>
        </>
    );
}
