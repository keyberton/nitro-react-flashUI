
import { Column, Flex, FlexProps } from '../../../common';
import { FC, useMemo } from 'react';

interface AvatarCardTabsViewProps extends FlexProps
{
    subClassName?: string;
    wardrobeVisible?: boolean;
    username?: string;
}
export const AvatarCardTabsView: FC<AvatarCardTabsViewProps> = props =>
{
    const { justifyContent = 'center', gap = 1, classNames = [], children = null,subClassName = '', username = '', wardrobeVisible = false, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'container-fluid', 'nitro-card-tabs', 'pt-1', 'position-relative' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    return (
        <Flex>
            <Column classNames={ getClassNames } { ...rest }>
                <Flex className="card-tab-username" alignItems="center">
                    { username }
                </Flex>
                <Flex>
                    <ul className={ 'nav nav-tabs border-0 ' + subClassName }>
                        { children }
                    </ul>
                </Flex>
            </Column>
            <Flex className={ 'wardrobe-blank' + (wardrobeVisible ? '' : ' d-none') }/>
        </Flex>
    );
}
