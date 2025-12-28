import { ILinkEventTracker, PurchaseFromCatalogComposer } from '@nitrots/nitro-renderer';
import { AddEventLinkTracker, IPurchasableOffer, LocalizeText, RemoveLinkEventTracker, SendMessageComposer } from '../../../api';
import { Base, Button, CreateTransitionToIcon, Flex, LayoutCurrencyIcon, LayoutFurniImageView, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../common';
import { CatalogPurchaseConfirmationEvent } from '../../../events';
import { useUiEvent } from '../../../hooks';
import { FC, useEffect, useRef, useState } from 'react';

export const CatalogPurchaseConfirmView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ offer, setOffer ] = useState<IPurchasableOffer>(null);
    const [ pageId, setPageId ] = useState(-1);
    const [ extraData, setExtraData ] = useState<string>(null);
    const [ quantity, setQuantity ] = useState(1);
    const imageContainerRef = useRef<HTMLDivElement>(null);

    useUiEvent<CatalogPurchaseConfirmationEvent>(CatalogPurchaseConfirmationEvent.CONFIRM_PURCHASE, event => 
    {
        setOffer(event.offer);
        setPageId(event.pageId);
        setExtraData(event.extraData);
        setQuantity(event.quantity);
        setIsVisible(true);
    });

    useEffect(() => 
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) => 
            {
                const parts = url.split('/');
    
                if(parts.length < 2) return;
    
                switch(parts[1]) 
                {
                    case 'show':
                        setIsVisible(true);
                        return;
                    case 'hide':
                        setIsVisible(false);
                        return;
                }
            },
            eventUrlPrefix: 'catalog/'
        };
    
        AddEventLinkTracker(linkTracker);
    
        return () => RemoveLinkEventTracker(linkTracker);
    }, [ setIsVisible ]);

    const confirm = () => 
    {
        SendMessageComposer(new PurchaseFromCatalogComposer(pageId, offer.offerId, extraData, quantity));
        
        if(imageContainerRef.current)
        {
            const furniImage = imageContainerRef.current.querySelector('.furni-image') as HTMLDivElement;
            
            if(furniImage)
            {
                const style = window.getComputedStyle(furniImage);
                const backgroundImage = style.backgroundImage;
                
                if(backgroundImage && (backgroundImage !== 'none'))
                {
                    const url = backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/, '$1');
                    
                    if(url)
                    {
                        const image = new Image();
                        
                        image.src = url;
                        image.width = parseFloat(style.width) || furniImage.offsetWidth;
                        image.height = parseFloat(style.height) || furniImage.offsetHeight;
                        
                        CreateTransitionToIcon(image, furniImage, 'icon-inventory');
                    }
                }
            }
        }

        setIsVisible(false);
    };

    const cancel = () => 
    {
        setIsVisible(false);
    };

    if(!isVisible || !offer) return null;

    return (
        <NitroCardView className="catalog-purchase-confirm-view no-resize" theme="primary">
            <NitroCardHeaderView headerText={ LocalizeText('catalog.purchase_confirmation.title') } onCloseClick={ cancel } />
            <NitroCardContentView className="text-black">
                <Flex column>
                    <Flex className="p-1" gap={ 2 }>
                        <Flex className="image-preview-container" center innerRef={ imageContainerRef }>
                            <LayoutFurniImageView productType={ offer.product.productType } productClassId={ offer.product.productClassId } extraData={ extraData } />
                        </Flex>
                        <Flex className="mt-3" gap={ 2 } column>
                            <Text fontWeight="bold" fontSize={ 6 }>{ offer.product?.productData?.name || offer.localizationId }</Text>
                            <Flex alignItems="center" gap={ 1 }>
                                <Text bold>X { quantity }</Text>
                            </Flex>
                            { (offer.priceInCredits > 0 || offer.priceInActivityPoints > 0) &&
                                <Flex alignItems="center" gap={ 1 }>
                                    <Text>{ LocalizeText('catalog.purchase.confirmation.dialog.cost') } </Text>
                                    { (offer.priceInCredits > 0) &&
                                        <Flex alignItems="center" gap={ 1 }>
                                            <Text bold>{ (offer.priceInCredits * quantity) }</Text>
                                            <Base className="icon icon-credits" />
                                        </Flex> }
                                    { (offer.priceInCredits > 0) && (offer.priceInActivityPoints > 0) &&
                                        <Text bold>+</Text> }
                                    { (offer.priceInActivityPoints > 0) &&
                                        <Flex alignItems="center" gap={ 1 }>
                                            <Text bold> { (offer.priceInActivityPoints * quantity) }</Text>
                                            <LayoutCurrencyIcon type={ offer.activityPointType } />
                                        </Flex> }
                                </Flex> }
                        </Flex>
                    </Flex>
                    <Flex justifyContent="between" className="mt-2 px-2">
                        <Button variant="danger" onClick={ cancel }>{ LocalizeText('generic.cancel') }</Button>
                        <Button variant="success" onClick={ confirm }>{ LocalizeText('catalog.marketplace.confirm_title') }</Button>
                    </Flex>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
}