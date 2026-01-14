import { CatalogGroupsComposer, StringDataType } from '@nitrots/nitro-renderer';
import { FC, useEffect, useMemo, useState } from 'react';
import { LocalizeText, SendMessageComposer } from '../../../../../api';
import { Base, Button, Flex } from '../../../../../common';
import { Select } from '../../../../../common/Select';
import { useCatalog } from '../../../../../hooks';

export const CatalogGuildSelectorWidgetView: FC<{}> = props =>
{
    const [ selectedGroupIndex, setSelectedGroupIndex ] = useState<number>(0);
    const { currentOffer = null, catalogOptions = null, setPurchaseOptions = null } = useCatalog();
    const { groups = null } = catalogOptions;

    const previewStuffData = useMemo(() =>
    {
        if(!groups || !groups.length) return null;

        const group = groups[selectedGroupIndex];

        if(!group) return null;

        const stuffData = new StringDataType();

        stuffData.setValue([ '0', group.groupId.toString(), group.badgeCode, group.colorA, group.colorB ]);

        return stuffData;
    }, [ selectedGroupIndex, groups ]);

    useEffect(() =>
    {
        if(!currentOffer) return;

        setPurchaseOptions(prevValue =>
        {
            const newValue = { ...prevValue };

            newValue.extraParamRequired = true;
            newValue.extraData = ((previewStuffData && previewStuffData.getValue(1)) || null);
            newValue.previewStuffData = previewStuffData;

            return newValue;
        });
    }, [ currentOffer, previewStuffData, setPurchaseOptions ]);

    useEffect(() =>
    {
        SendMessageComposer(new CatalogGroupsComposer());
    }, []);

    if(!groups || !groups.length)
    {
        return (
            <Base className="bg-muted rounded p-1 text-black text-center">
                { LocalizeText('catalog.guild_selector.members_only') }
                <Button className="mt-1">
                    { LocalizeText('catalog.guild_selector.find_groups') }
                </Button>
            </Base>
        );
    }

    const selectedGroup = groups[selectedGroupIndex];

    return (
        <Flex justifyContent='center' fullWidth gap={ 1 }>
            <Select
                className='w-50 group-selector'
                dropdownClassName='group-selector'
                options={ groups.map((group, index) => ({ value: index, label: group.groupName })) }
                value={ selectedGroupIndex }
                setValue={ value => setSelectedGroupIndex(Number(value)) } >
                    { !!selectedGroup &&
                        <Flex overflow="hidden" className="color-picker border">
                            <Base fullHeight style={ { width: '20px', backgroundColor: '#' + selectedGroup.colorA } } />
                            <Base fullHeight style={ { width: '20px', backgroundColor: '#' + selectedGroup.colorB } } />
                        </Flex> }
                </Select>
        </Flex>
    );
}
