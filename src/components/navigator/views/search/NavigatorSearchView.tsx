import { FC, KeyboardEvent, useEffect, useState } from 'react';
import { INavigatorSearchFilter, LocalizeText, SearchFilterOptions } from '../../../../api';
import { Flex } from '../../../../common';
import { useNavigator } from '../../../../hooks';
import { FilterSelectView } from '../../../inventory/views/FilterSelectView';

export interface NavigatorSearchViewProps
{
    sendSearch: (searchValue: string, contextCode: string) => void;
}

export const NavigatorSearchView: FC<NavigatorSearchViewProps> = props =>
{
    const { sendSearch = null } = props;
    const [ searchFilterIndex, setSearchFilterIndex ] = useState(0);
    const [ searchValue, setSearchValue ] = useState('');
    const [ hasSearched, setHasSearched ] = useState(false);
    const { topLevelContext = null, searchResult = null } = useNavigator();

    const processSearch = () =>
    {
        if(!topLevelContext) return;

        setHasSearched(true);

        let searchFilter = SearchFilterOptions[searchFilterIndex];

        if(!searchFilter) searchFilter = SearchFilterOptions[0];

        const searchQuery = ((searchFilter.query ? (searchFilter.query + ':') : '') + searchValue);

        sendSearch((searchQuery || ''), topLevelContext.code);
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) =>
    {
        if(event.key !== 'Enter') return;

        processSearch();
    };

    useEffect(() =>
    {
        if(!searchResult) return;

        const split = searchResult.data.split(':');

        let filter: INavigatorSearchFilter = null;
        let value: string = '';

        if(split.length >= 2)
        {
            const [ query, ...rest ] = split;

            filter = SearchFilterOptions.find(option => (option.query === query));
            value = rest.join(':');
        }
        else
        {
            value = searchResult.data;
        }

        if(!filter) filter = SearchFilterOptions[0];

        setSearchFilterIndex(SearchFilterOptions.findIndex(option => (option === filter)));
        setSearchValue(value);
    }, [ searchResult ]);

    return (
        <Flex fullWidth style={ { gap: 13 } } className="mb-2 ps-1">
            <Flex className='search-input' shrink>
                <FilterSelectView
                    style={ { height: 23 } }
                    dropdownStyle={ { top: -4 } }
                    fullWidth
                    options={ SearchFilterOptions.map((filter, index) => ({ value: index, label: LocalizeText('navigator.filter.' + filter.name) })) }
                    value={ searchFilterIndex }
                    setValue={ (val) => setSearchFilterIndex(Number(val)) } />
            </Flex>
            <Flex className='pe-5' fullWidth gap={ 2 }>
                <input type="text" style={ { width: 235 } } className="form-control border-black form-control-sm" placeholder={ LocalizeText('navigator.filter.input.placeholder') } value={ searchValue } onChange={ event => setSearchValue(event.target.value) } onKeyDown={ event => handleKeyDown(event) } />
                { (!searchValue || !searchValue.length) &&
                    <i className="icon icon-pen position-absolute navigator-search-button"/> }
                { searchValue && !!searchValue.length &&
                    <i className="icon icon-clear position-absolute navigator-clear-button cursor-pointer" onClick={ event => setSearchValue('') } /> }
                { hasSearched && searchValue && !!searchValue.length &&
                    <i className="icon icon-reload-navigator cursor-pointer" onClick={ processSearch } /> }
            </Flex>
        </Flex>
    );
}
