import { NitroEvent } from '@nitrots/nitro-renderer';
import { IPurchasableOffer } from '../../api';

export class CatalogPurchaseConfirmedEvent extends NitroEvent
{
    public static PURCHASE_CONFIRMED: string = 'CPCE_PURCHASE_CONFIRMED';

    constructor(
        public readonly offer: IPurchasableOffer,
        public readonly pageId: number,
        public readonly extraData: string,
        public readonly quantity: number
    )
    {
        super(CatalogPurchaseConfirmedEvent.PURCHASE_CONFIRMED);
    }
}
