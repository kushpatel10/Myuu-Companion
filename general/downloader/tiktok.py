import base64
import sys
import requests
from tiktok_downloader import snaptik

def fetch_tiktok_video(tiktok_url):
    try:
        if 'vm.tiktok.com' in tiktok_url:
            response = requests.get(tiktok_url, allow_redirects=True)
            tiktok_url = response.url 

        video = snaptik(tiktok_url)
        first_video = video[0]
        video_buffer = first_video.download() 

        video_bytes = video_buffer.getvalue()

        video_base64 = base64.b64encode(video_bytes).decode('utf-8')

        print(video_base64)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: TikTok URL not provided", file=sys.stderr)
        sys.exit(1)

    tiktok_url = sys.argv[1]
    fetch_tiktok_video(tiktok_url)