
## Integrate Branch

- #### Configure Branch

Branch links consist of an app-specific base domain (*testbed-xamarin.app.link*, for example) followed by an alphanumeric suffix. This suffix, referred to as the *alias*, can be either randomly generated (*FCIWxFeBGx*, for example) or manually-defined (*testlink*, for example). The app-specific base domain used to create the links is termed the *Branch link domain*.

A Branch-integrated app called TestBed-Xamarin and assigned the dafult Branch link domain *testbed-xamarin.app.link* has the following Branch links:

- https://testbed-xamarin.app.link/FCIWxFeBGx
- https://testbed-xamarin.app.link/testlink

Note that when using the 'app.link' default link domain there is a second, alternate, form of the link domain that comes into play when displaying Branch Deepviews - the *alternate link domain*. This *alternate link domain* sees the domain's '.app.link' string replaced by '-alternate.app.link'. If you are using a default app.link link domain, both the regular and alternate domains will be needed when configuring a project to support deep linking.

##### Branch keys

Branch keys consist of a prefix (**key_live_** or **key_test_**) followed by a string of 32 aphanumeric characters (*key_live_kdzhBMBYt5Pi4g4DVRfQbdkbqDlm5rIv*, for example). Branch keys are used to associate apps with Branch links. An app's Branch key is required to initialize the Branch SDK. Data associated with Branch links can only be read by apps that  use the same Branch key.

Note that the **Live** and **Test** apps on the Branch dashboard are completely separate; each has its own Branch key. Even when **Live** and **Test** sections of the dashboard have been configured identically and links from both are able to open up a particular app, the app will only receive link data for which it has the matching Branch key.

##### Creating a Branch link domain and Branch key for an app

Register the app on the Branch dashboard, here: [https://dashboard.branch.io](https://dashboard.branch.io)

The Branch key can be found on the [General Settings](https://dashboard.branch.io/account-settings/app) page. The app's Branch link domain  will be listed at the very bottom of the [Link Settings](https://dashboard.branch.io/link) page.

- #### Configure app

##### **Adding the Branch SDK with NuGet**

The Branch Xamarin SDK is available as a NuGet package. The [Branch NuGet package](https://www.nuget.org/packages/Branch-Xamarin-Linking-SDK) must be added to each of the Xamarin projects that will use Branch methods.  

To add the Branch NuGet package to a project:  

1. Right-click on each project and select `Add` > `Add NuGet Packages`  
2. If not already present, find the _Microsoft BCL Build Components_ package version 1.0.21 and add it to the project  
3. Find the _Branch Xamarin SDK_ package version 3.0 and add it to the project  

##### **Adding the Branch SDK without NuGet**

If, instead of using NuGet, you would rather build and reference the Branch assemblies directly:

1. Clone this repository to the local machine: `https://github.com/BranchMetrics/xamarin-branch-deep-linking.git`
2. Add the `Branch-Xamarin-SDK` project to the solution and reference it from the Android, iOS and Forms (if applicable) projects
3. Add the `Branch-Xamarin-SDK.Droid` project to the solution and reference it from the Android project, if any
4. Add the `Branch-Xamarin-SDK.iOS` project and reference it from the iOS project, if any

- #### Initialize Branch

##### Integrating the Branch SDK

The steps for integrating the Branch SDK with a project differ depending on whether or not the project is creating a Xamarin Forms application and on which mobile platform the project is intended, iOS or Android. Instructions for each of the four scenarios are provided below.
___

###### Xamarin Native solutions  

####### **Integrating the Branch SDK with an iOS Native project**  

**I. Create an Apple device Provisioning Profile for the app**  

1. Open Xcode and create a new project with the same name as your Xamarin iOS project
2. On the Xcode project's **General** tab, verify the app's case-sensitive Bundle Identifier is correct and select the appropriate Team (be sure to resolve any errors here)
3. Select the **Capabilities** tab and enable the **Associated Domains** entitlement
4. Create 'applinks:' entries for the Branch link domain and the alternate link domain (the link domain can be found at the bottom of the Branch dashboard's [Link Settings](https://dashboard.branch.io/#/settings/link) page). For example, the entries for an app with the default link domain 'testiosapp.app.link' would be:  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`applinks:testiosapp.app.link`  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`applinks:testiosapp-alternate.app.link`  
5. Use Xcode to run this newly-created app on an iOS device. This will create and install a Provisioning Profile with the proper entitlements on that device.
6. Close Xcode

**II. Enter the app's settings on the Branch dashboard**  

1. On the [Link Settings](https://dashboard.branch.io/#/settings/link) page, check the **I have an iOS App** checkbox
2. Enter the app's URI Scheme in the **iOS URI Scheme** field (for an app with the URI Scheme *testbed-xamarin*, for example, the entry would be: `testbed-xamarin://`)
3. Enter the app's Apple Store name in the **Apple Store Search** field (if the app is not yet available on the App Store select **Custom URL** and enter as a placeholder the URL of an appropriate web site - the exact site does not matter)
4. Check the **Enable Universal Links** checkbox
5. Enter the app's case-sensitive Bundle Identifier and Apple App Prefix as shown on the [Apple Developer Portal](https://developer.apple.com/account/ios/identifier/bundle)

**III. Configure the Xamarin project's Info.plist file**  

1. Open the **Info.plist** file
2. Enter the app's **Bundle Identifier** from the [Apple Developer Portal](https://developer.apple.com/account/ios/identifier/bundle) in the **Bundle Identifier** field. **IMPORTANT:** this field will automatically be populated with an all-lowercase value by Xamarin. The value is in fact case sensitive and must match the value in the [Apple Developer Portal](https://developer.apple.com/account/ios/identifier/bundle) precisely.  
3. Click on the **Advanced** tab   
4. In the **URL Types** section, click the **Add URL Type** button   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Identifier:** Branch Scheme  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**URL Schemes:** {the app's URI Scheme - 'testiosapp', for example}  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Role:** Editor  

![IOS Uri](/docs/images/branch_ios_uri.png)

**IV. Configure the Xamarin project's Associated Domains entitlement**  

1. Open the **Entitlements.plist** file and browse to **Associated Domains**
2. Create entries for both the app's link domain and its alternate link domain. The entries for the TestBed-Xamarin app would be:  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`applinks:testiosapp.app.link`  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`applinks:testiosapp-alternate.app.link`  

![Associated Domains](/docs/images/branch_ios_domains.png)

**V. Add Branch calls to the AppDelegate.cs file**

Branch initialization occurs within the `FinishedLaunching` method of the **AppDelegate.cs** file. Branch calls are also required in the `OpenUrl`, `ContinueUserActivity`, and `ReceiveRemoteNotification` methods to ensure that Branch link information is handled properly whenever the app becomes active.

Whenever the app becomes active, the Branch SDK will reach out to the Branch back end to retrieve any available link parameters. If the app became active due to a click on a Branch link, the link data will be returned in the `InitSessionComplete method`. This is where any deep link routing logic should reside. Any error in retrieving Branch link data from the back end will returned in the `SessionRequestError` method.

```csharp
using Foundation;
using UIKit;
using BranchXamarinSDK;
using BranchXamarinSDK.iOS;
using System;

namespace TestiOSApp.iOS
{
	[Register("AppDelegate")]
	public class AppDelegate : UIApplicationDelegate, IBranchBUOSessionInterface
	{
		public override UIWindow Window
		{
			get;
			set;
		}

		public override bool FinishedLaunching(UIApplication application, NSDictionary launchOptions)
		{
			// Debug mode - set to 'false' before releasing to production
			BranchIOS.Debug = true; 
			BranchIOS.Init("key_live_cgEguO4UiDJSL4HIyTu85dkkDAdz38ER", launchOptions, this);

			return true;
		}

		// Called when the app is opened via URI scheme
		public override bool OpenUrl(UIApplication application, NSUrl url, string sourceApplication, NSObject annotation)
		{
			return BranchIOS.getInstance().OpenUrl(url);
		}

		// Called when the app is opened from a Universal Link
		public override bool ContinueUserActivity(UIApplication application, NSUserActivity userActivity,
					  UIApplicationRestorationHandler completionHandler)
		{
			return BranchIOS.getInstance().ContinueUserActivity(userActivity);
		}

		// Called when the app receives a push notification
		public override void ReceivedRemoteNotification(UIApplication application, NSDictionary userInfo)
		{
			BranchIOS.getInstance().HandlePushNotification(userInfo);
		}
		
		// Called when the Branch initialization is completed
		// Put deep-linking logic in this method
		public void InitSessionComplete(BranchUniversalObject buo, BranchLinkProperties blp)
		{
			NSObject[] keys = {
				NSObject.FromObject("+is_first_session")
			};

			NSObject[] values = { NSObject.FromObject(0) };
			if (buo.metadata.ContainsKey("+is_first_session"))
			{
				values[0] = NSObject.FromObject(buo.metadata["+is_first_session"]);
			}

			NSDictionary nsData = NSDictionary.FromObjectsAndKeys(values, keys);
		}
		
		// Called when there is an error initializing Branch
		public void SessionRequestError(BranchError error)
		{
			Console.WriteLine("Branch error: " + error.ErrorCode);
			Console.WriteLine(error.ErrorMessage);
		}

	}
}
```

**VI. Update the project's Signing Identity and Provisioning Profile**  

1. Right-click on the iOS project and select **Options**
2. Select **iOS Bundle Signing** 
3. Set the **Signing Identity** and **Provisioning Profile values** to the values used when deploying the Provisioning Profile to the device above

___

####### **Integrating the Branch SDK with an Android Native project**

**I. Ensure that the Android project is not using the Shared Mono Runtime**

1. Right-click on the Android project and select: **Options**
2. Select: **Android Build**
3. On the **General** tab, un-check: **Use Shared Mono Runtime**

**II. Add app capabilities in the app's Manifest file**

In the *Required permissions* section of **AndroidManifest.xml**, configure the following permissions:

- *AccessNetworkState*
- *Internet*

Additional reading on the Android manifest

- [Working with android manifest.xml](https://developer.xamarin.com/guides/android/advanced_topics/working_with_androidmanifest.xml/)
- [Add permissions to android manifest](https://developer.xamarin.com/recipes/android/general/projects/add_permissions_to_android_manifest/)

**III. Add the app's Branch key to the Strings.xml file**

Add the Branch key to the Android project's **Resources/values/Strings.xml** file. This file contains values that can be accessed by the app's Application class.

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
	<string name="app_name">TestXamarinFormsApp</string>
	<string name="branch_key">key_live_liAnF8k7gZUEZv76Rt9a4bffAzlC5zVW</string>
</resources>
```

**IV. Create the project's *Application* class**

Create an Application.cs file

1. Right-click on the .Droid project and select **Add > New File...**
2. Select: **General > Empty File**
3. Name the file: **Application.cs**
4. Enter the following code (replace 'TestAndroidApp' with the actual name of the app):

```csharp
using System;
using Android.App;
using Android.Content;
using Android.Runtime;
using BranchXamarinSDK;

namespace TestAndroidApp.Droid
{
	[Application(AllowBackup = true, Icon = "@mipmap/icon", Label = "@string/app_name")]
	[MetaData("io.branch.sdk.auto_link_disable", Value = "false")]
	[MetaData("io.branch.sdk.TestMode", Value = "true")]
	[MetaData("io.branch.sdk.BranchKey", Value = "@string/branch_key")]

	public class TestAndroidApp : Application
	{
		public TestAndroidApp(IntPtr javaReference, JniHandleOwnership transfer) : base(javaReference, transfer)
		{
		}

		public override void OnCreate()
		{
			base.OnCreate();
			BranchAndroid.GetAutoInstance(this.ApplicationContext);
		}
	}
}
```

| Key | Value
| --- | ---
| io.branch.sdk.TestMode | Setting this parameter to *true* enables Debug Mode, which causes simple uninstall/reinstalls of the app to trigger *install* events. Be sure to disable this before deploying to production. Note that enabling Debug Mode on Android also forces the app to use the Branch *Test* key if this key has been added to the project. Apps running with a *Test* key will be unable to receive data from Branch links created with the *Live* key.
| io.branch.sdk.BranchKey | The app's Branch key. Both a *Live* key and a *Test* key can be added to the Strings.xml file. When *Test* Mode is enabled the app will automatically use the *Test* key, if one has been specified.

**V. Create an activity to handle Branch events: BranchActivity**

1. Right-click on the .Droid project and select **Add > New File...**
2. Select: **Android > Activity**
3. Rename the file: **BranchActivity.cs**
4. Enter the following code (replace 'TestAndroidApp' with the actual name of the app):

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;
using BranchXamarinSDK;

using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;

namespace TestAndroidApp.Droid
{
	[Activity(Label = "BranchActivity")]
	public class BranchActivity : Activity

	{
		private string logString = "";

		protected override void OnCreate(Bundle savedInstanceState)
		{
			base.OnCreate(savedInstanceState);

			LogMessage("Branch initialization completed: ");

			Dictionary<string, object> data = JsonConvert.DeserializeObject<Dictionary<string, object>>(Intent.GetStringExtra("BranchData"));
			foreach (var key in data.Keys)
			{
				LogMessage(key + " : " + data[key].ToString());
			}
		}

		#region Utils

		void LogMessage(string message)
		{
			Console.WriteLine(message);
			logString += DateTime.Now.ToLongTimeString() + "> " + message + "\n";
		}

		#endregion
	}
}
```

**VI. Create an activity to handle Branch errors: BranchErrorActivity**

1. Right-click on the .Droid project and select **Add > New File...**
2. Select: **Android > Activity**
3. Rename the file: **BranchErrorActivity.cs**
4. Enter the following code (replace 'TestAndroidApp' with the actual name of the app):

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;

namespace TestAndroidApp.Droid
{
	[Activity(Label = "BranchErrorActivity")]
	public class BranchErrorActivity : Activity
	{
		private string logString = "";

		protected override void OnCreate(Bundle savedInstanceState)
		{
			base.OnCreate(savedInstanceState);

			LogMessage("Branch initialization failed");
			LogMessage("Error code: " + Intent.Extras.GetInt("ErrorCode").ToString());
			LogMessage(Intent.Extras.GetString("ErrorMessage"));
		}

		#region Utils

		void LogMessage(string message)
		{
			Console.WriteLine(message);
			logString += DateTime.Now.ToLongTimeString() + "> " + message + "\n";
		}

		#endregion
	}
}
```

**VII. Initialize Branch and configure Branch session management**

Branch must be initilialized in the OnCreate method of either the Application class or the first Activity launched by the app. The OnNewIntent method must be added to retrieve the latest link identifier when the app becomes active due to a Branch link click.

Branch initializes asynchronously, with Branch link parameters being returned following a network call to Branch. If initialization is successful, the InitSessionComplete method will be invoked. If initialization is unsuccessful, the SessionRequestError method will be invoked. Deep link routing logic should be located in the InitSessionComplete method.

In the code example below the following Branch initialization and session management steps have been added to MainActivity.cs:

- An Activity to respond to the app's URI Scheme
- An Activity is launched in `singleTask` mode
- Override the OnCreate method and initialize the Branch SDK
- Override the OnNewIntent method
- Add an InitSessionComplete method for processing Branch link information (this is where deep link routing code should be located)
- Add a SessionRequestError method to handle situations where Branch fails to initialize

```csharp
using Android.App;
using Android.Widget;
using Android.OS;
using BranchXamarinSDK;
using System;
using System.Collections.Generic;
using Android.Content;
using Newtonsoft.Json;

namespace TestAndroidApp.Droid
{
	[Activity(Label = "TestAndroidApp", MainLauncher = true, Icon = "@mipmap/icon", LaunchMode = Android.Content.PM.LaunchMode.SingleTask)]

	[IntentFilter(new[] { "android.intent.action.VIEW" },
	Categories = new[] { "android.intent.category.DEFAULT", "android.intent.category.BROWSABLE" },
	DataScheme = "testandroidapp",
	DataHost = "open")]

	[IntentFilter(new[] { "android.intent.action.VIEW" },
	Categories = new[] { "android.intent.category.DEFAULT", "android.intent.category.BROWSABLE" },
	DataScheme = "https",
	DataHost = "testandroidapp.app.link")]

	public class MainActivity : Activity, IBranchSessionInterface
	{

		protected override void OnCreate(Bundle savedInstanceState)
		{
			base.OnCreate(savedInstanceState);

			BranchAndroid.Init(this, Resources.GetString(Resource.String.branch_key), this);
		}

		// Ensure we get the updated link identifier when the app becomes active
		// due to a Branch link click after having been in the background
		protected override void OnNewIntent(Intent intent)
		{
			this.Intent = intent;
		}

		public void InitSessionComplete(Dictionary<string, object> data)
		{
			var intent = new Intent(this, typeof(BranchActivity));
			intent.PutExtra("BranchData", JsonConvert.SerializeObject(data));

			StartActivity(intent);
		}

		public void SessionRequestError(BranchError error)
		{
			Console.WriteLine("Branch session initialization error: " + error.ErrorCode);
			Console.WriteLine(error.ErrorMessage);

			var intent = new Intent(this, typeof(BranchErrorActivity));
			intent.PutExtra("ErrorCode", error.ErrorCode);
			intent.PutExtra("ErrorMessage", error.ErrorMessage);

			StartActivity(intent);
		}
	}
}
```

___

###### Xamarin Forms solutions

####### **Configuring the C# project**

These steps are required for all Forms projects, both iOS and Android.

**I. Change the C# project's profile to PCL 4.5 - Profile78**

1. Right-click on the project name and select: **Options**  
2. Browse the menu to **Build > General**  
3. Change the **Current Profile** to: **PCL 4.5 - Profile78**  

**II. Add the Branch SDK with NuGet**

The Branch Xamarin SDK is available as a NuGet package. The [Branch NuGet package](https://www.nuget.org/packages/Branch-Xamarin-Linking-SDK) must be added to each of the Xamarin projects that will use Branch methods.  

1. Right-click on each project and select **Add > Add NuGet Packages**  
2. If not already present, find the _Microsoft BCL Build Components_ package version 1.0.21 and add it to the project  
3. Find the _Branch Xamarin SDK_ package version 3.0 and add it to the project  

**III. Create a class for Branch session handling**

Branch initializes asynchronously, with Branch link parameters being returned following a network call to Branch. If initialization is successful, the InitSessionComplete method will be invoked. If initialization is unsuccessful, the SessionRequestError method will be invoked. Deep link routing logic should be located in the InitSessionComplete method.

1. Right-click on the C# project and select **Add > New File...**  
2. Select: **General > Empty Class**  
3. Rename the file: **TestXamarinFormsApp.cs**  
4. Enter the following code (replacing 'TestXamarinFormsApp' with the actual name of the app):  

```csharp
using BranchXamarinSDK;
using System.Collections.Generic;
using System.ComponentModel;
using Xamarin.Forms;

namespace TestXamarinFormsApp
{
	public class TestXamarinFormsApp : Application, IBranchSessionInterface
	{

		public TestXamarinFormsApp()
		{
		}

		#region IBranchSessionInterface implementation

		public void InitSessionComplete(Dictionary<string, object> data)
		{
		}

		public void CloseSessionComplete()
		{
		}

		public void SessionRequestError(BranchError error)
		{
		}

		#endregion
	}
}
```

**IV. Create a class for handling link data**

Branch stores link data in an object referred to as the **Branch Universal Object**, or **BUO**.

1. Right-click on the C# project and select **Add > New File...**  
2. Select: **General > Empty Class**  
3. Rename the file: **TestXamarinFormsAppBUO.cs**  
4. Enter the following code (replace 'TestXamarinFormsApp' with the actual name of the app):

```csharp
using BranchXamarinSDK;
using System.Collections.Generic;
using System.ComponentModel;
using Xamarin.Forms;

namespace TestXamarinFormsApp
{
	public class TestXamarinFormsAppBUO : Application, IBranchBUOSessionInterface
	{

		public TestXamarinFormsAppBUO()
		{
		}

		#region IBranchBUOSessionInterface implementation

		public void InitSessionComplete(BranchUniversalObject buo, BranchLinkProperties blp)
		{
		}

		public void SessionRequestError(BranchError error)
		{
		}

		#endregion
	}
}
```


####### **Integrating with an iOS Forms app**

**I. Create an Apple device Provisioning Profile for the app**

1. Open Xcode and create a new project with the same name as your Xamarin iOS project  
2. On the Xcode project's **General** tab, enter the app's Bundle Identifier and select the appropriate Team (be sure to resolve any errors here)  
3. Select the **Capabilities** tab and enable the **Associated Domains** entitlement  
4. Create 'applinks:' entries for the Branch link domain assigned to the app (the link domain can be found at the bottom of the Branch dashboard's [Link Settings](https://dashboard.branch.io/#/settings/link) page). For example, the entries for the app *TestXamarinFormsApp* would be:  
&nbsp;&nbsp;&nbsp;&nbsp;`applinks:testxamarinformsapp.app.link`  
&nbsp;&nbsp;&nbsp;&nbsp;`applinks:testxamarinformsapp-alternate.app.link`  
5. Use Xcode to run this newly-created app on an iOS device. This will create and install a Provisioning Profile with the proper entitlements on that device.  
6. Close Xcode  

**II. Enter the app's settings on the Branch dashboard**

1. On the [Link Settings](https://dashboard.branch.io/#/settings/link) page, check the **I have an iOS App** checkbox  
2. Enter the app's URI Scheme in the **iOS URI Scheme** field (for an app with the URI Scheme *testxamarinformsapp*, for example, the entry would be: `testxamarinformsapp://`)  
3. Enter the app's Apple Store name in the **Apple Store Search** field (if the app is not yet available on the App Store select **Custom URL** and enter as a placeholder the URL of an appropriate web site - the exact site does not matter)  
4. Check the **Enable Universal Links** checkbox  
5. Enter the app's Bundle Identifier and Apple App Prefix as shown on the [Apple Developer Portal](https://developer.apple.com/account/ios/identifier/bundle)  

**III. Configure the Xamarin project's Info.plist file**

1. Open the **Info.plist** file
2. Enter the app's **Bundle Identifier** from the [Apple Developer Portal](https://developer.apple.com/account/ios/identifier/bundle) in the **Bundle Identifier** field. **IMPORTANT:** this field will automatically be populated with an all-lowercase value by Xamarin. The value is in fact case sensitive and must match the value in the [Apple Developer Portal](https://developer.apple.com/account/ios/identifier/bundle) precisely.  
3. Click on the **Advanced** tab   
4. In the **URL Types** section, click the **Add URL Type** button   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Identifier:** Branch Scheme  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**URL Schemes:** {the app's URI Scheme - 'testxamarinformsapp', for example}  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Role:** Editor  

![IOS Uri](/docs/images/branch_ios_forms_uri.png)

**IV. Configure the Xamarin project's Associated Domains entitlement**

1. Open the **Entitlements.plist** file and browse to **Associated Domains** (if this file does not already exist, create it)
2. Create entries for both the app's link domain and its alternate link domain. The entries for the TestBed-Xamarin app would be:  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`applinks:testxamarinformsapp.app.link`  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`applinks:testxamarinformsapp-alternate.app.link`  

![Associated Domains](/docs/images/branch_ios_forms_domains.png)

**V. Add Branch calls to the AppDelegate.cs file**

To ensure that the Branch SDK initializes when the app starts and can retrieve link parameters whenever the app becomes active, Branch initialization occurs within the `FinishedLaunching` method of the AppDelegate.cs file. Branch calls are also required in the OpenUrl, ContinueUserActivity, and ReceiveRemoteNotification methods to ensure that Branch link information is handled properly whenever the app becomes active. The **AppDelegate.cs** file should look like this:

```csharp
using System;
using System.Collections.Generic;
using System.Linq;

using Foundation;
using UIKit;
using BranchXamarinSDK;
using TestXamarinFormsApp;

namespace TestXamarinFormsApp.iOS
{
	[Register("AppDelegate")]
	public partial class AppDelegate : global::Xamarin.Forms.Platform.iOS.FormsApplicationDelegate
	{
		public override bool FinishedLaunching(UIApplication app, NSDictionary options)
		{
			global::Xamarin.Forms.Forms.Init();

			// Debug mode - set to 'false' before releasing to production
			BranchIOS.Debug = true;

			TestXamarinFormsAppBUO appBUO = new TestXamarinFormsAppBUO();
			BranchIOS.Init("key_live_liAnF8k7gZUEZv76Rt9a4bffAzlC5zVW", options, appBUO);
			LoadApplication(appBUO);

			return base.FinishedLaunching(app, options);
		}

		// Called when the app is opened via URI scheme
		public override bool OpenUrl(UIApplication application, NSUrl url, string sourceApplication, NSObject annotation)
		{
			return BranchIOS.getInstance().OpenUrl(url);
		}

		// Called when the app is opened from a Universal Link 
		public override bool ContinueUserActivity(UIApplication application, NSUserActivity userActivity, UIApplicationRestorationHandler completionHandler)
		{
			return BranchIOS.getInstance().ContinueUserActivity(userActivity);
		}

		// Called when the app receives a push notification
		public override void ReceivedRemoteNotification(UIApplication application, NSDictionary userInfo)
		{
			BranchIOS.getInstance().HandlePushNotification(userInfo);
		}
	}
}
```

___

####### **Integrating with an Android Forms app**

**I. Ensure that the Android project is not using the Shared Mono Runtime**

1. Right-click on the Android project and select: **Options**  
2. Select: **Android Build**  
3. On the **General** tab, un-check: **Use Shared Mono Runtime**  

**II. Add app capabilities in the AndroidManifest.xml file**

In the *Required permissions* section of **AndroidManifest.xml**, configure the following permissions:

- *AccessNetworkState*
- *Internet*

Additional reading on the Android manifest

- [Working with android manifest.xml](https://developer.xamarin.com/guides/android/advanced_topics/working_with_androidmanifest.xml/)
- [Add permissions to android manifest](https://developer.xamarin.com/recipes/android/general/projects/add_permissions_to_android_manifest/)

**III. Add the app's Branch key to the Strings.xml file**

Create a **Resources/values/Strings.xml** file that can be accessed by the app's Application class for the Android project and add the Branch key to this file.

1. In the Android project, browse to **Resources/values**
2. Right-click on the **values** folder and select: **Add > New File...**
3. Select: **XML > Empty XML File**
4. Name the file: **Strings**
5. Enter the following values:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
	<string name="app_name">TestXamarinFormsApp</string>
	<string name="branch_key">key_live_liAnF8k7gZUEZv76Rt9a4bffAzlC5zVW</string>
</resources>
```

**IV. Configure the .Droid project's Application class**

Within the .Droid project's Application class:

- Set the Branch SDK's initialization parameters  
- Override the `OnCreate()` method to call `BranchAndroid.GetAutoInstance`  

If an Appplication class does not already exist for the project, create one:

1. Right-click on the .Droid project and select: **Add > New File...**
3. Select: **General > Empty Class**
4. Name the file: _{app name}_ ('TestXamarinFormsApp', for example)

The file should have the following contents:

```csharp
using System;
using Android.App;
using Android.Content;
using Android.Runtime;
using BranchXamarinSDK;

namespace TestXamarinFormsApp.Droid
{

	[Application (AllowBackup = true, Icon = "@drawable/icon", Label = "@string/app_name")]
	[MetaData("io.branch.sdk.auto_link_disable", Value = "false")]
	[MetaData("io.branch.sdk.TestMode", Value = "true")]
	[MetaData("io.branch.sdk.BranchKey", Value = "@string/branch_key")]

	public class App : Application
	{
		public App(IntPtr javaReference, JniHandleOwnership transfer) : base(javaReference, transfer)
		{
		}

		public override void OnCreate()
		{
			base.OnCreate();
			BranchAndroid.GetAutoInstance(this.ApplicationContext);
		}
	}
}
```

| Key | Value
| --- | ---
| io.branch.sdk.TestMode | Setting this parameter to *true* enables Debug Mode, which causes simple uninstall/reinstalls of the app to trigger *install* events. Be sure to disable this before deploying to production. Note that enabling Debug Mode on Android also forces the app to use the Branch *Test* key if this key has been added to the project. Apps running with a *Test* key will be unable to receive data from Branch links created with the *Live* key.
| io.branch.sdk.BranchKey | The app's Branch key. Both a *Live* key and a *Test* key can be added to the Strings.xml file. When *Test* Mode is enabled the app will automatically use the *Test* key, if one has been specified.

**V. Initialize Branch**

Branch must be initilialized in the OnCreate method of either the Application class or the first Activity launched by the app. The OnNewIntent method must be added to retrieve the latest link identifier when the app becomes active due to a Branch link click.

In the code example below the following Branch initialization and session management steps have been added to MainActivity.cs:

- Register an Activity to respond to the app's URI Scheme
- Ensure the Activity is launched in `singleTask` mode
- Override the OnCreate method and initialize the Branch SDK
- Override the OnNewIntent method

```csharp
using System;

using Android.App;
using Android.Content;
using Android.Content.PM;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using Android.OS;

using BranchXamarinSDK;
using TestXamarinFormsApp;

namespace TestXamarinFormsApp.Droid
{
	[Activity(Label = "TestXamarinFormsApp.Droid", LaunchMode = LaunchMode.SingleTask, Icon = "@drawable/icon", Theme = "@style/MyTheme", MainLauncher = true, ConfigurationChanges = ConfigChanges.ScreenSize | ConfigChanges.Orientation)]

	[IntentFilter(new[] { "android.intent.action.VIEW" },
		Categories = new[] { "android.intent.category.DEFAULT", "android.intent.category.BROWSABLE" },
		DataScheme = "testxamarinformsapp",
		DataHost = "open")]

	[IntentFilter(new[] { "android.intent.action.VIEW" },
		Categories = new[] { "android.intent.category.DEFAULT", "android.intent.category.BROWSABLE" },
		DataScheme = "https",
		DataHost = "testxamarinformsapp.app.link")]
	
	public class MainActivity : global::Xamarin.Forms.Platform.Android.FormsApplicationActivity
	{
		protected override void OnCreate(Bundle savedInstanceState)
		{
			base.OnCreate(savedInstanceState);

			global::Xamarin.Forms.Forms.Init(this, savedInstanceState);

			TestXamarinFormsAppBUO linkData = new TestXamarinFormsAppBUO();
			BranchAndroid.Init(this, GetString(Resource.String.branch_key), linkData);
			LoadApplication(linkData);
		}

		protected override void OnNewIntent(Intent intent)
		{
			this.Intent = intent;
		}
	}
}
```

- #### Receive deep link data

    All of your deep link parameters and Branch-added parameters will be returned to you when initialization completes. You can find a summary of [Branch-added values in the table here](/pages/links/integrate/#callback-values). If no referring link data was present, you'll see `+clicked_branch_link` equal to `false`.

- #### Test deep link

## Implement features
- #### Create content reference

The Branch Universal Object is a data object representing a piece of content that is referenced by a Branch link. Together with a set of Link Properties (marketing metadata such as Campaign and Channel as well as Branch-behavior related parameters such as $deepview_path), can be combined to generate a Branch link.

```csharp
BranchUniversalObject universalObject = new BranchUniversalObject();
universalObject.canonicalIdentifier = "id12345";
universalObject.title = "id12345 title";
universalObject.contentDescription = "My awesome piece of content!";
universalObject.imageUrl = "https://s3-us-west-1.amazonaws.com/branchhost/mosaic_og.png";
universalObject.metadata.Add("foo", "bar");
```

- #### Create deep link

Branch links can be created in-app (as well as in many other ways - see: [Branch link creation guide](https://github.com/BranchMetrics/Branch-Integration-Guides/blob/master/url-creation-guide.md). When they are, and setIdentity has been called to associate a User ID with the current user session, Branch links will be associated with that User ID.

```csharp
BranchLinkProperties linkProperties = new BranchLinkProperties();
linkProperties.tags.Add("tag1");
linkProperties.tags.Add("tag2");
linkProperties.feature = "sharing";
linkProperties.channel = "facebook";
linkProperties.controlParams.Add("$desktop_url", "http://example.com");

Branch.GetInstance().GetShortURL(callback,
		                          universalObject,
		                          linkProperties);
```

**Note**
You can customize the Facebook OG tags of each URL if you want to dynamically share content by using the following _optional keys in the data dictionary_. Please use this [Facebook tool](https://developers.facebook.com/tools/debug/og/object) to debug the OG tags!

| Key | Value
| --- | ---
| "$og_title" | The title you'd like to appear for the link in social media
| "$og_description" | The description you'd like to appear for the link in social media
| "$og_image_url" | The URL for the image you'd like to appear for the link in social media
| "$og_video" | The URL for the video 
| "$og_url" | The URL you'd like to appear
| "$og_app_id" | the OG app ID. Optional and rarely used.

Also, you do custom redirection by inserting the following _optional keys in the dictionary_:

| Key | Value
| --- | ---
| "$desktop_url" | Where to send the user on a desktop or laptop. By default it is the Branch-hosted text-me service
| "$android_url" | The replacement URL for the Play Store to send the user if they don't have the app. _Only necessary if you want a mobile web splash_
| "$ios_url" | The replacement URL for the App Store to send the user if they don't have the app. _Only necessary if you want a mobile web splash_
| "$ipad_url" | Same as above but for iPad Store
| "$fire_url" | Same as above but for Amazon Fire Store
| "$blackberry_url" | Same as above but for Blackberry Store
| "$windows_phone_url" | Same as above but for Windows Store

You have the ability to control the direct deep linking of each link by inserting the following _optional keys in the dictionary_:

| Key | Value
| --- | ---
| "$deeplink_path" | The value of the deep link path that you'd like us to append to the URI. For example, you could specify "$deeplink_path": "radio/station/456" and we'll open the app with the URI "theapp://radio/station/456?link_click_id=branch-identifier". This is primarily for supporting legacy deep linking infrastructure. 
| "$always_deeplink" | true or false. (default is not to deep link first) This key can be specified to have our linking service force try to open the app, even if we're not sure the user has the app installed. If the app is not installed, we fall back to the respective app store or $platform_url key. By default, we only open the app if we've seen a user initiate a session in the app from a Branch link (has been cookied and deep linked by Branch)

- #### Share deep link

```
ShareLink (IBranchLinkShareInterface callback,
		   BranchUniversalObject universalObject,
		   BranchLinkProperties linkProperties,
		   string message)
```

- #### Read deep link

- Returns [deep link properties](/pages/links/integrate/#read-deep-links)

##### Retrieve session (install or open) parameters

Session parameters will be available at any point. If there are no params, the dictionary will be empty. This refreshes with every new session (app installs AND app opens)

```csharp
Dictionary<string, object> sessionParams = Branch.GetInstance().GetLatestReferringParams();
```
or

```csharp
BranchUniversalObject buo = Branch.GetInstance().GetLastReferringBranchUniversalObject();
BranchLinkProperties blp = Branch.GetInstance().GetLastReferringBranchLinkProperties();
```

##### Retrieve install (install only) parameters

If you ever want to access the original session params (the parameters passed in for the first install event only), you can use this line. This is useful if you only want to reward users who newly installed the app from a referral link or something.

```csharp
Branch branch = Branch.GetInstance ();
Dictionary<string, object> installParams = branch.GetFirstReferringParams();
```
or

```csharp
BranchUniversalObject buo = Branch.GetInstance().GetFirstReferringBranchUniversalObject();
BranchLinkProperties blp = Branch.GetInstance().GetFirstReferringBranchLinkProperties();
```

- #### Navigate to content
- #### Display content
- #### Track content

```
RegisterView (BranchUniversalObject universalObject)
```

- #### Track users

##### Persistent identities

Often, you might have the own user IDs, or want referral and event data to persist across platforms or uninstall/reinstall. It's helpful if you know the users access the service from different devices. This where we introduce the concept of an 'identity'.

To identify a user, just call:

```csharp
Branch branch = Branch.GetInstance (); 
branch.SetIdentity("the user id", this);  // Where this implements IBranchIdentityInterface
```

###### Logout

If you provide a logout function in the app, be sure to clear the user when the logout completes. This will ensure that all the stored parameters get cleared and all events are properly attributed to the right identity.

**Warning** this call will clear the referral credits and attribution on the device.

```csharp
Branch branch = Branch.GetInstance ();
branch.Logout(this); // Where this implements IBranchIdentityInterface
```

- #### Track events

```csharp
Branch branch = Branch.GetInstance ();
branch.UserCompletedAction("the_custom_event");
```

OR if you want to store some state with the event

```csharp
Branch branch = Branch.GetInstance ();
Dictionary<string, object> data = new Dictionary<string, object>();
data.Add("sku", "123456789");
branch.UserCompletedAction("purchase_event", data);
```

Some example events you might want to track:

```csharp
"complete_purchase"
"wrote_message"
"finished_level_ten"
```

- #### Track commerce
- #### Handle referrals

##### Referral rewards

In a standard referral system, you have 2 parties: the original user and the invitee. Our system is flexible enough to handle rewards for all users. Here are a couple example scenarios:

1) Reward the original user for taking action (eg. inviting, purchasing, etc)

2) Reward the invitee for installing the app from the original user's referral link

3) Reward the original user when the invitee takes action (eg. give the original user credit when their the invitee buys something)

These reward definitions are created on the dashboard, under the 'Reward Rules' section in the 'Referrals' tab on the dashboard.

Warning: For a referral program, you should not use unique awards for custom events and redeem pre-identify call. This can allow users to cheat the system.

###### Check a reward balance

Reward balances change randomly on the backend when certain actions are taken (defined by the rules), so you'll need to make an asynchronous call to retrieve the balance. Here is the syntax:

```csharp
Branch branch = Branch.GetInstance ();
branch.LoadRewards(this);

#region IBranchRewardsInterface implementation

		public void RewardsLoaded ()
		{
			// Do something with the data...
		}

		public void RewardsRedeemed ()
		{
			// Do something with the data...
		}

		public void CreditHistory (List<CreditHistoryEntry> history)
		{
			// Do something with the data...
		}

		public void RewardsRequestError (BranchError error)
		{
			// Do something with the data...
		}

#endregion
```

###### Redeem all or some of the reward balance

We will store how many of the rewards have been deployed so that you don't have to track it on the end. In order to save that you gave the credits to the user, you can call redeem. Redemptions will reduce the balance of outstanding credits permanently.

```csharp
Branch branch = Branch.GetInstance ();
branch.RedeemRewards(this, amount, bucket);

#region IBranchRewardsInterface implementation

		public void RewardsLoaded ()
		{
			// Do something with the data...
		}

		public void RewardsRedeemed ()
		{
			// Do something with the data...
		}

		public void CreditHistory (List<CreditHistoryEntry> history)
		{
			// Do something with the data...
		}

		public void RewardsRequestError (BranchError error)
		{
		 // Do something with the data...
		}

		#endregion

```

###### Get credit history

This call will retrieve the entire history of credits and redemptions from the individual user.  It also implements the IBranchRewardsInterface(see above). To use this call, implement like so:

```csharp
Branch branch = Branch.GetInstance ();
branch.GetCreditHistory(this);

```

The response will return an array that has been parsed from the following JSON:
```json
[
    {
        "transaction": {
                           "date": "2014-10-14T01:54:40.425Z",
                           "id": "50388077461373184",
                           "bucket": "default",
                           "type": 0,
                           "amount": 5
                       },
        "referrer": "12345678",
        "referree": null
    },
    {
        "transaction": {
                           "date": "2014-10-14T01:55:09.474Z",
                           "id": "50388199301710081",
                           "bucket": "default",
                           "type": 2,
                           "amount": -3
                       },
        "referrer": null,
        "referree": "12345678"
    }
]
```

**referrer**
: The id of the referring user for this credit transaction. Returns null if no referrer is involved. Note this id is the user id in developer's own system that's previously passed to Branch's identify user API call.

**referree**
: The id of the user who was referred for this credit transaction. Returns null if no referree is involved. Note this id is the user id in developer's own system that's previously passed to Branch's identify user API call.

**type**
: This is the type of credit transaction

1. _0_ - A reward that was added automatically by the user completing an action or referral
1. _1_ - A reward that was added manually
2. _2_ - A redemption of credits that occurred through our API or SDKs
3. _3_ - This is a very unique case where we will subtract credits automatically when we detect fraud

## Troubleshoot issues
- #### Recommendations

##### Unable to add Branch-required NuGet packages to the C# project

Adding required NuGet packages to the C# project may fail if the project has not been configured to use **PCL 4.5 - Profile78**

1. Right-click on the project name and select: **Options**  
2. Browse the menu to **Build > General**  
3. Change the **Current Profile** to: **PCL 4.5 - Profile78**  

##### Android app fails to build with linking errors

The Newtonsoft JSON NuGet package is automatically added to a project when the Branch Xamarin SDK NuGet package is added. There is a known issue with this package that results in linking errors when building a project.

error XA0009: Error while loading assembly: /Users/david/Projects/TestXamarinFormsApp/Droid/obj/Debug/android/assets/mscorlib.dll

To resolve this issue with the Newtonsoft JSON NuGet package:

1. Right-click on the project and select Options  
2. Go to **Android Build** and select the **Linker** tab  
3. Select: **Release**  
4. Go to the **Ignore assemblies** box  
5. Add: **System.Core**  
6. Rebuild the app  

##### Deploying iOS app to device fails with Provisioning Profile erros after changing entitlements

Xamarin automatically populates the **Bundle Identifier** field in the **Info.plist** file with an all-lowercase value derived from the app's name. This value is in fact case sensitive and must match the value in the [Apple Developer Portal](https://developer.apple.com/account/ios/identifier/bundle) precisely. The default Xamarin configuration may work when there are no entitlements configured and then suddenly begin failing after entitlements have been added.

This issue can be resolved by ensuring that the **Bundle Identifier** in the **Info.plist** matches the **Bundle Identifier** shown on the [Apple Developer Portal](https://developer.apple.com/account/ios/identifier/bundle).

1. Open the **Info.plist** file
2. Enter the app's **Bundle Identifier** from the [Apple Developer Portal](https://developer.apple.com/account/ios/identifier/bundle) in the **Bundle Identifier** field

- #### Sample apps

There are four fully-functional demo apps included in this repository: a Xamarin Native and Xamarin Forms apps for both iOS and Android platforms. Use these apps as reference models for integrating the Branch SDK.

**Testbed-Xamarin (Native apps)**

- [iOS](https://github.com/BranchMetrics/xamarin-branch-deep-linking/tree/master/Examples/droid_example)  
- [Android](https://github.com/BranchMetrics/xamarin-branch-deep-linking/tree/master/Examples/ios_example)  

**Testbed-XamarinForms (Forms apps)**

- [iOS](https://github.com/BranchMetrics/xamarin-branch-deep-linking/tree/master/Branch-Xamarin-Testbed.iOS)  
- [Android](https://github.com/BranchMetrics/xamarin-branch-deep-linking/tree/master/Branch-Xamarin-Testbed.Droid)  

Should you run into issues with the SDK, please check that they are present in the appropriate demo app before submitting any issue as a bug.
