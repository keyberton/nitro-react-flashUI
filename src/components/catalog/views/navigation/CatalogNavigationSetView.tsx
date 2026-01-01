import { FC } from 'react';
import { ICatalogNode } from '../../../../api';
import { CatalogNavigationItemView } from './CatalogNavigationItemView';

export interface CatalogNavigationSetViewProps
{
    node: ICatalogNode;
    child?: boolean;
    className?: string;
}

export const CatalogNavigationSetView: FC<CatalogNavigationSetViewProps> = props =>
{
    const { node = null, child = false, className = '' } = props;
    
    return (
        <>
            { node && (node.children.length > 0) && node.children.map((n, index) =>
            {
                if(!n.isVisible) return null;
                    
                return <CatalogNavigationItemView className={ className } key={ index } node={ n } child={ child } />
            }) }
        </>
    );
}
