---
title: SwiftUIでPiPを使う話
date: 2025-07-26
description: 情報が錯綜しすぎていてつらい
tags: [SwiftUI, Swift, Xcode]
authors: ['tkgstrator']
---

## 背景

PiPとはPicture in Pictureの略で、動画をスマホの画面にオーバーレイして表示するアレのことです。

YouTubeとかでよくありますよね。

あれをSwiftUIで実装しようとすると、ググった結果がよくわからないのでまとめてみました。

### コード

やるべきポイントは三つです。そのどれが欠けてもPiPは動作しません。

#### AppDelegate

```swift
import AVFAudio

class AppDelegate: NSObject, UIApplicationDelegate {
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
        try? AVAudioSession.sharedInstance().setCategory(.playback, mode: .moviePlayback)
        return true
    }
}

@main
struct mainApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var delegate

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

`AppDelegate`でこの設定を入れます。

#### VideoPlayerView

動画のURLが取得済みで、それを再生したい場合には以下のようなコードが利用できます。

URLはローカルでもリモートでも大丈夫です。

```swift
import AVKit
import SwiftUI
import Foundation

struct VideoPlayerView: UIViewControllerRepresentable {
    let streamURL: URL

    func makeUIViewController(context: Context) -> AVPlayerViewController {
        let controller: AVPlayerViewController = .init()
        let player: AVPlayer = .init(url: streamURL)
        controller.player = player
        controller.canStartPictureInPictureAutomaticallyFromInline = true
        controller.player?.play()
        return controller
    }

    func updateUIViewController(_ uiViewController: AVPlayerViewController, context: Context) {
    }
}
```

#### Capabilities

**Targets > App > Signing & Capabilities > Background Modes > Audio, AirPlay and Picture in Piture**

にチェックを入れます。

[Implementing Picture-in-Picture in Swift for iOS](https://swiftlogic.io/posts/pip-in-ios/)の最初の方をそのまま実践するだけです。

## まとめ

あとは`VideoPlayerView`を適当なタイミングで呼び出します。

引数に`streamURL`を持っているので、

```swift
struct TestView: View {
  @State private var streamURL: URL?

  var body: some View {
    EmptyView()
      .sheet(item: streamURL, content: { streamURL in
        VideoPlayerView(streamURL: streamURL)
          .ignoresSafeArea(.all)
      })
  }
}
```

みたいな感じで実装すればよいです。

記事は以上。
