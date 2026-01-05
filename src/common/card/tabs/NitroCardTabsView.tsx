import { FC, useMemo } from 'react';
import { Flex, FlexProps } from '../..';

interface NitroCardTabsProps extends FlexProps
{
    subClassName?: string;
    special?: boolean;
}
export const NitroCardTabsView: FC<NitroCardTabsProps> = props =>
{
    const { justifyContent = 'center', special = false, gap = 1, classNames = [], children = null,subClassName = '', ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'container-fluid', 'nitro-card-tabs', 'pt-1', 'position-relative' ];

        if(special) newClassNames.push('special');

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    return (
        <Flex classNames={ getClassNames } { ...rest }>
            <ul className={ 'nav nav-tabs border-0 ' + subClassName }>
                { children }
            </ul>
        </Flex>
    );
}
