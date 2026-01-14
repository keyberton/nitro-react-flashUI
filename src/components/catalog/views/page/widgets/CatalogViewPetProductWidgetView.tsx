import { IGetImageListener, ImageResult, TextureUtils, Vector3d } from '@nitrots/nitro-renderer';
import { CSSProperties, FC, useEffect, useMemo, useState } from 'react';
import { GetRoomEngine } from '../../../../../api';
import { Base, BaseProps } from '../../../../../common';

interface CatalogViewPetProductWidgetViewProps extends BaseProps<HTMLDivElement>
{
    productType?: string;
    productClassId?: number;
    direction?: number;
    extraData?: string;
    scale?: number;
}

export const CatalogViewPetProductWidgetView: FC<CatalogViewPetProductWidgetViewProps> = props =>
{
    const { productType = 's', productClassId = -1, direction = 2, extraData = '', scale = 1, style = {}, ...rest } = props;
    const [ imageElement, setImageElement ] = useState<HTMLImageElement>(null);

    const getStyle = useMemo(() =>
    {
        let newStyle: CSSProperties = {};

        if(imageElement?.src?.length)
        {
            newStyle.backgroundImage = `url('${ imageElement.src }')`;
            newStyle.width = imageElement.width;
            newStyle.height = imageElement.height;
        }

        if(scale !== 1)
        {
            newStyle.transform = `scale(${ scale })`;

            if(!(scale % 1)) newStyle.imageRendering = 'pixelated';
        }

        if(Object.keys(style).length) newStyle = { ...newStyle, ...style };

        return newStyle;
    }, [ imageElement, scale, style ]);

    useEffect(() =>
    {
        let imageResult: ImageResult = null;

        const listener: IGetImageListener = {
            imageReady: (id, texture, image) =>
            {
                if(!image && texture)
                {
                    image = TextureUtils.generateImage(texture);
                }

                if(image) image.onload = () => setImageElement(image);
            },
            imageFailed: null
        };

        if(extraData && extraData.length)
        {
            const parts = extraData.split(' ');
            const typeId = parseInt(parts[0]);
            const paletteId = parseInt(parts[1]);
            const color = parseInt(parts[2], 16) || 0xFFFFFF;

            imageResult = GetRoomEngine().getRoomObjectPetImage(typeId, paletteId, color, new Vector3d(direction * 45), 64, listener, false, 0, null);
        }

        if(imageResult)
        {
            const image = imageResult.getImage();

            if(image) image.onload = () => setImageElement(image);
        }
    }, [ productType, productClassId, direction, extraData ]);

    if(!imageElement) return null;

    return <Base classNames={ [ 'furni-image' ] } style={ getStyle } { ...rest } />;
}
