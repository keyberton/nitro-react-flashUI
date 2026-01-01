import { FC } from 'react';
import { CreateLinkEvent, LocalizeText } from '../../../api';
import { Button, Column, Flex, Grid, GridProps, Text } from '../../../common';

export interface InventoryCategoryEmptyViewProps extends GridProps
{
    title: string;
    desc: string;
    isTrading?: boolean;
}

export const InventoryCategoryEmptyView: FC<InventoryCategoryEmptyViewProps> = props =>
{
    const { title = '', desc = '', isTrading = false, children = null, ...rest } = props;
    
    return (
        <Grid { ...rest }>
            <Column center size={ 7 } overflow="hidden">
                <div className="empty-image" />
            </Column>
            <Column className="inventory-empty-container me-3" justifyContent="center" size={ 5 } overflow="hidden">
                <Column className="ps-1" gap={ 1 }>
                    <Text className="empty-title" bold overflow="unset">{ title }</Text>
                    <Text overflow="auto" className="mb-4">{ desc }</Text>
                </Column>
                { !isTrading &&
                    <Flex gap={ 2 } position="absolute" className="bottom-2">
                        <Button className="py-3" onClick={ () => CreateLinkEvent('catalog/open') }>{ LocalizeText('inventory.open.catalog') }</Button>
                    </Flex>
                }
            </Column>
            { children }
        </Grid>
    );
}
