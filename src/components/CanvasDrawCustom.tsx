import React, {FunctionComponent} from 'react';
import './ExploreContainer.css';
import {IonApp, IonButton, IonButtons, IonContent, IonIcon, IonRow, IonToolbar} from "@ionic/react";
import {arrowRedoOutline, arrowUndoOutline, trashOutline} from "ionicons/icons";
import CanvasDraw from "react-canvas-draw";

interface ContainerProps {
    name: string;
}

const CanvasDrawCustom: FunctionComponent = () => {

    let canvas: CanvasDraw | null;

    return (
        <IonContent>
            <IonRow>
                <CanvasDraw
                    ref={canvasDraw => (canvas = canvasDraw)}
                    canvasWidth={window.innerWidth}
                    canvasHeight={window.innerHeight-80}
                    brushRadius={2}
                    brushColor={"#000"}
                    hideGrid={true}
                    loadTimeOffset={0}
                    lazyRadius={0}
                />
            </IonRow>
            <IonRow>
                <IonToolbar>
                    <IonButtons slot={"start"}>
                        <IonButtons>
                            <IonIcon
                                slot={"start"}
                                size={"large"}
                                icon={arrowUndoOutline}
                                onClick={() => {
                                    canvas?.undo()
                                }}
                            />
                        </IonButtons>
                    </IonButtons>
                    <IonButtons slot={"end"}>
                        <IonButton onClick={() => {
                            canvas?.clear()
                        }}>
                            <IonIcon
                                slot={"end"}
                                size={"large"}
                                icon={trashOutline}
                            />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonRow>
        </IonContent>
    );
};

export default CanvasDrawCustom;
