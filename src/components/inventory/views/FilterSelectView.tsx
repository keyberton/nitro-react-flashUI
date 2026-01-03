import { FC, useEffect, useRef, useState } from 'react';
import { Flex, Text } from '../../../common';

export interface FilterSelectViewProps
{
    options: { value: string | number, label: string }[];
    value: string | number;
    setValue: (value: string | number) => void;
    disabled?: boolean;
    className?: string;
    fullWidth?: boolean;
}

export const FilterSelectView: FC<FilterSelectViewProps> = props =>
{
    const { options = [], value = null, setValue = null, disabled = false, className = '', fullWidth = false } = props;
    const [ isOpen, setIsOpen ] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);
    const safeOptions = options ?? [];

    const getOptionLabel = (val: string | number) =>
    {
        const option = safeOptions.find(o => o.value === val);
        return option ? option.label : '';
    }

    useEffect(() =>
    {
        if(!isOpen) return;

        const handleDocumentClick = (event: MouseEvent) =>
        {
            if(elementRef.current && !elementRef.current.contains(event.target as Node))
            {
                setIsOpen(false);
            }
        }

        document.addEventListener('click', handleDocumentClick);

        return () => document.removeEventListener('click', handleDocumentClick);
    }, [ isOpen ]);

    return (
        <Flex alignItems="center" position="relative" className={ `flash-form-select ${ fullWidth ? 'full-width' : '' } ${ className }` } innerRef={ elementRef }>
            <Flex className={ `form-select form-select-sm cursor-pointer w-full ${ disabled ? 'disabled' : '' }` } onClick={ () => !disabled && setIsOpen(prev => !prev) }>
                <Flex alignItems='center' justifyContent='between' fullWidth>
                    <Flex className='w-full align-items-center'>
                        <Text variant={ disabled ? 'muted' : 'black' } noWrap>{ getOptionLabel(value) }</Text>
                    </Flex>
                    <i className="icon icon-dropdown" />
                </Flex>
            </Flex>
            { isOpen &&
                <ul className="dropdown-menu show position-absolute start-0" style={ { top: '100%', zIndex: 1091, width: fullWidth ? '100%' : undefined } }>
                    { safeOptions.map((option, index) => 
                        <li key={ index } className={ `dropdown-item cursor-pointer ${ value === option.value ? 'active' : '' }` } onClick={ () => { setValue(option.value); setIsOpen(false); } }>
                            { option.label }
                        </li>
                    ) }
                </ul>
            }
        </Flex>
    );
}
