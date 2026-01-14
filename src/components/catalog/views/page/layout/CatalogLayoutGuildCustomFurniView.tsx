import { FC } from 'react';
import { getTypePrice } from '../../../../../api';
import { Base, Column, Flex, Text } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';
import { CatalogGuildBadgeWidgetView } from '../widgets/CatalogGuildBadgeWidgetView';
import { CatalogGuildSelectorWidgetView } from '../widgets/CatalogGuildSelectorWidgetView';
import { CatalogItemGridWidgetView } from '../widgets/CatalogItemGridWidgetView';
import { CatalogPurchaseWidgetView } from '../widgets/CatalogPurchaseWidgetView';
import { CatalogTotalPriceWidget } from '../widgets/CatalogTotalPriceWidget';
import { CatalogViewProductWidgetView } from '../widgets/CatalogViewProductWidgetView';
import { CatalogLayoutProps } from './CatalogLayout.types';

export const CatalogLayouGuildCustomFurniView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props;
    const { currentOffer = null } = useCatalog();
    
    return (
        <Column fullHeight>
            <Column className="position-relative" center={ !currentOffer } size={ 5 } overflow="hidden">
                { !currentOffer &&
                    <>
                        { !!page.localization.getImage(1) && <img alt="" src={ page.localization.getImage(1) } /> }
                        <Text className="py-5" center dangerouslySetInnerHTML={ { __html: page.localization.getText(0) } } />
                    </> }
                { currentOffer &&
                    <>
                        <Base position="relative" overflow="hidden">
                            <CatalogViewProductWidgetView />
                            <Text fontSize={6} bold variant="white" className="item-title top-0 start-0" position='absolute' grow truncate>{ currentOffer.localizationName }</Text>
                            <CatalogGuildBadgeWidgetView position="absolute" className="bottom-5 end-1" />
                            <CatalogTotalPriceWidget className={ `credits-default-layout ${ getTypePrice(currentOffer.priceType) } py-1 px-2 bottom-2 end-2` } justifyContent="end" alignItems="end" />
                        </Base>
                    </> }
            </Column>
            <Column className="grid-bg group-furni-picker p-1" size={ 7 } overflow="hidden">
                <CatalogItemGridWidgetView />
            </Column>
            { currentOffer &&
                <Flex fullWidth>
                    <CatalogGuildSelectorWidgetView />
                </Flex>
            }
            <Flex gap={ 2 } className="purchase-buttons align-items-end mt-4">
                <CatalogPurchaseWidgetView />
            </Flex>
        </Column>
    );
}
