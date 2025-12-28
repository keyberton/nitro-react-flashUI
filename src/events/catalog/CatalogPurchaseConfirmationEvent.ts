import { NitroEvent } from '@nitrots/nitro-renderer';
import { IPurchasableOffer } from '../../api';

export class CatalogPurchaseConfirmationEvent extends NitroEvent
{
    public static CONFIRM_PURCHASE: string = 'CPCE_CONFIRM_PURCHASE';

    constructor(
        public readonly offer: IPurchasableOffer,
        public readonly pageId: number,
        public readonly extraData: string,
        public readonly quantity: number
    )
    {
        super(CatalogPurchaseConfirmationEvent.CONFIRM_PURCHASE);
    }
}
