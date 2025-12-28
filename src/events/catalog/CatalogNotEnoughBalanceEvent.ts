import { NitroEvent } from '@nitrots/nitro-renderer';

export class CatalogNotEnoughBalanceEvent extends NitroEvent
{
    public static NOT_ENOUGH_BALANCE: string = 'CNEBE_NOT_ENOUGH_BALANCE';

    private _currencyType: string;
    private _currencyId: number;

    constructor(currencyType: string, currencyId: number)
    {
        super(CatalogNotEnoughBalanceEvent.NOT_ENOUGH_BALANCE);

        this._currencyType = currencyType;
        this._currencyId = currencyId;
    }

    public get currencyType(): string
    {
        return this._currencyType;
    }

    public get currencyId(): number
    {
        return this._currencyId;
    }
}
