import { EventEmitter, Injectable } from '@angular/core';
import { WebRTCSignalWebSocketModel } from '@shared/models/web-socket/web-rtc-signal-web-socket.model';
import SimplePeer from 'simple-peer';
import { WebSocketService } from './websocket.service';

@Injectable({
    providedIn: 'root'
})
export class WebRTCService {

    peer: SimplePeer.Instance;
    signalData: SimplePeer.SignalData;
    isProcessing = false;
    isSupported = SimplePeer.WEBRTC_SUPPORT;
    readonly closed: EventEmitter<void> = new EventEmitter<void>();

    constructor(private webSocketService: WebSocketService) {
        this.webSocketService.webRTCSignal$
            .subscribe(data => {
                if (data.data.type === 'answer') {
                    this.peer.signal(data.data);
                }
            });
    }

    loadScript(): Promise<void> {
        return new Promise((resolve, reject) => {
            // TODO: temporary fix because Node package isn't working
            const elementId = 'web-rtc-script';
            const script = document.getElementById(elementId);

            if (!script) {
                const node = document.createElement('script');
                node.src = 'https://wzrd.in/standalone/simple-peer';
                node.type = 'text/javascript';
                node.async = false;
                node.id = elementId;
                node.onload = () => resolve();
                node.onerror = () => reject();
                document.getElementsByTagName('head')[0].appendChild(node);
            } else {
                resolve();
            }
        });
    }

    async startVideoCall(stream: MediaStream, outgoingVideoElement: HTMLVideoElement, incomingVideoElement: HTMLVideoElement)
        : Promise<void> {
        try {
            await this.initPeer(stream, {
                initiator: true,
                offerOptions: {
                    offerToReceiveAudio: true,
                    offerToReceiveVideo: true
                }
            }, outgoingVideoElement, incomingVideoElement);
        } catch (error) {
            console.error(error);
        }
    }

    async acceptVideoCall(stream: MediaStream, signalData: SimplePeer.SignalData, outgoingVideoElement: HTMLVideoElement,
        incomingVideoElement: HTMLVideoElement): Promise<void> {
        if (signalData.type === 'offer') {
            try {
                await this.initPeer(stream, {
                    initiator: false,
                    answerOptions: {
                        offerToReceiveAudio: false,
                        offerToReceiveVideo: false
                    },
                }, outgoingVideoElement, incomingVideoElement);

                // Accept
                this.peer.signal(signalData);
            } catch (error) {
                console.error(error);
            }
        }
    }

    async initPeer(stream: MediaStream, simplePeerOptions: SimplePeer.Options | any,
        outgoingVideoElement: HTMLVideoElement, incomingVideoElement: HTMLVideoElement): Promise<void> {
        this.isProcessing = true;

        try {
            this.setVideoElement(outgoingVideoElement, stream);
            outgoingVideoElement.muted = true;

            this.peer = new SimplePeer({
                trickle: false,
                stream,
                ...simplePeerOptions
            });

            this.setupPeerEvents(incomingVideoElement);
        } catch (error) {
            console.error(error);
        }
    }

    setupPeerEvents(videoElement: HTMLVideoElement): void {
        this.peer.on('error', (err: Error) => console.log('Peer error', err));

        this.peer.on('signal', (data: SimplePeer.SignalData) => {
            this.signalData = data;
            this.sendSignal();
        });

        this.peer.on('connect', () => {
            console.log('Web RTC Connected');
            this.isProcessing = false;
        });

        this.peer.on('stream', (stream: MediaStream) => {
            this.setVideoElement(videoElement, stream);
        });

        this.peer.on('close', () => {
            this.closed.emit();
        });
    }

    sendSignal(): void {
        if (this.signalData) {
            const model = new WebRTCSignalWebSocketModel();
            model.data = this.signalData;
            this.webSocketService.send(model);
        } else {
            console.error('Signal data is empty');
        }
    }

    setVideoElement(videoElement: HTMLVideoElement, stream: MediaStream | null): void {
        if (videoElement) {
            if ('srcObject' in videoElement) {
                videoElement.srcObject = stream;
            } else {
                (videoElement as any).src = window.URL.createObjectURL(stream); // for older browsers
            }

            videoElement.play();
        }
    }

    destroy(): void {
        if (this.peer) {
            this.peer.destroy();
        }
    }
}
