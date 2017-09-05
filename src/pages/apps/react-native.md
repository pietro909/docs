## Integrate Branch

- #### Configure Branch

    - Complete your [Branch Dashboard](https://dashboard.branch.io/settings/link)

        ![image](http://i.imgur.com/wazVu3U.png)
        ![image](http://i.imgur.com/9PEylbS.png)

- #### Install Branch

    - Install the NPM module

        ```bash
        yarn add react-native-branch
        ```

        or

        ```bash
        npm install --save react-native-branch
        ```

    - In a pure React Native app using `react-native link`

        ```bash
        react-native link react-native-branch
        ```

    - In a native iOS app using the `React` pod

        This configuration is for native apps that include a React Native component as
        described in the [React Native docs](https://facebook.github.io/react-native/docs/integration-with-existing-apps.html#configuring-cocoapods-dependencies).

        Add these lines to your `Podfile`:
        ```ruby
        pod 'react-native-branch', path: '../node_modules/react-native-branch'
        pod 'Branch-SDK', path: '../node_modules/react-native-branch/ios'
        ```

        Then run `pod install` to regenerate the `Pods` project with the new dependencies.
        Note that the location of `node_modules` relative to your `Podfile` may vary.

- #### Configure app

	- iOS

		- Configure bundle identifier

		    - Bundle Id matches [Branch Dashboard](https://dashboard.branch.io/settings/link)

		        ![image](http://i.imgur.com/BHAQIQf.png)

		- Configure associated domains

		    - Add [Branch Dashboard](https://dashboard.branch.io/settings/link) values

		        ![image](http://i.imgur.com/67t6hSY.png)

		- Configure entitlements

		    - Confirm entitlements are within target

		        ![image](http://i.imgur.com/vhwis7f.png)

		- Configure info.pList

		    - Add [Branch Dashboard](https://dashboard.branch.io/account-settings/app) values

		        ![image](http://i.imgur.com/PwXnHWz.png)

		- Confirm app prefix

		    - From your [Apple Developer Account](https://developer.apple.com/account/ios/identifier/bundle)

		        ![image](http://i.imgur.com/2EoN1i0.png)

	- Android

		- `AndroidManifest.xml`

	        ```xml hl_lines="9 17 26 27 28 29 30 31 32 34 35 36 37 38 39 40 43 44 45 46 48 49 50 51 52 53"
	        <?xml version="1.0" encoding="utf-8"?>
	        <manifest xmlns:android="http://schemas.android.com/apk/res/android"
	            package="com.eneff.branchandroid">

	            <uses-permission android:name="android.permission.INTERNET" />

	            <application
	                android:allowBackup="true"
	                android:name="com.eneff.branchandroid.CustomApplicationClass"
	                android:icon="@mipmap/ic_launcher"
	                android:label="@string/app_name"
	                android:supportsRtl="true"
	                android:theme="@style/AppTheme">

	                <activity
	                    android:name=".MainActivity"
	                    android:launchMode="singleTask"
	                    android:label="@string/app_name"
	                    android:theme="@style/AppTheme.NoActionBar">

	                    <intent-filter>
	                        <action android:name="android.intent.action.MAIN" />
	                        <category android:name="android.intent.category.LAUNCHER" />
	                    </intent-filter>

	                    <!-- Branch URI Scheme -->
	                    <intent-filter>
	                        <data android:scheme="branchandroid" />
	                        <action android:name="android.intent.action.VIEW" />
	                        <category android:name="android.intent.category.DEFAULT" />
	                        <category android:name="android.intent.category.BROWSABLE" />
	                    </intent-filter>

	                    <!-- Branch App Links (optional) -->
	                    <intent-filter android:autoVerify="true">
	                        <action android:name="android.intent.action.VIEW" />
	                        <category android:name="android.intent.category.DEFAULT" />
	                        <category android:name="android.intent.category.BROWSABLE" />
	                        <data android:scheme="https" android:host="uobg.app.link" />
	                    </intent-filter>
	                </activity>

	                <!-- Branch init -->
	                <meta-data android:name="io.branch.sdk.BranchKey" android:value="key_live_gdzsepIaUf7wG3dEWb3aBkmcutm0PwJa" />
	                <meta-data android:name="io.branch.sdk.BranchKey.test" android:value="key_test_edwDakKcMeWzJ3hC3aZs9kniyuaWGCTa" />
	                <meta-data android:name="io.branch.sdk.TestMode" android:value="false" />

	                <!-- Branch install referrer tracking (optional) -->
	                <receiver android:name="io.branch.referral.InstallListener" android:exported="true">
	                    <intent-filter>
	                        <action android:name="com.android.vending.INSTALL_REFERRER" />
	                    </intent-filter>
	                </receiver>

	            </application>

	        </manifest>
	        ```

	    - Replace the following with values from your [Branch Dashboard](https://dashboard.branch.io/account-settings/app)
	        - `branchandroid`
	        - `uobg.app.link`
	        - `key_live_gdzsepIaUf7wG3dEWb3aBkmcutm0PwJa`
	        - `key_test_edwDakKcMeWzJ3hC3aZs9kniyuaWGCTa`

- #### Initialize Branch

	- Swift 3.0 `AppDelegate.swift`

    Add `#import <react-native-branch/RNBranch.h>` to your Bridging header if you have one.

    If you are using the `React` pod in a native app with `use_frameworks!`, you may simply use
    a Swift import in the AppDelegate.swift: `import react_native_branch`.

      ```swift hl_lines="3 4 5 10 11 12 13 14 15 16 17"
      // Initialize the Branch Session at the top of existing application:didFinishLaunchingWithOptions:
      func application(_ application: UIApplication, didFinishLaunchingWithOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
          // Uncomment this line to use the test key instead of the live one.
          // RNBranch.useTestInstance()
          RNBranch.initSession(launchOptions: launchOptions, isReferrable: true) // <-- add this

          //...
      }

      // Add the openURL and continueUserActivity functions
      func application(_ app: UIApplication, open url: URL, options: [UIApplicationOpenURLOptionsKey : Any] = [:]) -> Bool {
          return RNBranch.branch.application(app, open: url, options: options)
      }

      func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([Any]?) -> Void) -> Bool {
          return RNBranch.continue(userActivity)
      }
      ```

	- Objective C `AppDelegate.m`

		```objc hl_lines="1 6 7 8 14 15 16 17 18 19 20 21 22 23"
		#import <react-native-branch/RNBranch.h> // at the top

		// Initialize the Branch Session at the top of existing application:didFinishLaunchingWithOptions:
		- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
		{
		    // Uncomment this line to use the test key instead of the live one.
		    // [RNBranch useTestInstance]
		    [RNBranch initSessionWithLaunchOptions:launchOptions isReferrable:YES]; // <-- add this

		    NSURL *jsCodeLocation;
		    //...
		}

		- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
		    if (![RNBranch.branch application:application openURL:url sourceApplication:sourceApplication annotation:annotation]) {
		        // do other deep link routing for the Facebook SDK, Pinterest SDK, etc
		    }
		    return YES;
		}

		- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray *restorableObjects))restorationHandler {
		    return [RNBranch continueUserActivity:userActivity];
		}
		```

	- Android

		- `MainApplication.java`

			```java hl_lines="3 4 5 14 22"
			// ...

			// import Branch and RNBranch
			import io.branch.rnbranch.RNBranchPackage;
			import io.branch.referral.Branch;

			//...

			// add RNBranchPackage to react-native package list
			@Override
			  protected List<ReactPackage> getPackages() {
			    return Arrays.<ReactPackage>asList(
			            new MainReactPackage(),
			            new RNBranchPackage(), // <-- add this

			// ...

			// add onCreate() override
			@Override
			public void onCreate() {
			  super.onCreate();
			  Branch.getAutoInstance(this);
			}
			```

    		- MainActivity.java

			```java hl_lines="1 2 15 18 19 20 21"
			import io.branch.rnbranch.*; // <-- add this
			import android.content.Intent; // <-- and this

			public class MainActivity extends ReactActivity {

				  @Override
				  protected String getMainComponentName() {
				      return "base";
				  }

				  // Override onStart, onNewIntent:
				  @Override
				  protected void onStart() {
				      super.onStart();
				      RNBranchModule.initSession(getIntent().getData(), this);
				  }

				  @Override
				  public void onNewIntent(Intent intent) {
				      setIntent(intent);
				  }
				  // ...
			}
			```

- #### Receive deep link data

    All of your deep link parameters and Branch-added parameters will be returned to you when initialization completes. You can find a summary of [Branch-added values in the table here](/pages/links/integrate/#callback-values). If no referring link data was present, you'll see `+clicked_branch_link` equal to `false`.

- #### Test deep link iOS

    - Create a deep link from the [Branch Marketing Dashboard](https://dashboard.branch.io/marketing)

    - Delete your app from the device

    - Compile your app with Xcode

    - Paste deep link in `Apple Notes`

    - Long press on the deep link *(not 3D Touch)*

    - Click `Open in "APP_NAME"` to open your app *([example](http://i.imgur.com/VJVICXd.png))*

- #### Test deep link Android

    - Create a deep link from the [Branch Marketing Dashboard](https://dashboard.branch.io/marketing)

    - Delete your app from the device

    - Compile your app with Android Studio

    - Paste deep link in `Google Hangouts`

    - Click on the deep link to open your app


## Implement features

- #### Import Branch

	- In any React Native source file that uses the Branch SDK. You can import
    only the symbols you are using.

		```js
		import branch, {
		  AddToCartEvent,
		  AddToWishlistEvent,
		  PurchasedEvent,
		  PurchaseInitiatedEvent,
		  RegisterViewEvent,
		  ShareCompletedEvent,
		  ShareInitiatedEvent
		} from 'react-native-branch'
		```

- #### Create content reference

	- The `Branch Universal Object` encapsulates the thing you want to share (content or user)

    - Uses the [Universal Object Properties](/pages/links/integrate/#universal-object)

    ```js
    // only canonicalIdentifier is required
    let branchUniversalObject = await branch.createBranchUniversalObject('canonicalIdentifier', {
	    automaticallyListOnSpotlight: true,
	    metadata: {prop1: 'test', prop2: 'abc'},
	    title: 'Cool Content!',
	    contentDescription: 'Cool Content Description'})
    ```

- #### Create deep link

	- Creates a deep link URL with encapsulated data

    - Needs a [Branch Universal Object](#create-content-reference)

    - Uses [Deep Link Properties](/pages/links/integrate/)

    - Validate with the [Branch Dashboard](https://dashboard.branch.io/liveview/links)

	```js
	let linkProperties = {
	    feature: 'share',
	    channel: 'facebook'
	}

	let controlParams = {
	     $desktop_url: 'http://desktop-url.com/monster/12345'
	}

	let {url} = await branchUniversalObject.generateShortUrl(linkProperties, controlParams)
	```

- #### Share deep link

	-  Will generate a Branch deep link and tag it with the channel the user selects

    - Needs a [Branch Universal Object](#create-content-reference)

    - Uses [Deep Link Properties](/pages/links/integrate/)

	```js
	let shareOptions = { messageHeader: 'Check this out', messageBody: 'No really, check this out!' }
	let linkProperties = { feature: 'share', channel: 'RNApp' }
	let controlParams = { $desktop_url: 'http://example.com/home', $ios_url: 'http://example.com/ios' }
	let {channel, completed, error} = await branchUniversalObject.showShareSheet(shareOptions, linkProperties, controlParams)
	```

- #### Read deep link

	- Retrieve Branch data from a deep link

    - Best practice to receive data from the `listener` (to prevent a race condition)

    - Returns [deep link properties](/pages/links/integrate/#read-deep-links)

    - Listener

    ```js
    branch.subscribe(({ error, params }) => {
      if (error) {
        console.error('Error from Branch: ' + error)
        return
      }

      // params will never be null if error is null
    })

    let lastParams = await branch.getLatestReferringParams() // params from last open
    let installParams = await branch.getFirstReferringParams() // params from original install
    ```

- #### Navigate to content

    ```js
    branch.subscribe(({ error, params }) => {
      if (error) {
        console.error('Error from Branch: ' + error)
        return
      }

      // params will never be null if error is null

      if (params['+non_branch_link']) {
        const nonBranchUrl = params['+non_branch_link']
        // Route non-Branch URL if appropriate.
        return
      }

      if (!params['+clicked_branch_link']) {
        // Indicates initialization success and some other conditions.
        // No link was opened.
        return
      }

      // A Branch link was opened.
      // Route link based on data in params, e.g.

      // Get title and url for route
      const title = params.$og_title
      const url = params.$canonical_url
      const image = params.$og_image_url

      // Now push the view for this URL
      this.navigator.push({ title: title, url: url, image: image })
    })
    ```

- #### Display content

    - List content on iOS Spotlight

    - Needs a [Branch Universal Object](#create-content-reference)

    - Listing on Spotlight requires adding `CoreSpotlight.framework` to your Xcode project.

    - Recommended

    ```js
    let branchUniversalObject = await branch.createBranchUniversalObject('canonicalIdentifier', {
      automaticallyListOnSpotlight: true,
      // other properties
    })

    branchUniversalObject.userCompletedAction(RegisterViewEvent)
    ```

    - Alternate method

    ```js
    branchUniversalObject.listOnSpotlight()
    ```

- #### Track content

    - Track how many times a piece of content is viewed

    - Needs a [Branch Universal Object](#create-content-reference)

    - Uses [Track content properties](#track-content-properties)

    - Validate with the [Branch Dashboard](https://dashboard.branch.io/liveview/content)

    ```js
    import branch, { RegisterViewEvent } from 'react-native-branch'
    branchUniversalObject.userCompletedAction(RegisterViewEvent)
    ```

- #### Track users

    - Sets the identity of a user (email, ID, UUID, etc) for events, deep links, and referrals

    - Validate with the [Branch Dashboard](https://dashboard.branch.io/liveview/identities)

	```js
	branch.setIdentity('theUserId')
	branch.logout()
	```

- #### Track events

	- Track custom events

    - Events named `open`, `close`, `install`, and `referred session` are Branch restricted

    - `63` max event name length

    - Best to [Track users](#track-users) before [Track events](#track-events) to associate a custom event to a user

    - Validate with the [Branch Dashboard](https://dashboard.branch.io/liveview/events)

	```js
	branchUniversalObject.userCompletedAction('Custom Action', { key: 'value' })
	```

- #### Track commerce

    - Use the `branch.sendCommerceEvent` method to record commerce events

    ```js
    branch.sendCommerceEvent("20.00")
    branch.sendCommerceEvent(50, {key1: "value1", key2: "value2"})
    ```

- #### Handle referrals

    - Referral points are obtained from referral rules on the [Branch Dashboard](https://dashboard.branch.io/referrals/rules)

    - Validate on the [Branch Dashboard](https://dashboard.branch.io/referrals/analytics)

    - Reward credits

        -  [Referral guide](/pages/analytics/referrals/)

    - Redeem rewards

		```js
		let redeemResult = await branch.redeemRewards(amount, bucket)
		```

    - Load rewards

		```js
		let rewards = await branch.loadRewards()
		```

    - Load history

		```js
		let creditHistory = await branch.getCreditHistory()
		```

## Troubleshoot issues

- #### Track content properties

	| Event | Description |
	| ----- | --- |
	| RegisterViewEvent | User viewed the object |
	| AddToWishlistEvent | User added the object to their wishlist |
	| AddToCartEvent | User added object to cart |
	| PurchaseInitiatedEvent | User started to check out |
	| PurchasedEvent | User purchased the item |
	| ShareInitiatedEvent | User started to share the object |
	| ShareCompletedEvent | User completed a share |

- #### Sample app

	[Examples](https://github.com/BranchMetrics/react-native-branch-deep-linking/tree/master/examples)
