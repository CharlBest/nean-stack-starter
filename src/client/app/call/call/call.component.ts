import { Location } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import SimplePeer from 'simple-peer';
import { DialogService } from '../../shared/dialog/dialog.service';
import { ShareService } from '../../shared/services/share.service';
import { WebRTCService } from '../../shared/services/webrtc.service';
import { WebSocketService } from '../../shared/services/websocket.service';
import { ShareDialogService } from '../../shared/share-dialog/share-dialog.service';

@Component({
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.scss']
})
export class CallComponent implements OnInit, OnDestroy {

  @ViewChild('incomingVideo', { static: true }) incomingVideo: ElementRef<HTMLVideoElement>;
  @ViewChild('outgoingVideo', { static: true }) outgoingVideo: ElementRef<HTMLVideoElement>;
  @ViewChild('ringAudio', { static: true }) ringAudio: ElementRef<HTMLAudioElement>;

  code: string;
  stream: MediaStream;
  isHost = false;
  outgoingVideoPosition: OutgoingVideoPosition = OutgoingVideoPosition.FULLSCREEN;
  OutgoingVideoPositionType = OutgoingVideoPosition;
  hasCallStarted = false;
  showIcons = true;
  isMicOn = true;
  isCameraOn = true;
  webRTCSignalSubscription: Subscription;
  webRTCCloseSubscription: Subscription;
  offerData: SimplePeer.SignalData;
  answerReceived = false;
  timerInstance: number;
  minutesDuration = 0;
  mirrorVideo = true;
  isFullscreen = false;
  callingInverval: number;
  isRinging = false;
  readonly totalNumberOfRings = 20;
  readonly ringInterval = 3000;
  get hasVibrate(): boolean {
    if ('vibrate' in navigator || 'mozVibrate' in navigator) {
      return true;
    } else {
      return false;
    }
  }

  constructor(public webRTCService: WebRTCService,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private webSocketService: WebSocketService,
    private shareService: ShareService,
    private shareDialogService: ShareDialogService,
    private router: Router,
    private location: Location) { }

  async ngOnInit(): Promise<void> {
    if (!this.webRTCService.isSupported) {
      await this.dialogService.alert({
        title: 'Feature not supported',
        body: 'This feature is not supported on your device. Please exit.'
      });
      this.location.back();
    }

    this.route.queryParamMap
      .subscribe(params => {
        if (params.has('code')) {
          const code = params.get('code');
          if (code) {
            this.code = code;
          }
        } else {
          this.dialogService.alert({
            title: 'Problem',
            body: 'The invitation link is invalid'
          });
        }
        if (params.has('host')) {
          this.isHost = params.get('host') === 'true';
        }
      });

    // Get stream
    await this.getStream();

    this.webRTCSignalSubscription = this.webSocketService.webRTCSignal$
      .subscribe(data => {
        if (data.data.type === 'offer') {
          this.startRing();
          this.offerData = data.data;
        } else if (data.data.type === 'answer') {
          this.answerReceived = true;
          clearInterval(this.callingInverval);
        }
      });

    this.webRTCCloseSubscription = this.webRTCService.closed.subscribe(async () => {
      await this.dialogService.alert({
        title: 'End of call',
        body: 'The call was ended.'
      });
      this.stopVideoCall();
    });
  }

  async getStream(): Promise<void> {
    if (await this.hasPermission()) {
      this.getPermission();
    } else {
      // Get camera and mic permission
      const hasConfirmed = await this.dialogService.confirm({
        title: 'Camera and microphone permission',
        body: 'Grant permission for your camera and microphone?',
        confirmButtonText: 'Allow',
        closeButtonText: 'Deny'
      });
      if (hasConfirmed) {
        await this.getPermission();
      } else {
        this.location.back();
      }
    }
  }

  async hasPermission(): Promise<boolean> {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.some(device => device.deviceId !== '' && 'audioinput' === device.kind) &&
      devices.some(device => device.deviceId !== '' && 'videoinput' === device.kind);
  }

  async getPermission(): Promise<void> {
    try {
      // Get video/voice stream
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: true
      });

      this.webRTCService.setVideoElement(this.outgoingVideo.nativeElement, this.stream);
      this.outgoingVideo.nativeElement.muted = true;
    } catch (error) {
      console.error(error);
    }
  }

  activateCall(): void {
    this.hasCallStarted = true;
    this.outgoingVideoPosition = OutgoingVideoPosition.BOTTOM_RIGHT;
    this.startTimer();
  }

  deactivateCall(): void {
    this.hasCallStarted = false;
    this.outgoingVideoPosition = OutgoingVideoPosition.FULLSCREEN;
    this.stopTimer();
  }

  startVideoCall(): void {
    this.activateCall();
    this.webRTCService.startVideoCall(this.stream, this.outgoingVideo.nativeElement, this.incomingVideo.nativeElement);

    let rings = 0;
    this.callingInverval = window.setInterval(() => {
      this.webRTCService.sendSignal();
      rings++;
      if (rings > this.totalNumberOfRings) {
        clearInterval(this.callingInverval);
        this.deactivateCall();
      }
    }, this.ringInterval);
  }

  acceptVideoCall(): void {
    this.stopRing();
    this.activateCall();
    this.webRTCService.acceptVideoCall(this.stream, this.offerData, this.outgoingVideo.nativeElement, this.incomingVideo.nativeElement);
  }

  stopVideoCall(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    }
    this.webRTCService.setVideoElement(this.outgoingVideo.nativeElement, null);
    this.stopTimer();

    this.webRTCService.destroy();

    this.location.back();
  }

  rotateCamera(): void {
    // TODO
  }

  record(): void {
    // TODO
  }

  setMicState(enabled: boolean): void {
    if (this.stream) {
      this.stream.getAudioTracks()[0].enabled = enabled;
      this.isMicOn = enabled;
    }
  }

  setCameraState(enabled: boolean): void {
    if (this.stream) {
      this.stream.getVideoTracks()[0].enabled = enabled;
      this.isCameraOn = enabled;
    }
  }

  startTimer(): void {
    this.timerInstance = window.setTimeout(() => {
      this.minutesDuration++;
    }, 60000);
  }

  stopTimer(): void {
    clearTimeout(this.timerInstance);
    this.minutesDuration = 0;
  }

  becomeHost(): void {
    this.router.navigate([], { queryParams: { host: true }, queryParamsHandling: 'merge' });
  }

  share(): void {
    const url = ['/call'];
    const queryParams = { queryParams: { code: this.code } };
    const title = 'Call Invite';
    if (!this.shareService.webShareWithUrl(title, url, queryParams)) {
      this.shareDialogService.share(title, url, queryParams);
    }
  }

  openFullscreen(): void {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
      this.isFullscreen = true;
    }
  }

  closeFullscreen(): void {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      this.isFullscreen = false;
    }
  }

  startRing(): void {
    if (!this.isRinging) {
      this.isRinging = true;

      // Vibrate
      if (this.hasVibrate) {
        const timesToVibrate = this.totalNumberOfRings * this.ringInterval / 2000;
        navigator.vibrate(new Array(timesToVibrate).fill(2000));
      }

      // Play sound
      this.ringAudio.nativeElement.play();
    }
  }

  stopRing(): void {
    this.isRinging = false;

    if (this.hasVibrate) {
      navigator.vibrate(0);
    }

    this.ringAudio.nativeElement.pause();
  }

  ngOnDestroy(): void {
    if (this.webRTCSignalSubscription) {
      this.webRTCSignalSubscription.unsubscribe();
    }
    if (this.webRTCCloseSubscription) {
      this.webRTCCloseSubscription.unsubscribe();
    }
    this.stopRing();
  }
}

enum OutgoingVideoPosition {
  FULLSCREEN = 1,
  TOP_LEFT = 2,
  TOP_RIGHT = 3,
  BOTTOM_LEFT = 4,
  BOTTOM_RIGHT = 5,
}
