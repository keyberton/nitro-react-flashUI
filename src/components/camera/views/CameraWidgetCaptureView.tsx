import { NitroRectangle, TextureUtils } from '@nitrots/nitro-renderer';
import { FC, useEffect, useRef, useState } from 'react';
import { CameraPicture, CreateLinkEvent, GetRoomEngine, GetRoomSession, LocalizeText, PlaySound, SoundNames } from '../../../api';
import { Column, DraggableWindow, Flex } from '../../../common';
import { useCamera, useNotification } from '../../../hooks';

export interface CameraWidgetCaptureViewProps
{
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

const CAMERA_ROLL_LIMIT: number = 5;

export const CameraWidgetCaptureView: FC<CameraWidgetCaptureViewProps> = props =>
{
    const { onClose = null, onEdit = null, onDelete = null } = props;
    const { cameraRoll = null, setCameraRoll = null, selectedPictureIndex = -1, setSelectedPictureIndex = null } = useCamera();
    const { simpleAlert = null } = useNotification();
    const [ isRetaking, setIsRetaking ] = useState(false);
    const [ isFlashing, setIsFlashing ] = useState(false);
    const elementRef = useRef<HTMLDivElement>();

    const selectedPicture = ((selectedPictureIndex > -1 && !isRetaking) ? cameraRoll[selectedPictureIndex] : null);

    useEffect(() =>
    {
        setIsRetaking(false);
    }, [ selectedPictureIndex ]);

    useEffect(() =>
    {
        if(selectedPictureIndex > -1) return;

        let index = 0;

        if(cameraRoll.length >= CAMERA_ROLL_LIMIT)
        {
            index = (CAMERA_ROLL_LIMIT - 1);
        }
        else
        {
            for(let i = 0; i < CAMERA_ROLL_LIMIT; i++)
            {
                if(!cameraRoll[i])
                {
                    index = i;
                    
                    break;
                }
            }
        }

        setSelectedPictureIndex(index);
    }, [ selectedPictureIndex, cameraRoll, setSelectedPictureIndex ]);

    const getCameraBounds = () =>
    {
        if(!elementRef || !elementRef.current) return null;

        const frameBounds = elementRef.current.getBoundingClientRect();

        return new NitroRectangle(Math.floor(frameBounds.x), Math.floor(frameBounds.y), Math.floor(frameBounds.width), Math.floor(frameBounds.height));
    }

    const takePicture = () =>
    {
        if(selectedPictureIndex > -1 && cameraRoll[selectedPictureIndex] && !isRetaking)
        {
            setIsRetaking(true);
            return;
        }

        const texture = GetRoomEngine().createTextureFromRoom(GetRoomSession().roomId, 1, getCameraBounds());
        const clone = [ ...cameraRoll ];

        let targetIndex = selectedPictureIndex;

        if(targetIndex === -1)
        {
            for(let i = 0; i < CAMERA_ROLL_LIMIT; i++)
            {
                if(!clone[i])
                {
                    targetIndex = i;
                    break;
                }
            }
        }

        if(targetIndex === -1)
        {
            if(clone.length >= CAMERA_ROLL_LIMIT)
            {
                simpleAlert(LocalizeText('camera.full.body'));

                clone.pop();
            }
            
            targetIndex = clone.length;
        }

        PlaySound(SoundNames.CAMERA_SHUTTER);
        
        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 500);

        clone[targetIndex] = new CameraPicture(texture, TextureUtils.generateImageUrl(texture));

        setCameraRoll(clone);
        
        let nextIndex = -1;

        for(let i = 0; i < CAMERA_ROLL_LIMIT; i++)
        {
            if(!clone[i])
            {
                nextIndex = i;

                break;
            }
        }

        if(nextIndex === -1) nextIndex = targetIndex;

        setSelectedPictureIndex(nextIndex);
    }

    return (
        <DraggableWindow uniqueKey="nitro-camera-capture">
            <Column center className="nitro-camera-capture" gap={ 0 }>
                { selectedPicture && <img alt="" className="camera-area" src={ selectedPicture.imageUrl } /> }
                <div className="camera-canvas drag-handler">
                    <div className="position-absolute fw-bold text-camera">{ LocalizeText('camera.interface.title') }</div>
                    <div className="position-absolute info-camera" onClick={ () => CreateLinkEvent('habbopages/camera') }></div>
                    <div className="position-absolute header-close" onClick={ onClose }></div>
                    <div ref={ elementRef } className="camera-area">
                        <Flex fullHeight fullWidth className='camera-view-finder' style={ { visibility: (selectedPicture ? 'hidden' : 'visible') } }></Flex>
                    </div>
                    { selectedPicture &&
                        <div className="camera-area camera-frame">
                            <div className="camera-frame-preview-actions w-100 position-absolute bottom-0 py-2 text-center">
                                <button style={ { height: 40 } } className="btn btn-success bolder" title={ LocalizeText('camera.editor.button.tooltip') } onClick={ onEdit }>{ LocalizeText('camera.editor.button.text') }</button>
                            </div>
                        </div> }
                    { isFlashing && <div className="camera-area flash" /> }
                    <div className="d-flex justify-content-center">
                        <div className="camera-button" title={ LocalizeText('camera.take.photo.button.tooltip') } onClick={ takePicture } />
                    </div>
                </div>
                    <Flex style={ { gap: 5 } } alignItems='center' justifyContent="start" className="camera-roll d-flex py-2 px-2">
                        { Array.from(Array(CAMERA_ROLL_LIMIT).keys()).map(index =>
                        {
                            const picture = cameraRoll[index];

                            return (
                                <Flex key={ index } className={`camera-roll-item ${(selectedPictureIndex === index) ? 'selected' : ''}`} pointer position='relative'>
                                    { picture &&
                                        <>
                                            <img style={ { width: 58, height: 58 } } className={`${(selectedPictureIndex === index) ? 'selected' : ''}`} alt="" src={ picture.imageUrl } onClick={ event => setSelectedPictureIndex(index) } />
                                            <div className="position-absolute top-0 end-0" style={ { width: 62, height: 62 } }>
                                                <i onClick={ onDelete } className={`${(selectedPictureIndex === index) ? 'camera-close-icon' : ''}`} />
                                                <div style={ { ...(selectedPictureIndex === index) ? { background: "#ffffff40" } : {}, width: 62, height: 62 } } className="position-absolute top-0 end-0" onClick={ event => setSelectedPictureIndex(index) }/>
                                                <div style={ { width: 62, height: 62 } } className={`${(selectedPictureIndex === index) ? 'camera-selected-item' : ''}`} onClick={ event => setSelectedPictureIndex(index) }/>
                                            </div>
                                        </> }
                                    { !picture &&
                                        <>
                                            <div className="position-absolute top-0 end-0" style={ { width: 62, height: 62 } }>
                                                <div style={ { ...(selectedPictureIndex === index) ? { background: "#ffffff40" } : {}, width: 62, height: 62 } } className="position-absolute top-0 end-0" onClick={ event => setSelectedPictureIndex(index) }/>
                                                <div style={ { width: 62, height: 62 } } className={`${(selectedPictureIndex === index) ? 'camera-selected-item' : ''}`} onClick={ event => setSelectedPictureIndex(index) }/>
                                            </div>
                                        </> }
                                </Flex>
                            );
                        }) }
                    </Flex>
            </Column>
        </DraggableWindow>
    );
}
