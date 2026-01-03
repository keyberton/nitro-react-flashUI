import { FC, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Base, Flex, Text } from '../../../common';

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
    const menuRef = useRef<HTMLUListElement>(null);
    const [ anchorRect, setAnchorRect ] = useState<{ left: number, top: number, width: number, height: number }>(null);
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
            const target = event.target as Node;
            if(elementRef.current && elementRef.current.contains(target)) return;
            if(menuRef.current && menuRef.current.contains(target)) return;
            setIsOpen(false);
        }

        const handleScrollOrResize = () => setIsOpen(false);

        document.addEventListener('click', handleDocumentClick);
        window.addEventListener('scroll', handleScrollOrResize, true);
        window.addEventListener('resize', handleScrollOrResize, true);

        return () =>
        {
            document.removeEventListener('click', handleDocumentClick);
            window.removeEventListener('scroll', handleScrollOrResize, true);
            window.removeEventListener('resize', handleScrollOrResize, true);
        }
    }, [ isOpen ]);

    return (
        <Flex alignItems="center" position="relative" className={ `flash-form-select ${ fullWidth ? 'full-width' : '' } ${ className }` } innerRef={ elementRef } style={ { zIndex: 2000 } }>
            <Flex className={ `form-select form-select-sm w-full ${ disabled ? 'disabled' : 'cursor-pointer' }` } onClick={ () =>
            {
                if(disabled) return;
                const rect = elementRef.current?.getBoundingClientRect();
                if(rect) setAnchorRect({ left: rect.left, top: rect.top, width: rect.width, height: rect.height });
                setIsOpen(prev => !prev);
            } }>
                <Flex alignItems='center' justifyContent='between' fullWidth>
                    <Flex className='w-full align-items-center'>
                        <Text style={ { maxWidth: 160 } } variant={ disabled ? 'muted' : 'black' } truncate>{ getOptionLabel(value) }</Text>
                    </Flex>
                    <Base className="icon icon-dropdown" />
                </Flex>
            </Flex>
            { isOpen && anchorRect && createPortal(
                <ul ref={ menuRef } className="flash-form-select dropdown-menu show" style={ {
                    position: 'fixed',
                    top: (anchorRect.top + anchorRect.height - 20),
                    left: anchorRect.left,
                    zIndex: 2000,
                    minWidth: anchorRect.width,
                } }>
                    { safeOptions.map((option, index) =>
                        <li key={ index } className={ `dropdown-item cursor-pointer ${ value === option.value ? 'active' : '' }` } onClick={ () => { setValue(option.value); setIsOpen(false); } }>
                            { option.label }
                        </li>
                    ) }
                </ul>,
                document.body
            ) }
        </Flex>
    );
}
