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
  offerData: SimplePeer.SignalData;
  answerReceived = false;
  timerInstance: any;
  minutesDuration = 0;
  mirrorVideo = true;
  isFullscreen = false;

  constructor(public webRTCService: WebRTCService,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private webSocketService: WebSocketService,
    private shareService: ShareService,
    private shareDialogService: ShareDialogService,
    private router: Router) { }

  async ngOnInit() {
    this.route.queryParamMap
      .subscribe(params => {
        if (params.has('code')) {
          const code = params.get('code');
          if (code) {
            this.code = code;
          }
        } else {
          this.dialogService.alert('The invitation link is invalid');
        }
        if (params.has('host')) {
          this.isHost = params.get('host') === 'true';
        }
      });

    // Get stream
    if (await this.hasPermission()) {
      this.getPermission();
    }

    // Get camera and mic permission
    while (!(await this.hasPermission())) {
      const hasConfirmed = await this.dialogService.confirm('Grant permission for your camera and microphone?');
      if (hasConfirmed) {
        await this.getPermission();
      }
    }

    this.webRTCSignalSubscription = this.webSocketService.webRTCSignal$
      .subscribe(data => {
        if (data.data.type === 'offer') {
          this.offerData = data.data;
        } else if (data.data.type === 'answer') {
          this.answerReceived = true;
        }
      });
  }

  async hasPermission() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.some(device => device.deviceId !== '' && 'audioinput' === device.kind) &&
      devices.some(device => device.deviceId !== '' && 'videoinput' === device.kind);
  }

  async getPermission() {
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

  activateCall() {
    this.hasCallStarted = true;
    this.outgoingVideoPosition = OutgoingVideoPosition.BOTTOM_RIGHT;
    this.startTimer();
  }

  startVideoCall() {
    this.webRTCService.startVideoCall(this.stream, this.outgoingVideo.nativeElement, this.incomingVideo.nativeElement);
  }

  acceptVideoCall() {
    this.webRTCService.acceptVideoCall(this.stream, this.offerData, this.outgoingVideo.nativeElement, this.incomingVideo.nativeElement);
  }

  stopVideoCall() {
    this.webRTCService.destroy();
    if (this.stream) {
      this.stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    }
    this.webRTCService.setVideoElement(this.outgoingVideo.nativeElement, null);
    this.stopTimer();
  }

  rotateCamera() {
    // TODO
  }

  record() {
    // TODO
  }

  setMicState(enabled: boolean) {
    if (this.stream) {
      this.stream.getAudioTracks()[0].enabled = enabled;
      this.isMicOn = enabled;
    }
  }

  setCameraState(enabled: boolean) {
    if (this.stream) {
      this.stream.getVideoTracks()[0].enabled = enabled;
      this.isCameraOn = enabled;
    }
  }

  startTimer() {
    this.timerInstance = setTimeout(() => {
      this.minutesDuration++;
    }, 60000);
  }

  stopTimer() {
    clearTimeout(this.timerInstance);
    this.minutesDuration = 0;
  }

  becomeHost() {
    this.router.navigate([], { queryParams: { host: true }, queryParamsHandling: 'merge' });
  }

  share() {
    const url = [`/call?code=${this.code}`];
    const title = 'Call Invite';
    if (!this.shareService.webShareWithUrl(title, url)) {
      this.shareDialogService.share(url, title);
    }
  }

  openFullscreen() {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
      this.isFullscreen = true;
    }
  }

  closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      this.isFullscreen = false;
    }
  }

  ngOnDestroy() {
    if (this.webRTCSignalSubscription) {
      this.webRTCSignalSubscription.unsubscribe();
    }
  }
}

enum OutgoingVideoPosition {
  FULLSCREEN = 1,
  TOP_LEFT = 2,
  TOP_RIGHT = 3,
  BOTTOM_LEFT = 4,
  BOTTOM_RIGHT = 5,
}