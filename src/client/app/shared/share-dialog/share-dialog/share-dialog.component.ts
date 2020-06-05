import { Component, Input, OnInit } from '@angular/core';
import { BreakpointService } from '../../services/breakpoint.service';
import { ShareService } from '../../services/share.service';

@Component({
    templateUrl: './share-dialog.component.html',
    styleUrls: ['./share-dialog.component.scss']
})
export class ShareDialogComponent implements OnInit {

    @Input() url: string;
    @Input() text: string;
    private readonly target = '_black';

    constructor(public shareService: ShareService,
        public bpService: BreakpointService) { }

    ngOnInit() {
    }

    getEncodedUrl(utmSource?: string) {
        return encodeURIComponent(this.getUrlWithUTMParameters(utmSource));
    }

    getEncodedText() {
        return encodeURIComponent(this.text);
    }

    getEncodedTextAndUrl(utmSource?: string) {
        return encodeURIComponent(`${this.text}\n\n${this.getUrlWithUTMParameters(utmSource)}`);
    }

    getUrlWithUTMParameters(utmSource?: string) {
        if (this.url && utmSource) {
            const url = new URL(this.url);
            url.searchParams.set('utm_source', utmSource);
            return url.toString();
        }

        return this.url;
    }

    webShare() {
        this.shareService.webShare('Link', this.url);
    }

    copy() {
        this.shareService.copy(this.url);
        return false;
    }

    // Open external sites

    openEmail() {
        // TODO: replace body with the actual share text
        const url = `mailto:?body=${this.getEncodedTextAndUrl('email')}`;
        window.open(url, this.target);
    }

    openWhatsApp() {
        // TODO: accept share text etc
        const url = `https://wa.me/?text=${this.getEncodedTextAndUrl('whatsapp')}`;
        window.open(url, this.target);
    }

    openFacebook() {
        /*
        Alternative:
        `http://www.facebook.com/dialog/share?app_id=87741124305&href=${this.encodedUrl}
        &display=popup&redirect_uri=https://www.youtube.com/facebook_redirect`
        */
        const url = `https://facebook.com/sharer.php?u=${this.getEncodedUrl('facebook')}`;
        window.open(url, this.target);
    }

    openFacebookMessenger() {
        // TODO: concat to url: &app_id=123456789
        const url = `fb-messenger://share/?link=${this.getEncodedUrl('facebook-messenger')}`;
        window.open(url, this.target);
    }

    openTwitter() {
        // TODO: concat to url: &via=YouTube&related=YouTube,YouTubeTrends,YTCreators
        const url = `https://twitter.com/intent/tweet?url=${this.getEncodedUrl('twitter')}&text=${this.getEncodedText()}`;
        window.open(url, this.target);
    }

    openBlogger() {
        /*
        TODO: concat to url:
        &source=youtube&b=%3Ciframe%20width%3D%22480%22%20height%3D%22270%22%20src%3D%22https%3A//www.youtube.com
        /embed/QCoQs9NO9q0%22%20frameborder%3D%220%22%20allow%3D%22accelerometer%3B%20autoplay%3B%20encrypted-
        media%3B%20gyroscope%3B%20picture-in-picture%22%20allowfullscreen%3E%3C/iframe%3E&eurl=https%3A//i.ytimg.com
        /vi/QCoQs9NO9q0/maxresdefault.jpg
        */
        const url = `http://www.blogger.com/blog-this.g?n=${this.getEncodedTextAndUrl('blogger')}`;
        window.open(url, this.target);
    }

    openReddit() {
        const url = `http://reddit.com/submit?url=${this.getEncodedUrl('reddit')}&title=${this.getEncodedText()}`;
        window.open(url, this.target);
    }

    openWeChat() {
        // weixin://dl/stickers
        // weixin://dl/settings
        // weixin://dl/posts
        // weixin://dl/moments

        // TODO: I don't think this works anymore
        const weChatUserId = 0;
        const url = `weixin://dl/chat?${weChatUserId}`;
        window.open(url, this.target);
    }

    openPinterest() {
        // TODO: concat to url: &is_video=true&media=https%3A//i.ytimg.com/vi/QCoQs9NO9q0/maxresdefault.jpg
        const url = `http://pinterest.com/pin/create/button/?url=${this.getEncodedUrl('pinterest')}&description=${this.getEncodedText()}`;
        window.open(url, this.target);
    }

    openLinkedIn() {
        // TODO: concat to url: &summary=test&source=test2
        const url = `http://www.linkedin.com/shareArticle?url=${this.getEncodedUrl('linkedin')}&title=${this.getEncodedText()}`;
        window.open(url, this.target);
    }

    openTumblr() {
        const url = `http://www.tumblr.com/share/video?embed=${this.getEncodedUrl('tumblr')}&caption=${this.getEncodedText()}`;
        window.open(url, this.target);
    }
    openMix() {
        const url = `https://mix.com/add?url=${this.getEncodedUrl('mix')}`;
        window.open(url, this.target);
    }

    openVkontakte() {
        const url = `http://vkontakte.ru/share.php?url=${this.getEncodedUrl('vkontakte')}`;
        window.open(url, this.target);
    }

    openOk() {
        const url = `https://connect.ok.ru/offer?url=${this.getEncodedUrl('ok')}&title=${this.getEncodedText()}`;
        window.open(url, this.target);
    }
}
