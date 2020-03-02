import React, {FunctionComponent, useEffect, useState} from 'react';
import './ExploreContainer.css';
import {IonButton, IonButtons, IonContent, IonIcon, IonRow, IonToolbar} from "@ionic/react";
import {arrowUndoOutline, trashOutline} from "ionicons/icons";
import "@codetrix-studio/capacitor-google-auth";
import CanvasDraw from "react-canvas-draw";
import firebase from "firebase"

const CanvasDrawCustom: FunctionComponent = () => {

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const getCanvasAsBase64 = async () => {
        return Array.from(document.getElementsByClassName("canvasDraw")[0].children)
            .filter(
                v => v.attributes.getNamedItem("style")?.value.includes("z-index: 11;")
            )[0] as HTMLCanvasElement;
    };

    const signIn = async () => {
        firebase.auth()
            .signInWithPopup(new firebase.auth.GoogleAuthProvider())
            .then(() => setIsLoggedIn(true));
    };

    const signOut = async () => {
        firebase.auth().signOut().then(() => setIsLoggedIn(false))
    };

    useEffect(() => {
        connectToFirebase();
    }, []);

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
    };

    const sendDraw = () => {
        getCanvasAsBase64()
            .then(canvasImage => {
                console.log(canvasImage.toDataURL("image/png"));
                firebase
                    .storage()
                    .ref()
                    .child("mockup.png")
                    .putString(
                        canvasImage
                            .toDataURL("image/png")
                            .replace("data:image/png;base64,", ""),
                        'base64'
                    )
            }).then(() => firebase.database().ref().child('hasChangedMockup').set(true));
    };

    let drawingCanvas: CanvasDraw | null;

    return (
        <IonContent>
            <IonRow onTouchEnd={() => sendDraw()} onClick={() => sendDraw()}>
                {
                    (isLoggedIn
                        && <CanvasDraw
                            className={"canvasDraw"}
                            ref={canvasDraw => (drawingCanvas = canvasDraw)}
                            canvasWidth={window.innerWidth}
                            canvasHeight={window.innerHeight - 80}
                            brushRadius={1}
                            brushColor={"#000"}
                            hideGrid={true}
                            loadTimeOffset={0}
                            lazyRadius={0}
                        />)
                    || <p style={{textAlign: "center", minWidth: window.innerWidth}}>Veuillez vous connecter</p>
                }
            </IonRow>
            <IonRow style={{borderTop: "#000 solid"}}>
                <IonToolbar>
                    <IonButtons slot={"start"}>
                        {
                            (
                                isLoggedIn &&
                                <IonButton className="login-button" onClick={() => signOut()} expand="block"
                                           fill="solid"
                                           color="danger">
                                    Logout
                                </IonButton>
                            ) ||
                            <IonButton className="login-button" onClick={() => signIn()} expand="block" fill="solid"
                                       color="danger">
                                Login
                            </IonButton>
                        }
                    </IonButtons>
                    {isLoggedIn &&
                    <IonButtons slot={"end"}>
                        <IonButtons>
                            <IonIcon
                                slot={"end"}
                                size={"large"}
                                icon={arrowUndoOutline}
                                onClick={() => {
                                    drawingCanvas?.undo();
                                    sendDraw();
                                }}
                            />
                        </IonButtons>
                        <IonButton onClick={() => {
                            drawingCanvas?.clear();
                            sendDraw();
                        }}>
                            <IonIcon
                                slot={"end"}
                                size={"large"}
                                icon={trashOutline}
                            />
                        </IonButton>
                    </IonButtons>
                    }
                </IonToolbar>
            </IonRow>
        </IonContent>
    );
};

export default CanvasDrawCustom;
