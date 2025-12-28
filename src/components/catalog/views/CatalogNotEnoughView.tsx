import { FC, useState } from 'react';
import { LocalizeText } from '../../../api';
import { Button, Column, Flex, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../common';
import { CatalogNotEnoughBalanceEvent } from '../../../events';
import { useUiEvent } from '../../../hooks';

interface CatalogNotEnoughViewProps
{
    type?: string;
}

export const CatalogNotEnoughView: FC<CatalogNotEnoughViewProps> = props => 
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ missingType, setMissingType ] = useState('');
    const [ currencyId, setCurrencyId ] = useState(-1);
    const { type = '' } = props;

    useUiEvent<CatalogNotEnoughBalanceEvent>(CatalogNotEnoughBalanceEvent.NOT_ENOUGH_BALANCE, event =>
    {
        setMissingType(event.currencyType);
        setCurrencyId(event.currencyId);
        setIsVisible(true);
    });

    const close = () => setIsVisible(false);

    return (
        <>
            { isVisible && 
                <NitroCardView className="catalog-not-enough-view" visible={ isVisible }>
                    <NitroCardHeaderView headerText={ missingType === 'credits' ? LocalizeText('catalog.alert.notenough.title') : LocalizeText('catalog.alert.notenough.activitypoints.title' + (currencyId !== -1 ? ('.' + currencyId) : '')) } onCloseClick={ close } />
                    <NitroCardContentView>
                        <Column justifyContent="between" fullHeight fullWidth>
                            <Flex className="catalog-not-enough-content">
                                <Flex className="catalog-not-enough-text px-3">
                                    <Text>{ missingType === 'credits' ? 
                                        LocalizeText('catalog.alert.notenough.credits.description') : 
                                        LocalizeText('catalog.alert.notenough.activitypoints.description' + 
                                        (currencyId !== -1 ? ('.' + currencyId) : '')) }
                                    </Text>
                                </Flex>
                            </Flex>
                            <Flex fullWidth justifyContent="between" className="px-4 pe-5 pb-2">
                                <Button onClick={ close } className="text-black border-0" variant="link">
                                    <Text variant="black">{ LocalizeText('generic.cancel') }</Text>
                                </Button>
                                <Button onClick={ close } className="text-black btn-bold px-3 py-0" variant="muted">
                                    <Text variant="black">{ LocalizeText('generic.ok') }</Text>
                                </Button>
                            </Flex>
                        </Column>
                    </NitroCardContentView>
                </NitroCardView>
            }
        </>
    );
}
