import React, {FunctionComponent, useEffect, useState} from 'react';
import './ExploreContainer.css';
import {IonApp, IonButton, IonButtons, IonContent, IonIcon, IonRow, IonToolbar} from "@ionic/react";
import {arrowRedoOutline, arrowUndoOutline, trashOutline} from "ionicons/icons";
import CanvasDraw from "react-canvas-draw";
import {Plugins} from '@capacitor/core/dist/esm';
import firebase from "firebase";


interface ContainerProps {
    name: string;
}

const CanvasDrawCustom: FunctionComponent = () => {

    let drawingCanvas: CanvasDraw | null;
    const {StatusBar} = Plugins;
    let canvasDrawImageHtmlElement: HTMLCanvasElement | undefined;

    const connectToFirebase = async () => {
        const config = {
            apiKey: "AIzaSyBgtpmqpfdqBOA6sQcYNaqzY5xOLnkG3tg",
            authDomain: "mockup-to-html.firebaseapp.com",
            databaseURL: "https://mockup-to-html.firebaseio.com",
            projectId: "mockup-to-html",
            storageBucket: "mockup-to-html.appspot.com",
            messagingSenderId: "735909160162",
            appId: "1:735909160162:web:ac85fa4f9e97a3a53a2abb"
        };

        await firebase.initializeApp(config);
    }

    useEffect(() => {
        const getCanvasAsBase64 = async () => {
            canvasDrawImageHtmlElement =
                Array.from(document.getElementsByClassName("canvasDraw")[0].children)
                    .filter(
                        v => v.attributes.getNamedItem("style")?.value.includes("z-index: 11;")
                    )[0] as HTMLCanvasElement;
        }
        StatusBar.hide();

        getCanvasAsBase64()
            .then(sendDraw);

    }, [])

    const sendDraw = () => {

        console.log(canvasDrawImageHtmlElement?.toDataURL())
        setTimeout(sendDraw, 1000)
    }

    return (
        <IonContent>
            <IonRow>
                <CanvasDraw
                    className={"canvasDraw"}
                    ref={canvasDraw => (drawingCanvas = canvasDraw)}
                    canvasWidth={window.innerWidth}
                    canvasHeight={window.innerHeight - 80}
                    brushRadius={2}
                    brushColor={"#000"}
                    hideGrid={true}
                    loadTimeOffset={0}
                    lazyRadius={0}
                />
            </IonRow>
            <IonRow style={{borderTop: "#000 solid"}}>
                <IonToolbar>
                    <IonButtons slot={"start"}>
                        <IonButtons>
                            <IonIcon
                                slot={"start"}
                                size={"large"}
                                icon={arrowUndoOutline}
                                onClick={() => {
                                    drawingCanvas?.undo()
                                }}
                            />
                        </IonButtons>
                    </IonButtons>
                    <IonButtons slot={"end"}>
                        <IonButton onClick={() => {
                            drawingCanvas?.clear()
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
