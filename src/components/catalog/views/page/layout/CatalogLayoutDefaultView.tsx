import { FC } from 'react';
import { getTypePrice } from '../../../../../api';
import { Column, Flex, Text } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';
import { CatalogItemGridWidgetView } from '../widgets/CatalogItemGridWidgetView';
import { CatalogLimitedItemWidgetView } from '../widgets/CatalogLimitedItemWidgetView';
import { CatalogPurchaseWidgetView } from '../widgets/CatalogPurchaseWidgetView';
import { CatalogSelectItemWidgetView } from '../widgets/CatalogSelectItemWidgetView';
import { CatalogSpinnerWidgetView } from '../widgets/CatalogSpinnerWidgetView';
import { CatalogTotalPriceWidget } from '../widgets/CatalogTotalPriceWidget';
import { CatalogViewProductWidgetView } from '../widgets/CatalogViewProductWidgetView';
import { CatalogLayoutProps } from './CatalogLayout.types';

export const CatalogLayoutDefaultView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props;
    const { currentOffer = null, currentPage = null } = useCatalog();

    return (
        <div>
            <Column className="position-relative catalog-default-image" center={ !currentOffer } size={ 5 } overflow="hidden">
                { !currentOffer &&
                    <>
                        { !!page.localization.getImage(1) && <img className="catalog-image-column" alt="" src={ page.localization.getImage(1) } /> }
                    </> }
                { currentOffer &&
                    <Flex fullWidth position="relative" overflow="hidden">
                        <CatalogViewProductWidgetView />
                        <CatalogTotalPriceWidget className={ `credits-default-layout ${ getTypePrice(currentOffer.priceType) } py-1 px-2 bottom-2 end-2` } justifyContent="end" alignItems="end" />
                        <Flex justifyContent="between" alignItems="center" fullWidth className="item-title">
                            <Text bold variant="white">{ currentOffer.localizationName }</Text>
                            <CatalogLimitedItemWidgetView />
                        </Flex>
                    </Flex> }
            </Column>
            <Column>
                <Column position="absolute" className="grid-bg p-1" size={ 7 } overflow="hidden" style={ { height: 'calc(100% - 480px)', width: '64%' } }>
                    <CatalogItemGridWidgetView />
                </Column>
                <Flex gap={ 1 } position="absolute" className="quanity-container bottom-5">
                    <CatalogSpinnerWidgetView />
                </Flex>
                <Flex gap={ 2 } position="absolute" className="purchase-buttons align-items-end bottom-3" style={ { width: '64%' } }>
                    <CatalogPurchaseWidgetView />
                </Flex>
                <CatalogSelectItemWidgetView />
            </Column>
        </div>
    );
}
