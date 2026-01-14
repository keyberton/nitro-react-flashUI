import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { GroupItem, LocalizeBadgeName, LocalizeText } from '../../../api';
import { Flex } from '../../../common';
import { Select } from '../../../common/Select';
import { InventoryFilterType, TAB_BADGES, TAB_FURNITURE } from '../constants';

export interface InventoryCategoryFilterViewProps
{
    currentTab: string;
    groupItems: GroupItem[];
    badgeCodes: string[];
    setGroupItems: Dispatch<SetStateAction<GroupItem[]>>;
    setBadgeCodes: Dispatch<SetStateAction<string[]>>;
}

export const InventoryCategoryFilterView: FC<InventoryCategoryFilterViewProps> = props =>
{
    const { currentTab = null, groupItems = [], badgeCodes = [], setGroupItems = null, setBadgeCodes = null } = props;
    const [ filterType, setFilterType ] = useState<string>(InventoryFilterType.EVERYTHING);
    const [ filterPlace, setFilterPlace ] = useState<string>(InventoryFilterType.IN_INVENTORY);
    const [ searchValue, setSearchValue ] = useState('');
    const [ isTypeOpen, setIsTypeOpen ] = useState(false);
    const [ isPlaceOpen, setIsPlaceOpen ] = useState(false);

    useEffect(() =>
    {
        if (currentTab !== TAB_BADGES) return;

        let filteredBadgeCodes = [ ...badgeCodes ];

        const filteredBadges = badgeCodes.filter( badge => badge.startsWith('ACH_') );

        const numberMap = {};

        filteredBadges.forEach(badge =>
        {
            const name = badge.split(/[\d]+/)[0];
            const number = Number(badge.replace(name, ''));
            
            if (numberMap[name] === undefined || number > numberMap[name])
            {
                numberMap[name] = number;
            }
        });

        const allBadges = Object.keys(numberMap).map( name => `${ name }${ numberMap[name] }` ).concat( badgeCodes.filter( badge => !badge.startsWith('ACH_') ) );

        filteredBadgeCodes = allBadges.filter(badgeCode =>
        {            
            return LocalizeBadgeName(badgeCode).toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase().replace(' ', ''));
        });
        
        setBadgeCodes(filteredBadgeCodes);

    }, [ badgeCodes, currentTab, searchValue, setBadgeCodes ]);
    
    useEffect(() =>
    {
        if (currentTab !== TAB_FURNITURE) return;

        let filteredGroupItems = [ ...groupItems ];

        const comparison = searchValue.toLocaleLowerCase();

        if (filterType === InventoryFilterType.EVERYTHING) return setGroupItems(groupItems.filter( item => item.name.toLocaleLowerCase().includes(comparison) ));

        filteredGroupItems = groupItems.filter(item =>
        {            
            const isWallFilter = (filterType === InventoryFilterType.WALL) ? item.isWallItem : false;
            const isFloorFilter = (filterType === InventoryFilterType.FLOOR) ? !item.isWallItem : false;
            const isSearchFilter = (item.name.toLocaleLowerCase().includes(comparison)) ? true : false;
                
            return comparison && comparison.length ? (isSearchFilter && (isWallFilter || isFloorFilter)) : isWallFilter || isFloorFilter;
        });

        setGroupItems(filteredGroupItems);
    }, [ groupItems, setGroupItems, searchValue, filterType, currentTab ]);

    useEffect(() =>
    {
        setFilterType(InventoryFilterType.EVERYTHING);
        setFilterPlace(InventoryFilterType.IN_INVENTORY);
        setSearchValue('');
    }, [ currentTab ]);
    
    return (
        <Flex gap={ 2 } className="nitro-inventory-category-filter p-1 rounded" style={ { width: currentTab === TAB_BADGES ? '335px' : '100%' } }>
            <Flex className="position-relative">
                <Flex fullWidth alignItems="center" position="relative">
                    <input type="text" className="form-control form-control-sm" value={ searchValue } onChange={ event => setSearchValue(event.target.value) } />
                </Flex>
                { (searchValue && !!searchValue.length) && <i className="icon icon-clear position-absolute cursor-pointer end-1 top-1" onClick={ event => setSearchValue('') } /> }
            </Flex>
            { (currentTab !== TAB_BADGES) &&
                <Flex gap={1}>
                    <Select options={ [
                            { value: InventoryFilterType.EVERYTHING, label: LocalizeText(InventoryFilterType.EVERYTHING) },
                            { value: InventoryFilterType.FLOOR, label: LocalizeText(InventoryFilterType.FLOOR) },
                            { value: InventoryFilterType.WALL, label: LocalizeText(InventoryFilterType.WALL) } ] }
                        value={ filterType }
                        dropdownStyle={ { top: 2 } }
                        setValue={ (val) => setFilterType(String(val)) } />
                    <Select options={ [
                            { value: InventoryFilterType.ANYWHERE, label: LocalizeText(InventoryFilterType.ANYWHERE) },
                            { value: InventoryFilterType.IN_ROOM, label: LocalizeText(InventoryFilterType.IN_ROOM) },
                            { value: InventoryFilterType.IN_INVENTORY, label: LocalizeText(InventoryFilterType.IN_INVENTORY) }] }
                        value={ filterPlace }
                        dropdownStyle={ { top: 2 } }
                        setValue={ (val) => setFilterPlace(String(val)) }
                        disabled={ currentTab === TAB_FURNITURE } />
                </Flex>
            }
        </Flex>
    );
}
