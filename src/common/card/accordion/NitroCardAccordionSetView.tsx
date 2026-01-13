import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Base, Column, ColumnProps, Flex } from '../..';
import { FriendListTabs, LocalizeText } from '../../../api';
import { useFriends } from '../../../hooks';
import { useNitroCardAccordionContext } from './NitroCardAccordionContext';

export interface NitroCardAccordionSetViewProps extends ColumnProps
{
    headerText: string;
    isExpanded?: boolean;
    friendlistTab?: FriendListTabs;
    setShowHoverText?: (text: string) => void;
    onToggle?: (isOpen: boolean) => void;
}

export const NitroCardAccordionSetView: FC<NitroCardAccordionSetViewProps> = props =>
{
    const { headerText = '', isExpanded = false, friendlistTab = null, setShowHoverText = null, onToggle = null, gap = 0, classNames = [], children = null, ...rest } = props;
    const [ isOpen, setIsOpen ] = useState(isExpanded);
    const { setClosers = null, closeAll = null } = useNitroCardAccordionContext();
    const { requests = [] } = useFriends();

    const onClick = () =>
    {
        const wasOpen = isOpen;

        if(closeAll) closeAll();

        if(!wasOpen)
        {
            setIsOpen(true);
            if(onToggle) onToggle(true);
        }
    }

    const onClose = useCallback(() =>
    {
        setIsOpen(false);
        if(onToggle) onToggle(false);
    }, [ onToggle ]);

    const getClassNames = useMemo(() =>
    {
        const newClassNames = [ 'nitro-card-accordion-set' ];

        if(isOpen) newClassNames.push('active');

        if(classNames && classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ isOpen, classNames ]);

    useEffect(() =>
    {
        setIsOpen(isExpanded);
    }, [ isExpanded ]);

    useEffect(() =>
    {
        if(setClosers) setClosers(prevValue => [...prevValue, onClose]);

        return () =>
        {
            if(setClosers) setClosers(prevValue => prevValue.filter(closer => closer !== onClose));
        }
    }, [ setClosers, onClose ]);

    return (
        <Column classNames={ getClassNames } gap={ gap } { ...rest }>
            <Flex pointer className="nitro-card-accordion-set-header px-2" onMouseEnter={ () => setShowHoverText && friendlistTab && setShowHoverText(LocalizeText(`${ friendlistTab }`)) } onMouseLeave={ () => setShowHoverText && setShowHoverText('') } onClick={ onClick }>
                <div className="friend-header-text d-inline">{ headerText }</div>
                { isOpen && <Base style={ { marginBottom: '1px' } } className={ `icon icon-friendlist_${ (friendlistTab === FriendListTabs.YOUR_FRIENDS) ? 'arrow_black' : 'arrow_white' }_down` } /> }
                { !isOpen && <Base style={ { marginBottom: '1px' } } className={ `icon icon-friendlist_${ (friendlistTab === FriendListTabs.YOUR_FRIENDS) ? 'arrow_black' : 'arrow_white' }_right` } /> }
            </Flex>
            { isOpen &&
                <Column fullHeight style={ { borderTop: friendlistTab === FriendListTabs.YOUR_FRIENDS ? '1px solid #295f82' : friendlistTab === FriendListTabs.SEARCH_HABBOS ? '1px solid #292929' : friendlistTab === FriendListTabs.REQUESTS ? '1px solid #914c00' : '' } } overflow="auto" gap={ 0 } className={ `nitro-card-accordion-set-content${ (friendlistTab === FriendListTabs.SEARCH_HABBOS) ? '-gray' : '' } p-1` }>
                    { children }
                </Column> }
        </Column>
    );
}
