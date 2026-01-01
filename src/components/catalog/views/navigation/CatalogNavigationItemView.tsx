import { FC } from 'react';
import { ICatalogNode } from '../../../../api';
import { Base, LayoutGridItem, Text } from '../../../../common';
import { useCatalog } from '../../../../hooks';
import { CatalogIconView } from '../catalog-icon/CatalogIconView';
import { CatalogNavigationSetView } from './CatalogNavigationSetView';

export interface CatalogNavigationItemViewProps
{
    node: ICatalogNode;
    child?: boolean;
    className?: string;
}

export const CatalogNavigationItemView: FC<CatalogNavigationItemViewProps> = props =>
{
    const { node = null, child = false, className = '' } = props;
    const { activateNode = null } = useCatalog();
    
    return (
        <>
            <LayoutGridItem className={ className } rounded={ false } style={ { paddingLeft: `${ (node.depth -2) * 10 }px` } } gap={ 1 } column={ false } itemActive={ node.isActive } onClick={ event => activateNode(node) }> <CatalogIconView icon={ node.iconId } />
                <Text grow truncate>{ node.localization }</Text>
                { node.isBranch &&
                    <>
                        { node.isOpen && <Base className="icon icon-catalogue-arrows" /> }
                        { !node.isOpen && <Base className="icon icon-catalogue-arrows open" /> }
                    </> }
            </LayoutGridItem>
            { node.isOpen && node.isBranch &&
                <CatalogNavigationSetView className='nitro-catalog-subitem' node={ node } child={ true } /> }

        </>
    );
}
