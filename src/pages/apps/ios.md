## iOS - Integrate Branch

### Configure Branch Dashboard

- Complete your [Branch Dashboard](https://dashboard.branch.io/settings/link)

    ![image](http://i.imgur.com/aFb69BS.png)
    ![image](http://i.imgur.com/Edpfn04.png)

### Configure Bundle Identifier

- Bundle Id matches [Branch Dashboard](https://dashboard.branch.io/settings/link)

    ![image](http://i.imgur.com/BHAQIQf.png)

### Configure Associated Domains

- Add [Branch Dashboard](https://dashboard.branch.io/settings/link) values

    ![image](http://i.imgur.com/67t6hSY.png)

### Configure Entitlements

- Confirm entitlements are within target

    ![image](http://i.imgur.com/vhwis7f.png)

### Configure Info.pList

- Add [Branch Dashboard](https://dashboard.branch.io/settings/link) values

    ![image](http://i.imgur.com/PwXnHWz.png)

### Confirm App Prefix

- From your [Apple Developer Account](https://developer.apple.com/account/ios/identifier/bundle)

    ![image](http://i.imgur.com/2EoN1i0.png)

### Install Branch

- Option 1: [CocoaPods](https://cocoapods.org/)

    ```sh hl_lines="7"
    platform :ios, '8.0'

    target 'APP_NAME' do
      # if swift
      use_frameworks!

      pod 'Branch'
    end
    ```

- Option 2: [Carthage](https://github.com/Carthage/Carthage)

    ```sh
    github "BranchMetrics/ios-branch-deep-linking"
    ```

- Option 3: Manually install [source code](https://github.com/BranchMetrics/ios-branch-deep-linking/releases)

    ![image](http://i.imgur.com/0NcOrkE.png)

### Initialize Branch

- Swift 3.0

    ```swift hl_lines="2 10 11 12 13 14 19 20 25 26 31 32"
    import UIKit
    import Branch

    @UIApplicationMain
    class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
      Branch.getInstance().setDebug() // for debug and development only
      Branch.getInstance().initSession(launchOptions: launchOptions) { (params, error) in
        // listener for Branch Deep Link data
        print(params as! [String: Any])
      }
      return true
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplicationOpenURLOptionsKey : Any] = [:]) -> Bool {
      // handler for URI Schemes (depreciated in iOS 9.2+, but still used by some Google apps)
      Branch.getInstance().application(app, open: url, options: options)
      return true
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([Any]?) -> Void) -> Bool {
      // handler for Universal Links
      Branch.getInstance().continue(userActivity)
      return true
    }

    func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable : Any], fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
      // handler for Push Notifications
      Branch.getInstance().handlePushNotification(userInfo)
    }
    ```

- Objective-C

    ```objc hl_lines="2 11 12 13 14 15 21 22 27 28 33 34"
    #import "AppDelegate.h"
    #import "Branch/Branch.h"

    @interface AppDelegate ()

    @end

    @implementation AppDelegate

    - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
      [[Branch getInstance] setDebug]; // for debug and development only
      [[Branch getInstance] initSessionWithLaunchOptions:launchOptions andRegisterDeepLinkHandler:^(NSDictionary * _Nonnull params, NSError * _Nullable error) {
      // listener for Branch Deep Link data
      NSLog(@"%@", params);
    }];

      return YES;
    }

    - (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
      // handler for URI Schemes (depreciated in iOS 9.2+, but still used by some Google apps)
      [[Branch getInstance] application:app openURL:url options:options];
      return YES;
    }

    - (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray * _Nullable))restorationHandler {
      // handler for Universal Links
      [[Branch getInstance] continueUserActivity:userActivity];
      return YES;
    }

    - (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
      // handler for Push Notifications
      [[Branch getInstance] handlePushNotification:userInfo];
    }

    @end
    ```

### Test Deep Link

  - Wait 15 minutes after saving changes on the [Branch Dashboard](https://dashboard.branch.io/settings/link).
  - Create a deep link from the [Branch Dashboard](https://dashboard.branch.io/quick-links).
  - Delete and reinstall the app.
  - Compile and test on a device.
  - Paste deep link in Apple Notes.
  - Long press on the deep link (not 3D Touch).
  - Click `Open in "APP_NAME"` to open app.
  - ![image](http://i.imgur.com/VJVICXd.png)

## iOS - Features

### Create Content

- The `Branch Universal Object` encapsulates the thing you want to share (content or user)

  - Swift 3.0

    ```swift
    // only canonical identifier is required
    let buo = BranchUniversalObject(canonicalIdentifier: "item/12345")
    buo.title = UUID.init().uuidString
    buo.contentDescription = "My Content Description"
    buo.imageUrl = "http://lorempixel.com/200/200/"
    buo.canonicalUrl = "http://s3z3.app.link/rawr_rawr"
    buo.contentIndexMode = .public
    buo.addMetadataKey("property1", value: "blue")
    ```

  - Objective-C

    ```objc
    // only canonical identifier is required
    BranchUniversalObject *buo = [[BranchUniversalObject alloc] initWithCanonicalIdentifier:@"item/12345"];
    buo.title = @"My Content Title";
    buo.contentDescription = @"My Content Description";
    buo.imageUrl = @"https://example.com/mycontent-12345.png";
    [buo addMetadataKey:@"property1" value:@"blue"];
    [buo addMetadataKey:@"property2" value:@"red"];
    ```

### Create Deep Link

- Generate a deep link within your app

  - Swift 3.0

    ```swift
    let lp: BranchLinkProperties = BranchLinkProperties()
    lp.feature = "sharing"
    lp.channel = "facebook"
    lp.campaign = "meow meow"
    lp.addControlParam("$desktop_url", withValue: "http://example.com/home")
    lp.addControlParam("random", withValue: UUID.init().uuidString)

    buo.getShortUrl(with: lp) { url, error in
      guard let url = url else { return }
      print(url)
    }
    ```

  - Objective-C

    ```objc
    // optional values
    BranchLinkProperties *lp = [[BranchLinkProperties alloc] init];
    lp.feature = @"sharing";
    lp.channel = @"facebook";
    [lp addControlParam:@"$desktop_url" withValue:@"http://example.com/home"];
    [lp addControlParam:@"$ios_url" withValue:@"http://example.com/ios"];

    // generate link
    [branchUniversalObject getShortUrlWithLinkProperties:lp andCallback:^(NSString* url, NSError* error) {
        if (!error) {
    NSLog(@"success getting url! %@", url);
        }
    }];
    ```

### Share Deep Link

- Share deep links between users and apps

  - Swift 3.0

    ```swift
    // optional values
    let lp: BranchLinkProperties = BranchLinkProperties()
    lp.feature = "sharing"
    lp.channel = "facebook"
    lp.campaign = "meow meow"
    lp.addControlParam("$desktop_url", withValue: "http://example.com/home")
    lp.addControlParam("random", withValue: UUID.init().uuidString)

    // share link
    buo.showShareSheet(with: lp, andShareText: text , from: controller) { (activity, success) in
      print(activity ?? "none", success)
    }
    ```

  - Objective-C

    ```objc
    // optional values
    BranchLinkProperties *lp = [[BranchLinkProperties alloc] init];
    lp.feature = @"sharing";
    lp.channel = @"facebook";
    [lp addControlParam:@"$desktop_url" withValue:@"http://example.com/home"];
    [lp addControlParam:@"$ios_url" withValue:@"http://example.com/ios"];

    // share link
    [branchUniversalObject showShareSheetWithLinkProperties:lp andShareText:@"Super amazing thing I want to share!" fromViewController:self completion:^(NSString* activityType, BOOL completed) {
        NSLog(@"finished presenting");
    }];
    ```

### Navigate to Content

- Navigate to any ViewController based on the deep link data from

  - Swift 3.0

    ```swift
    // within AppDelegate application.didFinishLaunchingWithOptions
    Branch.getInstance().initSession(launchOptions: launchOptions) { params , error in
      // catch deep link data
      guard let data = params as? [String: AnyObject] else { return }

      // save deep link data into global model to be referenced by any view controller
      BranchData.sharedInstance.data = data

      // navigate to view controller based on deep link data["type"] ("type" can be any custom key-value pair)
      guard let nav = data["type"] as? String else { return }
      switch nav {
          case "landing_page": self.window?.rootViewController?.present( SecondViewController(), animated: true, completion: nil)
          case "tutorial": self.window?.rootViewController?.present( SecondViewController(), animated: true, completion: nil)
          case "content": self.window?.rootViewController?.present( SecondViewController(), animated: true, completion: nil)
          default: break
      }
    }
    ```

  - Objective-C

    ```objc

    ```
### Build Referral Programs

- Use Branch deep linking to see who shares the most content and drives the most new users. This allows you track influencers, as well as provide credits to users as an incentive.

#### Award Credits Per Referral

- Navigate to the [Referrals](https://dashboard.branch.io/referrals/rules) page, and click `Add New Rule`. This will let Branch automatically award users based off properties set on this screen.

Definable properties:

1. Who gets a reward
1. Credit amount
1. Which `bucket` the credits go to
1. Whether the reward occurs the first time or every time
1. Which event triggers the reward

Let's say you want to give 10 credits to each new user who signs up through a friend, and 5 credits to the friend who referred him or her. That can be done through a combination of two rules:

**Rule 1: rewarding the referred user 10 credits**

1. Who gets a reward: **"Referred acting users"**
1. How many credits the reward is: **10**
1. Which bucket the credits go to: **default**
1. Whether the reward occurs the first time or every time: **the first time**
1. Which event triggers the reward: **install**

![image](/img/features/referral-programs/referred_rule.png)

**Rule 2: rewarding the referring user 5 credits**

1. Who gets a reward: **"Referring users"**
1. How many credits the reward is: **5**
1. Which bucket the credits go to: **default**
1. Whether the reward occurs the first time or every time: **the first time**
1. Which event triggers the reward: **install**

![image](/img/features/referral-programs/referring_rule.png)

#### View Credits

- Use the following SDK methods to track a user's credit balance after you've set up reward rules.


```obj-c
[Branch getInstance] loadRewardsWithCallback:^(BOOL changed, NSError* err) {
    if (!err) {
        NSLog(@"credit: %lu", [[Branch getInstance] getCredits]);
    }
}];
```

#### Redeem Credits

- Once a user reaches a point to redeem credits, use the following calls to detract from their existing balance.

```obj-c
[[Branch getInstance] redeemRewards:5 callback:^(BOOL success, NSError* error) {
    if (success) {
        NSLog(@"Redeemed 5 credits!");
    }
    else {
        NSLog(@"Failed to redeem credits: %@", error);
    }
}];
```

## iOS - Troubleshooting

#### Why does my app not open?
#### Why does my deep link data not pass through?
#### Why are my deep links long?
#### How do I create offline deep links?