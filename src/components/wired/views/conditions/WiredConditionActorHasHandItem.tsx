import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Column, Text } from '../../../../common';
import { Select } from '../../../../common/Select';
import { useWired } from '../../../../hooks';
import { WiredConditionBaseView } from './WiredConditionBaseView';

const ALLOWED_HAND_ITEM_IDS: number[] = [ 2, 5, 7, 8, 9, 10, 27 ];

export const WiredConditionActorHasHandItemView: FC<{}> = props =>
{
    const [ handItemId, setHandItemId ] = useState(-1);
    const { trigger = null, setIntParams = null } = useWired();

    const save = () => setIntParams([ handItemId ]);

    useEffect(() =>
    {
        setHandItemId((trigger.intData.length > 0) ? trigger.intData[0] : 0);
    }, [ trigger ]);

    return (
        <WiredConditionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <Column gap={ 1 }>
                <Text gfbold>{ LocalizeText('wiredfurni.params.handitem') }</Text>
                <Select
                    fullWidth
                    options={ ALLOWED_HAND_ITEM_IDS.map(value => ({ value, label: LocalizeText(`handitem${ value }`) })) }
                    value={ handItemId }
                    setValue={ value => setHandItemId(Number(value)) } />
            </Column>
        </WiredConditionBaseView>
    );
}
