import { CSSProperties, FC, ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Base, Flex, Text } from '.';

export interface SelectProps
{
    options: { value: string | number, label: string }[];
    value: string | number;
    setValue: (value: string | number) => void;
    disabled?: boolean;
    className?: string;
    dropdownClassName?: string;
    fullWidth?: boolean;
    flash?: boolean;
    style?: CSSProperties;
    dropdownStyle?: CSSProperties;
    children?: ReactNode;
}

export const Select: FC<SelectProps> = props =>
{
    const { options = [], value = null, setValue = null, disabled = false, className = '', dropdownClassName = '', fullWidth = false, flash = false, style = {}, dropdownStyle = {}, children = null } = props;
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

        const handleScrollOrResize = (event: Event) =>
        {
            if(event.type === 'scroll' && menuRef.current && menuRef.current.contains(event.target as Node)) return;

            setIsOpen(false);
        }

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
        <Flex alignItems="center" position="relative" className={ `${ flash ? 'flash-form-select' : 'volter-form-select' } ${ fullWidth ? 'w-100' : '' } ${ className }` } innerRef={ elementRef } style={ { zIndex: 2000 } }>
            <Flex style={ { ...style } } className={ `form-select form-select-sm ${ disabled ? 'disabled' : 'cursor-pointer' }` } onClick={ () =>
            {
                if(disabled) return;
                const rect = elementRef.current?.getBoundingClientRect();
                if(rect) setAnchorRect({ left: rect.left, top: rect.top, width: rect.width, height: rect.height });
                setIsOpen(prev => !prev);
            } }>
                <Flex alignItems='center' justifyContent='between' fullWidth>
                    <Flex className='align-items-center'>
                        <Text style={ { maxWidth: 160 } } variant={ disabled ? 'muted' : 'black' } truncate>{ getOptionLabel(value) }</Text>
                    </Flex>
                    <Flex className='align-items-center' justifyContent='center'>
                        { children }
                        <Base className={`icon ${flash ? 'icon-dropdown flash' : 'icon-dropdown'}`} />
                    </Flex>
                </Flex>
            </Flex>
            { isOpen && anchorRect && createPortal(
                <ul ref={ menuRef } className={ `${ dropdownClassName ?? '' } ${ flash ? 'flash-form-select' : 'volter-form-select' } dropdown-menu show` } style={ (() =>
                {
                    const parseNum = (v: any) => (typeof v === 'number') ? v : ((typeof v === 'string') ? (parseFloat(v) || 0) : 0);
                    const extraTop = parseNum((dropdownStyle as any)?.top);
                    const extraLeft = parseNum((dropdownStyle as any)?.left);
                    const { top, left, ...rest } = (dropdownStyle as any) || {};

                    return {
                        position: 'fixed',
                        top: (anchorRect.top + anchorRect.height - 20) + extraTop,
                        left: anchorRect.left + extraLeft,
                        zIndex: (typeof (dropdownStyle as any)?.zIndex === 'number') ? (dropdownStyle as any).zIndex : 2000,
                        minWidth: 'max-content',
                        width: anchorRect.width,
                        ...(fullWidth ? { width: anchorRect.width } : {}),
                        ...rest
                    } as CSSProperties;
                })() }>
                    { safeOptions.map((option, index) =>
                        <li key={ index } className={ `position-relative dropdown-item cursor-pointer ${ value === option.value ? 'active' : '' }` } onClick={ () => { setValue(option.value); setIsOpen(false); } }>
                            { option.label }
                            { children }
                        </li>
                    ) }
                </ul>,
                document.body
            ) }
        </Flex>
    );
}
