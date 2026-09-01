import { ServicePlanDocument, ServicePlanBlock, DeviceType } from '../types';

// Non-SDK devices (e.g. Airdopes 141) get the reduced Sound/System app set per reference doc
export const HEARABLES_CONTENT_NON_SDK: ServicePlanBlock['content'] = {
  hearablesAppTabs: [
    {
      id: 'tab-nsdk-1',
      tabName: 'App - Sound Tab',
      mockupType: 'sound',
      accentColor: '#ef4444',
      description: 'Sound tab with Volume Control and JioSaavn / KuKu FM streaming integration.',
      features: ['Volume Control Slider', 'JioSaavn Music Streaming', 'KuKu FM Audiobooks'],
    },
    {
      id: 'tab-nsdk-2',
      tabName: 'App - System Tab',
      mockupType: 'system',
      accentColor: '#10b981',
      description: 'System tab with Ring My Buds, User Manual access, and Smart Diagnostics.',
      features: ['Ring My Buds (L / Both / R)', 'User Manual – Know More', 'Diagnose My Device'],
    },
  ],
  hearablesGuideSteps: [
    {
      id: 'nsdk-hgs-1',
      functionName: 'App Installation',
      process: '● To install the boAt Hearables app, you can follow one of the options mentioned below-\n1. Scan QR Code - The Hearables app QR code is printed on the packaging box. Simply scan this code using your smartphone. The subsequent link will redirect you to the Google Play Store and iOS Store, and you can select the applicable option.\n2. Google Play Store - Download the boAt Hearables app from the Google Play Store on your Android smartphone.\n<https://play.google.com/store/apps/details?id=com.boAt.hearables&hl=en_IN&gl=US>\n3. App Store - Download the boAt Hearables app from the App Store on your iOS smartphone.\n<https://apps.apple.com/in/app/boat-hearables/id1592550875>',
    },
    {
      id: 'nsdk-hgs-2',
      functionName: 'Account Setup',
      process: '● After installing the app, follow the steps shown on the app to set up your account by entering your phone number, name, and email ID. Account setup is a one-time action.',
    },
    {
      id: 'nsdk-hgs-3',
      functionName: 'Device Pairing',
      process: '● Step 1: Turn on Bluetooth on your media device.\n● Step 2: Log in to your account on the boAt Hearables app.\n● Step 3: Go to the “My Devices” section.\n● Step 4: Open the case lid and take out the earbuds. The earbuds will show up under the list of available devices with “Ready to Pair” status. Follow the ‘Pull to refresh’ option on the app if the device does not show up on the list.\n● Step 5: Tap the device name card and accept the pairing request pop-up notification on your media device.\n● Step 6: Tap the ‘OK’ option on the pairing notification. You can also save the device to your Google account for fast pairing in the future by clicking on “Save” and then “Set up”.\n\nCongratulations! The device is now connected to your media device with “Connected” status.',
    },
    {
      id: 'nsdk-hgs-4',
      functionName: 'Activating Ring My Buds',
      process: '● Step 1: Pair the device to your media device by following the pairing process.\n● Step 2: Go to the “System” tab on the Hearables app.\n● Step 3: Under the System tab, go to the ‘Ring My Buds’ section to search for either or both earbuds by playing a tone from the app. Please ensure that the volume on your smartphone is set to the maximum level to detect the earbuds easily.',
    },
    {
      id: 'nsdk-hgs-5',
      functionName: 'Viewing Connectivity Status',
      process: '● Step 1: Pair the device to your media device by following the pairing process.\n● Step 2: Go to the “My Devices” section on the Hearables app.\n● Step 3: If the device is connected successfully, the device will show up at the top of the list with “Connected” mentioned on top of the device card with a Bluetooth symbol.\n● Note: Follow the ‘Pull to refresh’ option on the app if the device does not show up on the list. When disconnected, the device card will disappear from the available devices list.',
    },
    {
      id: 'nsdk-hgs-6',
      functionName: 'Listen to Audiobooks and Music',
      process: '● Step 1: Pair the device to your media device by following the pairing process.\n● Step 2: Go to the “Sound” tab on the Hearables app.\n● Step 3: Choose between JioSaavn and Kuku FM to listen to your favourite music or desired audiobooks for free.',
    },
    {
      id: 'nsdk-hgs-7',
      functionName: 'View User Manual',
      process: '● Step 1: Pair the device to your media device by following the pairing process.\n● Step 2: Go to the “System” tab on the Hearables app.\n● Step 3: Under the System tab, you have the option to read the User Manual for the device.',
    },
    {
      id: 'nsdk-hgs-8',
      functionName: 'Smart Diagnostics Mode',
      process: 'To diagnose issues related to Bluetooth connectivity, mic, speaker, and battery, use the Smart Diagnostics function of the Hearables app.\n● Step 1: Tap the “Diagnose My Device” option at the bottom.\n● Step 2: Follow the instructions to start the smart diagnostics process.\n● Step 3: Click on “Let’s Go” to start.\n● Step 4: Complete all the steps one by one to check Bluetooth connectivity, mic, speaker, and battery functions.\n● Step 5: Click on ‘Done’ to finish diagnostics.',
    },
  ],
};

// SDK devices get the full Hearables app set (Sound + Touch + System, EQ, touch remapping, OTA).
// Product-agnostic wording keeps this content isolated so it can be applied to any SDK product
// without leaking another product's model name into the document.
export const HEARABLES_CONTENT_SDK: ServicePlanBlock['content'] = {
  hearablesAppTabs: [
    {
      id: 'tab-sdk-1',
      tabName: 'App - Sound Tab',
      mockupType: 'sound',
      accentColor: '#ef4444',
      description: 'Sound settings with Dolby Audio toggle, 5 Preset Equalizers (Balanced, Pop, Rock, Jazz, Club) + Custom EQ, and KuKu FM / JioSaavn integration.',
      features: ['Dolby Audio Switch', 'Equalizer Mode Selector (Balanced, Pop, Rock, Jazz, Club)', 'Streaming Audiobooks / Music Shortcuts'],
    },
    {
      id: 'tab-sdk-2',
      tabName: 'App - Touch Tab',
      mockupType: 'touch',
      accentColor: '#3b82f6',
      description: 'Customizable touch gesture mapping for Left and Right Earbud CTC buttons.',
      features: ['1 Tap / 2 Taps / 3 Taps / Long Press Remapping', 'Independent Left and Right Controls', 'Volume, Track, BEAST Mode & Voice Assistant'],
    },
    {
      id: 'tab-sdk-3',
      tabName: 'App - System Tab',
      mockupType: 'system',
      accentColor: '#10b981',
      description: 'System features including Multipoint Connectivity, In-Ear Detection, Find My Device, OTA Software Updates, User Manual, and Smart Diagnostics.',
      features: ['Multipoint Connectivity Switch', 'In-Ear Optical Sensor Toggle', 'Firmware OTA Software Update', 'Smart Diagnostics Mode'],
    },
  ],
  hearablesGuideSteps: [
    {
      id: 'sdk-hgs-1',
      functionName: 'App Installation',
      process: '● To install the boAt Hearables app, you can follow one of the options mentioned below-\n1. Scan QR Code - The Hearables app QR code is printed on the packaging box. Simply scan this code using your smartphone. The subsequent link will redirect you to the Google Play Store and iOS Store, and you can select the applicable option.\n2. Google Play Store - Download the boAt Hearables app from the Google Play Store on your Android smartphone.\n<https://play.google.com/store/apps/details?id=com.boAt.hearables&hl=en_IN&gl=US>\n3. App Store - Download the boAt Hearables app from the App Store on your iOS smartphone.\n<https://apps.apple.com/in/app/boat-hearables/id1592550875>',
    },
    {
      id: 'sdk-hgs-2',
      functionName: 'Account Setup',
      process: '● After installing the app, follow the steps shown on the app to set up your account by entering your phone number, name, and email ID. Account setup is a one-time action.',
    },
    {
      id: 'sdk-hgs-3',
      functionName: 'Device Pairing',
      process: '● Step 1: Turn on the Bluetooth on your media device.\n● Step 2: Log in to your account on the boAt Hearables app.\n● Step 3: Go to the “My Devices” section.\n● Step 4: Open the case lid and take out the earbuds. The earbuds will show up under the list of available devices with “Ready to Pair” status. Follow the ‘Pull to refresh’ option on the app if the device does not show up on the list.\n● Step 5: Tap the device name card and accept the pairing request pop-up notification on your media device.\n● Step 6: Tap the ‘OK’ option on the pairing notification. You can also save the device to your Google account for fast pairing in the future by clicking on “Save” and then “Set up”.\n\nCongratulations! The device is now connected to your media device with “Connected” status.',
    },
    {
      id: 'sdk-hgs-4',
      functionName: 'Activating Dolby Audio',
      process: '● Step 1: Pair the earbuds to your media device by following the pairing process.\n● Step 2: Go to the “Sound” tab on the Hearables app.\n● Step 3: Under the “Dolby Audio” header, activate or deactivate Dolby Audio using the toggle switch.',
    },
    {
      id: 'sdk-hgs-5',
      functionName: 'Activating Equalizer',
      process: '● Step 1: Pair the earbuds to your media device by following the pairing process.\n● Step 2: Go to the “Sound” tab on the Hearables app.\n● Step 3: Under the Sound tab, the “Equalizer” header has all the equalization modes displayed.\n● Step 4: Select the mode of your choice depending on the level of sound elements required-\n1. Tap ‘Balanced’ to experience the sound elements evenly\n2. Tap ‘Pop’ to experience preset Pop EQ mode\n3. Tap ‘Rock’ to experience preset Rock EQ mode\n4. Tap ‘Jazz’ to experience preset Jazz EQ mode\n5. Tap ‘Club’ to experience preset Club EQ mode',
    },
    {
      id: 'sdk-hgs-6',
      functionName: 'Customizing Touch Controls',
      process: 'The Hearables app lets you customize existing touch functions to another from the list of available options.\n\nLEFT earbud:\n1 Tap:\nExisting Function - Accept incoming calls\nCustomizable Functions - Volume Up, Volume Down, Previous Track, Next Track, Activate/De-activate BEAST™ Mode, Activate Google/Siri Voice Assistant, Activate/Deactivate Dolby Audio\n\n2 Taps:\nExisting Function - Activate/Deactivate Dolby Audio | Reject/Hang Up Calls\nCustomizable Functions - Volume Up, Volume Down, Next Track, Play/Pause audio, Activate/Deactivate BEAST™ Mode, Activate Google/Siri Voice Assistant\n\n3 Taps:\nExisting Function - Return to Previous Track\n\nRIGHT earbud:\n1 Tap:\nExisting Function - Accept incoming calls\nCustomizable Functions - Volume Up, Volume Down, Previous Track, Next Track, Activate/De-activate BEAST™ Mode, Activate Google/Siri Voice Assistant, Activate/Deactivate Dolby Audio\n\n2 Taps:\nExisting Function - Activate/Deactivate BEAST™ Mode | Reject/Hang Up Calls\nCustomizable Functions - Volume Up, Volume Down, Next Track, Play/Pause audio, Activate/Deactivate BEAST™ Mode, Activate Google/Siri Voice Assistant, Activate/Deactivate Dolby Audio\n\n3 Taps:\nExisting Function - Return to Next Track',
    },
    {
      id: 'sdk-hgs-7',
      functionName: 'Activating In-Ear Detection',
      process: '● Step 1: Pair the earbuds to your media device by following the pairing process.\n● Step 2: Go to the “System” tab on the Hearables app.\n● Step 3: Under the System tab, slide the “In-Ear Detection” toggle to the OFF state to deactivate in-ear detection. Slide the toggle once again to ON for activating in-ear detection.\n\nNote - By default, In-Ear detection remains ON.',
    },
    {
      id: 'sdk-hgs-8',
      functionName: 'Activating Multipoint Connectivity',
      process: '● Step 1: Pair the earbuds to your media device by following the pairing process.\n● Step 2: Go to the “System” tab on the Hearables app.\n● Step 3: Multipoint connectivity remains ON by default for keeping the earbuds connected to two media devices at the same time. Under the System tab, slide the “Multipoint Connectivity” toggle to the OFF state to deactivate the multipoint connection. Slide the toggle once again to ON to activate multipoint connection.\n\nNote: By default, Multipoint connectivity remains ON.',
    },
    {
      id: 'sdk-hgs-9',
      functionName: 'Installing Software Updates',
      process: '● Step 1: Pair the earbuds to your media device by following the pairing process.\n● Step 2: Go to the “System” tab on the Hearables app.\n● Step 3: Tap the “Check For Updates” option under the “Software Update” header to check and update the earbuds to the latest firmware version, if available.\n\nNote - If the product is updated to the latest available version, the app will show an alert on clicking the option -‘You already have the latest firmware version’.',
    },
    {
      id: 'sdk-hgs-10',
      functionName: 'Factory Reset',
      process: '● Step 1: To reset the earbuds from your device, go to the Troubleshooting section “?” on the Hearables app.\n● Step 2: Next, tap the “Malfunctioning” sub-header in the Troubleshooting section.\n● Step 3: Click on the option “Reset My Device” to reset the earbuds.\n\nCongratulations! Your earbuds have been reset.\n\nThe earbuds will now show as “Ready to Pair” in the My Devices section. Follow the pairing procedure to connect the earbuds to your device.',
    },
    {
      id: 'sdk-hgs-11',
      functionName: 'Smart Diagnostics Mode',
      process: 'To diagnose issues related to Bluetooth connectivity, mic, speaker, and battery, use the Smart Diagnostics function of the Hearables app.\n● Step 1: Tap the “Diagnose My Device” option at the bottom.\n● Step 2: Follow the instructions to start the smart diagnostics process.\n● Step 3: Click on “Let’s Go” to start.\n● Step 4: Complete all the steps one by one to check Bluetooth connectivity, mic, speaker, and battery functions.\n● Step 5: Click on ‘Done’ to finish diagnostics.',
    },
  ],
};

// Resolve hearables app content for a given device type (SDK keeps the full master content)
export const getHearablesContentForDeviceType = (deviceType: DeviceType): ServicePlanBlock['content'] => {
  if (deviceType === 'Non-SDK') return JSON.parse(JSON.stringify(HEARABLES_CONTENT_NON_SDK));
  return JSON.parse(JSON.stringify(HEARABLES_CONTENT_SDK));
};

export const boatAirdopesPrime800DBlocks: ServicePlanBlock[] = [
  {
    id: 'block-header-1',
    sectionNumber: '1',
    title: 'Product Specification Document for boAt Airdopes Prime 800D',
    subtitle: '',
    type: 'header_overview',
    archetype: 'text_heavy',
    enabled: true,
    customization: {
      accentColor: '#1e40af',
      showSectionNumber: true,
      layoutStyle: 'compact',
      showNote: false,
    },
    content: {
      objective: 'To understand complete product details and technical diagnostic guidelines for a new product, which can help the service team to build a detailed service plan.',
      documentOwner: 'Product Manager',
      featureHighlights: [
        'Dolby Audio',
        'Quad mics with AI-ENx™',
        'Multipoint',
        '11mm drivers',
        'ASAP™ Charge 10mins = 4 hrs of playtime',
        '45 hrs playback',
        'V6.1 Bluetooth',
        'Beast™ Mode: 45ms Low latency',
        'In-Ear detection',
        'GFPS, Microsoft Swift pair, Google Find Hub',
        'boAt Hearables App Support',
        'IPX5',
      ],
    },
  },
  {
    id: 'block-definitions-2',
    sectionNumber: '2',
    title: 'Technical Definitions',
    subtitle: '',
    type: 'technical_definitions',
    archetype: 'table_heavy',
    enabled: true,
    customization: {
      accentColor: '#1e40af',
      showSectionNumber: true,
      tableBorder: true,
      zebraStriping: false,
    },
    content: {
      definitions: [
        { id: 'def-1', term: 'TWS', definition: 'True Wireless Stereo' },
        { id: 'def-2', term: 'IPX5', definition: 'Water Splash Protection Certified' },
        { id: 'def-3', term: 'MSC', definition: 'Multi-Brand Service Centre' },
        { id: 'def-4', term: 'D2D', definition: 'Door-to-Door Replacement Service' },
        { id: 'def-5', term: 'CTC', definition: 'Capacitive Touch Control' },
        { id: 'def-6', term: 'DUT', definition: 'Device Under Testing' },
      ],
    },
  },
  {
    id: 'block-specs-3-1',
    sectionNumber: '3.1',
    title: 'Product Specifications',
    subtitle: '',
    type: 'specifications_table',
    archetype: 'table_heavy',
    enabled: true,
    customization: {
      accentColor: '#1e40af',
      showSectionNumber: true,
      tableBorder: true,
      zebraStriping: false,
      showNote: true,
      noteTitle: 'Note',
      noteText: 'Music Playtime of 45 hours per charge is based on listening to music at 60% volume & in AAC Codec. Listening to music/audio files at more than 60% volume, Dolby Audio On, and Multipoint On will reduce the playtime.',
    },
    content: {
      specifications: [
        { id: 'sp-1', key: 'Product Name', value: 'Airdopes Prime 800D' },
        { id: 'sp-2', key: 'Headphone Type', value: 'TWS Earbuds' },
        { id: 'sp-3', key: 'Bluetooth Version', value: 'v6.1' },
        { id: 'sp-4', key: 'Music Playtime', value: 'Up to 45 hours (at 60% volume)' },
        { id: 'sp-5', key: 'Number of AI-ENx™ Equipped Mics', value: '4' },
        { id: 'sp-6', key: 'IWP™ Tech', value: 'Yes' },
        { id: 'sp-7', key: 'BEAST™ Mode', value: 'Yes; 45 ms Low Latency' },
        { id: 'sp-8', key: 'Transmission Range', value: '12 m' },
        { id: 'sp-9', key: 'Driver Size', value: '11 mm*2' },
        { id: 'sp-10', key: 'Supported Codec', value: 'AAC/SBC' },
        { id: 'sp-11', key: 'Frequency', value: '20 Hz-20 kHz' },
        { id: 'sp-12', key: 'Battery', value: '500 mAh (Case); 50 mAh*2 (Earbuds)' },
        { id: 'sp-13', key: 'ASAP™ Charge', value: 'Yes; 10 mins charge = 4 hrs mins playtime' },
        { id: 'sp-14', key: 'Charging Time', value: '30 mins (Earbuds); 1.5 hours (Case)' },
        { id: 'sp-15', key: 'Charging Interface', value: 'USB Type-C' },
        { id: 'sp-16', key: 'Water Resistance', value: 'IPX5' },
      ],
    },
  },
  {
    id: 'block-packaging-3-2',
    sectionNumber: '3.2',
    title: 'Packaging Contents',
    subtitle: '',
    type: 'packaging_contents',
    archetype: 'text_heavy',
    enabled: true,
    customization: {
      accentColor: '#1e40af',
      showSectionNumber: true,
      layoutStyle: 'compact',
    },
    content: {
      packagingList: [
        '1 X Pair of boAt Airdopes Prime 800D TWS Earbuds',
        '1 X Charging Case',
        '1 X Type-C Charging Cable',
        '1 X Smart Guide',
        '2 X Pairs of Additional Earmuffs',
      ],
    },
  },
  {
    id: 'block-variants-3-3',
    sectionNumber: '3.3',
    title: 'Colour Variants',
    subtitle: '',
    type: 'colour_variants',
    archetype: 'image_heavy',
    enabled: true,
    customization: {
      accentColor: '#1e40af',
      showSectionNumber: true,
      imageDisplayMode: 'grid',
    },
    content: {
      colourVariants: [
        {
          id: 'cv-1',
          name: 'Raven Black',
          colorHex: '#111827',
          secondaryHex: '#1f2937',
          imageDesc: 'Deep raven black finish with Dolby Audio and boAt branding.',
          isSmartVariant: false,
        },
        {
          id: 'cv-2',
          name: 'Swedish White',
          colorHex: '#f8fafc',
          secondaryHex: '#e2e8f0',
          imageDesc: 'Clean pearl swedish white finish.',
          isSmartVariant: false,
        },
        {
          id: 'cv-3',
          name: 'Royal Blue',
          colorHex: '#1e3a8a',
          secondaryHex: '#3b82f6',
          imageDesc: 'Ocean royal blue finish.',
          isSmartVariant: false,
        },
      ],
    },
  },
  {
    id: 'block-functionalities-3-4',
    sectionNumber: '3.4',
    title: 'Product Functionalities',
    subtitle: '',
    type: 'product_functionalities',
    archetype: 'matrix_step',
    enabled: true,
    customization: {
      accentColor: '#1e40af',
      showSectionNumber: true,
      tableBorder: true,
      zebraStriping: false,
    },
    content: {
      functionalities: [
        {
          id: 'fn-1',
          functionName: 'Power On',
          process: 'Smart Power On:\nTo automatically switch the earbuds on, simply open the lid of the charging case when the earbuds are kept inside.',
        },
        {
          id: 'fn-2',
          functionName: 'Power Off',
          process: 'Smart Power Off:\n● Step 1: After usage, remove both earbuds from your ears.\n● Step 2: Place the earbuds back into the charging case in the correct orientation and close the case lid.\n● Step 3: The earbuds will automatically switch off (and enter charging mode).',
        },
        {
          id: 'fn-3',
          functionName: 'Answer',
          process: '● Single tap the CTC on either earbud to answer an incoming call',
        },
        {
          id: 'fn-4',
          functionName: 'Reject/ End Call',
          process: '● Double tap either earbud’s CTC to reject an incoming call or end an ongoing call',
        },
        {
          id: 'fn-5',
          functionName: 'Play/Pause',
          process: '● Plug the earbuds inside your ears to start playback and remove both to pause music.\nOR\n● Single tap the CTC on either earbud to play or pause a track',
        },
        {
          id: 'fn-6',
          functionName: 'Previous/Next Track',
          process: '● While playing music, triple tap the left earbud’s CTC to return to the previous track.\n● While playing music, triple tap the right earbud’s CTC to skip to the next track.',
        },
        {
          id: 'fn-7',
          functionName: 'Volume Change',
          process: '● Volume can only be adjusted via phone/media devices',
        },
        {
          id: 'fn-8',
          functionName: 'Voice Assistant',
          process: '● Long press the CTC on either earbud to activate the voice assistant Google/Siri',
        },
        {
          id: 'fn-9',
          functionName: 'Dual EQs',
          process: '● Double tap the left earbud CTC to switch between Dolby Audio and boAt Signature Sound modes.',
        },
        {
          id: 'fn-10',
          functionName: 'BEAST™ Mode',
          process: '● Double tap the right earbud CTC to switch between low latency gaming BEAST™ mode and disable BEAST™ mode',
        },
        {
          id: 'fn-11',
          functionName: 'Connecting with Media Devices – Mono Earbud Usage',
          process: '● Step 1: Please note that both the earbuds can be used in Mono mode. Use Smart Power On for switching on the desired earbud.\n● Step 2: The selected earbud will automatically enter the connection mode.\n● Step 3: Turn on Bluetooth on your phone/media device and search for “Airdopes Prime 800D” to connect.\n\nNote-\n1. Dolby Audio activation tone can be heard in Mono mode, but both earbuds have to be worn for a full sound staging effect.\n2. Please deactivate Dolby Atmos/Dolby Audio/Dirac/third-party Spatial apps to avoid any abnormalities in sound, since Airdopes Prime 800D is already integrated with Dolby Audio.\n● Switch the earbuds on; both the earbuds automatically enter the Connection Mode.',
        },
        {
          id: 'fn-12',
          functionName: 'Connecting with Media Devices – Stereo Earbud Usage',
          process: '● Turn on the Bluetooth functionality on your phone/media device and scan.\n● Search for “Airdopes Prime 800D” and tap on the same for pairing & connect via Bluetooth.\n● To switch to Stereo mode from Mono, simply take out the other earbud from the case. It will automatically power on and pair with the previously selected earbud, hence enabling Stereo usage.',
        },
        {
          id: 'fn-13',
          functionName: 'Factory Reset',
          process: '*NOTE: Before performing a reset, clear "Airdopes Prime 800D" from the pairing device history by forgetting the device.\n\nStep 1: Place the earbuds inside the case in the correct orientation.\nStep 2: While the earbuds are inside the case and case lid is opened, long press the Reset button located on the case for 10 seconds.\n\nAfter a successful factory reset:\n• Red LED blinks quickly 5 times on the Charging Case\n• White LED blinks quickly 5 times on the Earbuds\n\nStep 3: Close the lid and then re-open it again after a few seconds.\nStep 4: Take out the earbuds from the charging case and perform a fresh connection attempt.\n\nCongratulations! Your Airdopes Prime 800D earbuds have been reset.',
        },
        {
          id: 'fn-14',
          functionName: 'In-Ear Detection',
          process: '● Airdopes Prime 800D comes with In-Ear Detection that will help in pausing the media when the earbuds are taken out of the ears. Earmuffs, as per CX’s ear size, are to be used to have an optimal experience of In-Ear detection.\n● This feature can be switched OFF from the boAt Hearables App.',
        },
        {
          id: 'fn-15',
          functionName: 'Multipoint Connectivity',
          process: 'Airdopes Prime 800D can be connected to 2 devices at once. To enable this feature, the following steps are to be taken:\n\nStep 1: Switch on the Bluetooth of your first phone/media device and search for ‘Airdopes Prime 800D’. After the selection is done, the earbuds are paired with your phone/media device.\nStep 2: Turn off the Bluetooth function of your first phone/media device. The earbuds are ready to be paired again.\nStep 3: Now switch on the Bluetooth function on your second phone/media device. Scan and select ‘Airdopes Prime 800D’ to connect.\nStep 4: Switch on the Bluetooth of the first phone/media device again and select ‘Airdopes Prime 800D’ from the list of available devices for pairing. The earbuds are now reconnected to the first phone/media device.\n\nCongratulations! Your earbuds are now connected to both your devices successfully via Bluetooth.',
        },
      ],
    },
  },
  {
    id: 'block-led-3-5',
    sectionNumber: '3.5',
    title: 'Product LED Indications',
    subtitle: '',
    type: 'led_indications',
    archetype: 'table_heavy',
    enabled: true,
    customization: {
      accentColor: '#1e40af',
      showSectionNumber: true,
      tableBorder: true,
      zebraStriping: false,
    },
    content: {
      caseLedIndications: [
        {
          id: 'cled-1',
          scenario: 'Less than 30%',
          chargingState: 'Red LED flashes 3 times rapidly to indicate the battery level and then blinks slowly',
          normalState: 'Red LED blinks 3 times on opening the case lid',
        },
        {
          id: 'cled-2',
          scenario: '30%-99%',
          chargingState: 'White LED flashes 3 times rapidly to indicate the battery level and then blinks slowly',
          normalState: 'White LED blinks 3 times on opening the case lid',
        },
        {
          id: 'cled-3',
          scenario: 'Fully Charged (100%)',
          chargingState: 'White LED remains steady',
          normalState: 'White LED is solid ON for 5 seconds after the charging cable is removed',
        },
      ],
      earbudsLedIndications: [
        { id: 'eled-1', scenario: 'Earbuds – Low battery in it (<30%)', chargingState: 'White LED blinks 3 times when the case lid is opened' },
        { id: 'eled-2', scenario: 'Earbuds – 30-100% charge', chargingState: 'Solid white LED for 3 seconds when the case lid is opened' },
        { id: 'eled-3', scenario: 'Power ON', chargingState: 'White LED flashes for 1 second on opening the case Lid' },
        { id: 'eled-4', scenario: 'Pairing mode', chargingState: 'White LED flashes quickly on the master earbud, and white LED flashes on the slave earbud.' },
        { id: 'eled-5', scenario: 'Pairing successful (1 time indication)', chargingState: 'White LED blinks twice' },
        { id: 'eled-6', scenario: 'If pairing is not successful (In pairing mode)', chargingState: 'If 5 minutes later, pairing is still not successful, then the earbuds will show a solid white light for 1 second and will auto power off' },
        { id: 'eled-7', scenario: 'Connected', chargingState: '● White LED flashes on both earbuds every 20 seconds (3 times in a minute)\n● No LED flash when media is playing' },
        { id: 'eled-8', scenario: 'Disconnected', chargingState: 'The same as pairing mode: White LED flashes quickly on the master earbud, and white LED flashes on the slave earbud.' },
        { id: 'eled-9', scenario: 'Earbuds Charging', chargingState: 'If the battery is less than 30%, the white LED blinks 3 times when the case lid is opened, and if the charge is above 30%, the white LED remains solid ON for 3 seconds when the case lid is opened. The LED should be off when the lid is closed.' },
        { id: 'eled-10', scenario: 'Fully charged', chargingState: 'White LED remains solid on for 3 seconds when the case lid is opened' },
        { id: 'eled-11', scenario: 'Play the music', chargingState: 'All lights are OFF (But "Connected" status will remain)' },
      ],
      factoryResetLed: [
        {
          id: 'rled-1',
          scenario: 'Long press reset button on the charging case for 10 seconds',
          result: '• Red LED blinks quickly 5 times on the charging case\n• White LED blinks quickly 5 times on the earbuds',
        },
      ],
    },
  },
  {
    id: 'block-charging-3-6',
    sectionNumber: '3.6',
    title: 'Charging Procedure and Guidelines',
    subtitle: '',
    type: 'charging_guidelines',
    archetype: 'table_heavy',
    enabled: true,
    customization: {
      accentColor: '#1e40af',
      showSectionNumber: true,
      tableBorder: true,
    },
    content: {
      chargingGuidelines: [
        {
          id: 'cg-1',
          statement: 'Charging the Earbuds',
          information: '● To charge the earbuds, put the earbuds into the charging case in their correct orientation.\n● During charging, the LED on the case blinks as per the case battery percentage. The earbuds\' charging status will be shown after the case\'s charge status.\n● Once the charging is complete, white LED on the case remains solid for 5 seconds.',
        },
        {
          id: 'cg-2',
          statement: 'Charging the Case',
          information: '● To charge the case, plug one end of the cable into the case and connect the other end to a computer, wall adapter, or a power bank.',
        },
        {
          id: 'cg-3',
          statement: 'Charging Norms and Guidelines',
          information: '● Charging through wall adapter – Specs of the adapter: 5V, 2A\n● Charging through cable/wire – Standard cable: 35 strands @0.10mm diameter/strand\n● Any other accessory can be used for charging the earbuds as long as the above norms are followed.',
        },
        {
          id: 'cg-4',
          statement: 'Note-',
          information: '● Before using the earbuds for the first time, it is recommended to fully charge the earbuds as well as the charging case. Also, keep the lid of the charging case closed while charging.',
        },
      ],
    },
  },
  {
    id: 'block-weight-3-7',
    sectionNumber: '4',
    title: 'Product Weight Matrix Details – (D2C & Warranty Tool)',
    subtitle: '',
    type: 'weight_matrix',
    archetype: 'table_heavy',
    enabled: true,
    customization: {
      accentColor: '#1e40af',
      showSectionNumber: true,
      tableBorder: true,
      zebraStriping: false,
    },
    content: {
      weightMatrix: {
        product: 'boAt Airdopes Prime 800D',
        length: '24.9 mm',
        breadth: '20.77 mm',
        height: '32.2 mm',
        earbudsWeight: '4 g per earbud',
        caseWeight: '36 g',
      },
    },
  },
  {
    id: 'block-hearables-4',
    sectionNumber: '5',
    title: 'Hearables App Functions',
    subtitle: '',
    type: 'hearables_app',
    archetype: 'app_showcase',
    enabled: true,
    customization: {
      accentColor: '#1e40af',
      showSectionNumber: true,
      imageDisplayMode: 'grid',
    },
    content: {
      hearablesAppTabs: [
        {
          id: 'tab-1',
          tabName: 'App - Sound Tab',
          mockupType: 'sound',
          accentColor: '#ef4444',
          description: 'Sound settings with Dolby Audio toggle, 5 Preset Equalizers (Balanced, Pop, Rock, Jazz, Club) + Custom EQ, and KuKu FM / JioSaavn integration.',
          features: ['Dolby Audio Switch', 'Equalizer Mode Selector (Balanced, Pop, Rock, Jazz, Club)', 'Streaming Audiobooks / Music Shortcuts'],
        },
        {
          id: 'tab-2',
          tabName: 'App - Touch Tab',
          mockupType: 'touch',
          accentColor: '#3b82f6',
          description: 'Customizable touch gesture mapping for Left and Right Earbud CTC buttons.',
          features: ['1 Tap / 2 Taps / 3 Taps / Long Press Remapping', 'Independent Left and Right Controls', 'Volume, Track, BEAST Mode & Voice Assistant'],
        },
        {
          id: 'tab-3',
          tabName: 'App - System Tab',
          mockupType: 'system',
          accentColor: '#10b981',
          description: 'System features including Multipoint Connectivity, In-Ear Detection, Find My Device, OTA Software Updates, User Manual, and Smart Diagnostics.',
          features: ['Multipoint Connectivity Switch', 'In-Ear Optical Sensor Toggle', 'Firmware Software Update (0.0.0.19)', 'Smart Diagnostics Mode'],
        },
      ],
      hearablesGuideSteps: [
        {
          id: 'hgs-1',
          functionName: 'App Installation',
          process: '● To install the boAt Hearables app, you can follow one of the options mentioned below-\n1. Scan QR Code - Airdopes Prime 800D has the Hearables app QR code printed on the packaging box. Simply scan this code using your smartphone. The subsequent link will redirect you to the Google Play Store and iOS Store, and you can select the applicable option.\n2. Google Play Store - Download the boAt Hearables app from the Google Play Store on your Android smartphone.\n<https://play.google.com/store/apps/details?id=com.boAt.hearables&hl=en_IN&gl=US>\n3. App Store - Download the boAt Hearables app from the App Store on your iOS smartphone.\n<https://apps.apple.com/in/app/boat-hearables/id1592550875>',
        },
        {
          id: 'hgs-2',
          functionName: 'Account Setup',
          process: '● After installing the app, follow the steps shown on the app to set up your account by entering your phone number, name, and email ID. Account setup is a one-time action.',
        },
        {
          id: 'hgs-3',
          functionName: 'Device Pairing',
          process: '● Step 1: Turn on the Bluetooth on your media device.\n● Step 2: Log in to your account on the boAt Hearables app.\n● Step 3: Go to the “My Devices” section.\n● Step 4: Open the case lid and take out the Airdopes Prime 800D. The earbuds will show up under the list of available devices with “Ready to Pair\'\' status. Follow the ‘Pull to refresh’ option on the app if the device does not show up on the list.\n● Step 5: Tap the Airdopes Prime 800D name card and accept the pairing request pop-up notification on your media device.\n● Step 6: Tap the ‘OK’ option on the pairing notification. You can also save Airdopes Prime 800D to your Google account for fast pairing in the future by clicking on “Save” and then “Set up”.\n\nCongratulations! Airdopes Prime 800D is now connected to your media device with “Connected” status.',
        },
        {
          id: 'hgs-4',
          functionName: 'Activating Dolby Audio',
          process: '● Step 1: Pair the Airdopes Prime 800D to your media device by following the pairing process.\n● Step 2: Go to the “Sound” tab on the Hearables app.\n● Step 3: Under the “Dolby Audio” header, activate or deactivate Dolby Audio using the toggle switch.',
        },
        {
          id: 'hgs-5',
          functionName: 'Activating Equalizer',
          process: '● Step 1: Pair the Airdopes Prime 800D to your media device by following the pairing process.\n● Step 2: Go to the “Sound” tab on the Hearables app.\n● Step 3: Under the Sound tab, the “Equalizer” header has all the equalization modes displayed.\n● Step 4: Select the mode of your choice depending on the level of sound elements required-\n1. Tap ‘Balanced’ to experience the sound elements evenly\n2. Tap ‘Pop’ to experience preset Pop EQ mode\n3. Tap ‘Rock’ to experience preset Rock EQ mode\n4. Tap ‘Jazz’ to experience preset Jazz EQ mode\n5. Tap ‘Club’ to experience preset Club EQ mode',
        },
        {
          id: 'hgs-6',
          functionName: 'Customizing Touch Controls',
          process: 'Airdopes Prime 800D lets you customize existing touch functions to another from the list of available options.\n\nLEFT earbud:\n1 Tap:\nExisting Function - Accept incoming calls\nCustomizable Functions - Volume Up, Volume Down, Previous Track, Next Track, Activate/De-activate BEAST™ Mode, Activate Google/Siri Voice Assistant, Activate/Deactivate Dolby Audio\n\n2 Taps:\nExisting Function - Activate/Deactivate Dolby Audio | Reject/Hang Up Calls\nCustomizable Functions - Volume Up, Volume Down, Next Track, Play/Pause audio, Activate/Deactivate BEAST™ Mode, Activate Google/Siri Voice Assistant\n\n3 Taps:\nExisting Function - Return to Previous Track\n\nRIGHT earbud:\n1 Tap:\nExisting Function - Accept incoming calls\nCustomizable Functions - Volume Up, Volume Down, Previous Track, Next Track, Activate/De-activate BEAST™ Mode, Activate Google/Siri Voice Assistant, Activate/Deactivate Dolby Audio\n\n2 Taps:\nExisting Function - Activate/Deactivate BEAST™ Mode | Reject/Hang Up Calls\nCustomizable Functions - Volume Up, Volume Down, Next Track, Play/Pause audio, Activate/Deactivate BEAST™ Mode, Activate Google/Siri Voice Assistant, Activate/Deactivate Dolby Audio\n\n3 Taps:\nExisting Function - Return to Next Track',
        },
        {
          id: 'hgs-7',
          functionName: 'Activating In-Ear Detection',
          process: '● Step 1: Pair the Airdopes Prime 800D to your media device by following the pairing process.\n● Step 2: Go to the “System” tab on the Hearables app.\n● Step 3: Under the System tab, slide the “In-Ear Detection” toggle to the OFF state to deactivate in-ear detection. Slide the toggle once again to ON for activating in-ear detection.\n\nNote - By default, In-Ear detection remains ON in Airdopes Prime 800D.',
        },
        {
          id: 'hgs-8',
          functionName: 'Activating Multipoint Connectivity',
          process: '● Step 1: Pair the Airdopes Prime 800D to your media device by following the pairing process.\n● Step 2: Go to the “System” tab on the Hearables app.\n● Step 3: Multipoint connectivity remains ON by default for keeping Airdopes Prime 800D connected to two media devices at the same time. Under the System tab, slide the “Multipoint Connectivity” toggle to the OFF state to deactivate the multipoint connection. Slide the toggle once again to ON to activate multipoint connection.\n\nNote: By default, Multipoint connectivity remains ON in Airdopes Prime 800D.',
        },
        {
          id: 'hgs-9',
          functionName: 'Installing Software Updates',
          process: '● Step 1: Pair the Airdopes Prime 800D to your media device by following the pairing process.\n● Step 2: Go to the “System” tab on the Hearables app.\n● Step 3: Tap the “Check For Updates” option under the “Software Update” header to check and update Airdopes Prime 800D to the latest firmware version, if available.\n\nNote - If the product is updated to the latest available version, the app will show an alert on clicking the option -‘You already have the latest firmware version’.',
        },
        {
          id: 'hgs-10',
          functionName: 'Factory Reset',
          process: '● Step 1: To reset Airdopes Prime 800D from your device, go to the Troubleshooting section “?” on the Hearables app.\n● Step 2: Next, tap the “Malfunctioning” sub-header in the Troubleshooting section.\n● Step 3: Click on the option “Reset My Device” to reset the earbuds.\n\nCongratulations! Your Airdopes Prime 800D has been reset.\n\nAirdopes Prime 800D will now show as “Ready to Pair” in the My Devices section. Follow the pairing procedure to connect the earbuds to your device.',
        },
        {
          id: 'hgs-11',
          functionName: 'Smart Diagnostics Mode',
          process: 'To diagnose issues related to Bluetooth connectivity, mic, speaker, and battery, use the Smart Diagnostics function of the Hearables app.\n● Step 1: Tap the “Diagnose My Device” option at the bottom.\n● Step 2: Follow the instructions to start the smart diagnostics process.\n● Step 3: Click on “Let’s Go” to start.\n● Step 4: Complete all the steps one by one to check Bluetooth connectivity, mic, speaker, and battery functions.\n● Step 5: Click on ‘Done’ to finish diagnostics.',
        },
      ],
    },
  },
  {
    id: 'block-diagnostics-5',
    sectionNumber: '6',
    title: 'Service Details',
    subtitle: '',
    type: 'diagnostics_troubleshooting',
    archetype: 'troubleshooting',
    enabled: true,
    customization: {
      accentColor: '#1e40af',
      showSectionNumber: true,
      tableBorder: true,
      zebraStriping: false,
    },
    content: {
      serviceChannels: [
        { id: 'sc-1', channelName: 'boAt Airdopes Prime 800D', details: '1) Door-to-Door Replacement Service (D2D)\n2) MSC Replacement Service (Walk-In)' },
      ],
      troubleshootingItems: [
        {
          id: 'tb-1',
          category: '',
          issue: 'Earbuds not connecting via Bluetooth',
          instructions: [
            'Check to see if the device is in pairing mode, indicated by white LED flashes quickly on the master earbud and white LED flashes on the slave earbud.',
            'Check if the device is in the range of Bluetooth (usually 12m) and if there are any obstructions in between.',
            'Check to see if the device being connected to supports Bluetooth connection.',
            'Check if it is a passcode issue, and if so, enter ‘0000’.',
            'Check to see if the device being connected to does not have any software issues – check to forget the device on Bluetooth, update the mobile software, and if it still does not work, try factory resetting the device.',
            'Check if the pogo pins in the charging case and both earbuds are clean. You may do so by gently cleaning them using a cotton swab dipped in alcohol, and try using them again.',
          ],
          finalResolution: 'If nothing else works and there is no physical damage, send the device for replacement.',
          appDiagnosticsNote: 'Run the Smart Diagnostics function of the boAt Hearables app and check whether there are issues related to Bluetooth connectivity. Please note that the Smart Diagnostics function in the app can only identify issues related to the firmware and not the hardware.',
        },
        {
          id: 'tb-2',
          category: '',
          issue: 'Earbuds not showing in “My Devices” on the Hearables app',
          instructions: [
            'Check to see if the device is in pairing mode, indicated by white LED flashes quickly on the master earbud and white LED flashes on the slave earbud.',
            'Check whether the boAt Hearables app on the media device is updated to the latest version. The app version can be checked from the Google Play Store for Android smartphones and from the App Store for iOS smartphones.',
            'Check whether the case lid is open, and the earbuds have been taken out.',
            'Check if the earbuds are in the range of the media device’s Bluetooth (usually 10m) and if there are any obstructions in between.',
            'Check to see if the media device being connected to supports Bluetooth connections.',
            'Check if the Bluetooth of the media device is turned ON.',
            'Check to see if the device being connected to has no software issues.',
            'Check to forget the earbuds from the device’s Bluetooth paired list, update the mobile software, and if it still does not work, try factory resetting the product.',
            'Check whether closing the app and opening it again solves the issue.',
          ],
          finalResolution: 'If nothing else works and there is no physical damage, send the device for replacement.',
        },
        {
          id: 'tb-3',
          category: '',
          issue: 'Charging case is not charging',
          instructions: [
            'Check to see if the wire connected to the case is not broken. Use other wires and also ensure that the charger being used is not of 9V or 12V, as that will damage the case.',
            'To charge the case, plug one end of the provided cable into the case and connect the other end to a computer or a wall adapter.\n\nNote: The LED located at the bottom of the charging case indicates the battery status of the case. Red LED flashes 3 times when the battery level is less than 30%, white LED flashes 3 times when the battery level is between 30-99%, white LED is solid ON when the battery level is more than 100%, and the white LED stays solid on for 5 seconds to indicate a full charge.',
          ],
          finalResolution: 'If nothing else works and there is no physical damage, send the device for replacement',
        },
        {
          id: 'tb-4',
          category: '',
          issue: 'Earbuds are not charging',
          instructions: [
            'Check to see if the earbuds have been put inside the case in the right orientation.',
            'Check to see if the earbuds are completely charged or not.',
            'Once the earbuds have been completely charged, the LED on the case flashes blue for 5 seconds.',
            'Check if the pogo pins in the charging case and both earbuds are clean. You may do so by gently cleaning them using a cotton swab dipped in alcohol, and try using them again.',
          ],
          finalResolution: 'If nothing else works, and there is no physical damage, send the device for replacement',
          appDiagnosticsNote: 'Run the Smart Diagnostics function of the boAt Hearables app and check whether there are issues related to the earbud battery. Please note that the Smart Diagnostics function in the app can only identify issues related to the firmware and not the hardware.',
        },
        {
          id: 'tb-5',
          category: '',
          issue: 'Device not entering Stereo Mode/ stuck in Mono Mode',
          instructions: [
            'Check when both the earbuds are taken out of the charging case. The earbuds will enter Pairing Mode, indicated by white LED flashes quickly on the master earbud and white LED flashes on the slave earbud.',
            'Place the earbuds in the charging case and then try using them again. Check if it connects automatically.',
            'Check and see if factory resetting the device works.',
            'Check if the pogo pins in the charging case and both earbuds are clean. You may do so by gently cleaning them using a cotton swab dipped in alcohol, and try using them again.',
          ],
          finalResolution: 'If nothing else works, and there is no physical damage, send the device for replacement',
        },
        {
          id: 'tb-6',
          category: '',
          issue: 'The sound is distorted/low volume/low bass/low quality',
          instructions: [
            'Check if the connected device does not have any equalizer settings applied.',
            'Check if Dolby Atmos/Dolby Audio/Dirac/third-party EQ apps are deactivated in the connected device to avoid any sound abnormalities.',
            'Check if the problem still occurs if the device is moved closer and all obstacles in the middle are removed.',
            'Check if the distortion of sound occurs at all volumes or only at high volumes.',
            'Check with different media players and different devices, and whether the distortion happens on all devices or only on specific ones.',
            'Check if the problem occurs at all levels of charging or only at low charging levels.',
            'Check if the earbuds do not have water droplets. In case they do, use a blow dryer from a distance to dry out any water.',
            'Check if the earbuds are clogged with earwax or dirt. If yes, simply clean the earbuds with a cotton swab dipped in alcohol to resolve the issue.',
          ],
          finalResolution: 'If nothing else works, and there is no physical damage, send the device for replacement',
          appDiagnosticsNote: 'Run the Smart Diagnostics function of the boAt Hearables app and check whether there are any speaker-related issues. Please note that the Smart Diagnostics function in the app can only identify issues related to the firmware and not the hardware.',
        },
        {
          id: 'tb-7',
          category: '',
          issue: 'Earbuds not turning on',
          instructions: [
            'Check to see if the device has been properly charged first- a solid white LED on the case for 3 seconds will indicate that they are fully charged.',
            'Check if the voltage of the charger is correct for the charging case and if the lights on the bottom of the case are glowing to indicate the charge level.',
            'Check by opening the lid of the charging case (with the earbuds inside) to power on the earbuds. The white LED should flash for 1 second.',
            'Check if the product was not subjected to any mishandling, broken wires, or exposed to direct sunlight, or hazards like fire.',
          ],
          finalResolution: 'If nothing else works and there is no physical damage, send the device for replacement',
        },
        {
          id: 'tb-8',
          category: '',
          issue: 'The in-built controls of the product are not working',
          instructions: [
            'Check if the controls do not work while being connected to another device.',
            'Check if the media player being used supports such controls and if the controls do not function on call or with other media players.',
            'Check if the controls have been physically damaged or exposed to any hazards.',
          ],
          finalResolution: 'If nothing else works and there is no physical damage, send the device for replacement',
        },
        {
          id: 'tb-9',
          category: '',
          issue: 'Occasional disconnects/ one of the earbuds keeps disconnecting',
          instructions: [
            'Check if restarting the device resolves the issue.',
            'Check if the same problem happens for different devices and media players.',
            'Check if there are any obstructions between the earbuds and the device, and clear them. Move the device at a closer range to the earbuds and see if this still affects it.',
            'Try factory-resetting the device.',
          ],
          finalResolution: 'If nothing else works and there is no physical damage, send the device for replacement',
        },
        {
          id: 'tb-10',
          category: '',
          issue: 'If there are other exceptions in the usage of the product',
          instructions: [
            'Check if restarting the device resolves the issue.',
            'Place the earbuds in the charging case and try using them again.',
            'Try factory-resetting the device.',
          ],
          finalResolution: 'If nothing else works and there is no physical damage, send the device for replacement.',
        },
        {
          id: 'tb-11',
          category: '',
          issue: 'The sound output is muffled',
          instructions: [
            'Check if dust has accumulated inside the earbuds or if there is any obstruction.',
            'Check if earwax has accumulated inside the earbuds.',
            'Check if there is no damage to the tips of the earbuds and see if changing them helps.',
            'Check if sweat or water has gone inside the earbuds.',
          ],
          finalResolution: 'If nothing else works and there is no physical damage, send the device for replacement.',
          appDiagnosticsNote: 'Run the Smart Diagnostics function of the boAt Hearables app and check whether there are speaker issues. Please note that the Smart Diagnostics function in the app can only identify issues related to the firmware and not the hardware.',
        },
        {
          id: 'tb-12',
          category: 'App',
          issue: 'How to check on the Hearables app whether the earbuds are connected or not?',
          instructions: [
            'The boAt Hearables app shows all currently and previously paired devices in the ‘My Devices’ section.',
            'Once the Airdopes Prime 800D is paired to your smartphone, the status gets changed to “Connected” in the thumbnail.',
            'Tap the thumbnail to check whether both the left and right earbuds are connected or not. You can also check the battery level of both earbuds.',
          ],
          finalResolution: 'Not Applicable',
        },
        {
          id: 'tb-13',
          category: 'App',
          issue: 'Can I access the product manual on the Hearables app?',
          instructions: [
            'You can view the product’s manual under the “System” tab of the Hearables app. Go to the ‘User Manual’ section and tap ‘Know More’ to access the user manual.',
          ],
          finalResolution: 'Not Applicable',
        },
        {
          id: 'tb-14',
          category: '',
          issue: 'What is Insta Wake N’ Pair (IWP™) technology?',
          instructions: [
            'Our IWP™ technology allows the earbuds to connect to your phone instantaneously upon opening the case if they have already been paired before.',
            'Simply open the case and ensure that the Bluetooth is turned on for your media device. The earbuds will connect as soon as the case is opened without the need to take them out of the case first.',
          ],
          finalResolution: 'Not Applicable',
        },
        {
          id: 'tb-15',
          category: '',
          issue: 'How to enable IWP™ for my earbuds?',
          instructions: [
            'There is no special process to enable IWP™- simply follow the steps to first pair your Airdopes Prime 800D to your media device. Then, upon subsequent usage, the IWP™ tech will be enabled, and the earbuds will pair automatically to your previously paired media device if Bluetooth is turned on in your media device.',
          ],
          finalResolution: 'Not Applicable',
        },
        {
          id: 'tb-16',
          category: '',
          issue: 'IWP™ is not working for my earbuds',
          instructions: [
            'Check if your earbuds model has IWP™ tech integrated.',
            'Make sure that you have paired the earbuds at least once before to the device you are trying to use IWP™ with.',
            'Check if Bluetooth is turned on for your media device and if it has Airdopes Prime 800D in the list of paired devices.',
            'Try factory-resetting the device.',
          ],
          finalResolution: 'If IWP™ is not working and there is no physical damage, send the device for replacement',
        },
        {
          id: 'tb-17',
          category: 'App',
          issue: 'How to enable In-Ear Detection for my earbuds?',
          instructions: [
            'In-ear detection is enabled by default on Airdopes Prime 800D.',
            'You can use the boAt Hearables app to turn off or re-activate in-ear detection for your earbuds.',
          ],
          finalResolution: 'Not Applicable',
        },
        {
          id: 'tb-18',
          category: '',
          issue: 'Voice is muffled during calls/ Microphone has muffled input',
          instructions: [
            'Check if restarting the device resolves the issue.',
            'Check if dust or earwax has accumulated near or inside the microphone port, and if there is no blockage on the microphone.',
            'Check if sweat or water has gone inside the microphone.',
            'Check if there are any obstructions between the earbuds and the device, and clear them. Move the device at a closer range to the earbud and see if the connection is still affected.',
          ],
          finalResolution: 'If nothing else works and there is no liquid and physical damage, send the device for replacement',
          appDiagnosticsNote: 'Run the Smart Diagnostics function of the boAt Hearables app and check whether there are issues related to the earbud mic. Please note that the Smart Diagnostics function in the app can only identify issues related to the firmware and not the hardware.',
        },
        {
          id: 'tb-19',
          category: '',
          issue: 'Earbud not charging while inside the case, even when the case is charged',
          instructions: [
            'Check if the charging pins of the case are clear and there is no obstruction.',
            'Check if the charging pins of the earbuds are clear and there is no obstruction.',
            'Check if the orientation of the earbuds inside the case is correct and if they have been properly inserted inside the case.',
            'Check if the pogo pins are clean. You may do so by gently cleaning them using a cotton swab dipped in alcohol.',
          ],
          finalResolution: 'If nothing else works and there is no liquid and physical damage, send the device for replacement',
        },
        {
          id: 'tb-20',
          category: '',
          issue: 'Can I lower the volume of the voice prompts/turn them off?',
          instructions: [
            'No, the voice prompts are integrated inside the earbuds, and there is no provision to turn them off or lower their volume.',
          ],
          finalResolution: 'Not Applicable',
        },
        {
          id: 'tb-21',
          category: '',
          issue: 'Can I control the volume of the earbuds through integrated controls?',
          instructions: [
            'No, the earbuds do not have any integrated volume controls on them. The volume has to be controlled using your connected Bluetooth device.',
            'Ensure that in the Bluetooth settings of your media device, you have enabled syncing of Bluetooth and phone volume levels; otherwise, you may not be able to fully control the volume of the earbuds as intended.',
          ],
          finalResolution: 'Not Applicable',
        },
        {
          id: 'tb-22',
          category: '',
          issue: 'Can I submerge my earbuds in the water/swim with them?',
          instructions: [
            'While your earbuds do have IPX5 water and sweat resistance, it is recommended that they are not submerged inside water directly or used for prolonged periods inside water, such as for swimming/showers, as it may lead to damage.',
          ],
          finalResolution: 'Not Applicable',
        },
        {
          id: 'tb-23',
          category: '',
          issue: 'Does Airdopes Prime 800D support aptX codec by Qualcomm?',
          instructions: [
            'No, it does not.',
          ],
          finalResolution: 'Not Applicable',
        },
        {
          id: 'tb-24',
          category: '',
          issue: 'Does Airdopes Prime 800D have cVc technology by Qualcomm?',
          instructions: [
            'No, it does not.',
          ],
          finalResolution: 'Not Applicable',
        },
        {
          id: 'tb-25',
          category: '',
          issue: 'Does my device have dual microphones?',
          instructions: [
            'Yes, it does.',
          ],
          finalResolution: 'Not Applicable',
        },
        {
          id: 'tb-26',
          category: '',
          issue: 'Does my device support low latency for gaming?',
          instructions: [
            'Airdopes Prime 800D does support 45 ms low latency for entertainment and casual gaming. But if you’re looking for professional gaming equipment, then Airdopes Prime 800D is not the right product.',
          ],
          finalResolution: 'Not Applicable',
        },
        {
          id: 'tb-27',
          category: '',
          issue: 'Does my device have AI-Environmental Noise Cancellation technology?',
          instructions: [
            'Yes, it does.',
          ],
          finalResolution: 'Not Applicable',
        },
        {
          id: 'tb-28',
          category: '',
          issue: 'Does my device have an ANC feature?',
          instructions: [
            'No, it does not.',
          ],
          finalResolution: 'Not Applicable',
        },
      ],
    },
  },
  {
    id: 'block-codes-6',
    sectionNumber: '7',
    title: 'ASIN/FSN Codes of boAt Airdopes Prime 800D – (Return Tool)',
    subtitle: '',
    type: 'return_codes',
    archetype: 'table_heavy',
    enabled: true,
    customization: {
      accentColor: '#1e40af',
      showSectionNumber: true,
      tableBorder: true,
      zebraStriping: false,
    },
    content: {
      returnCodes: [
        { id: 'rc-1', productDesc: 'Airdopes Prime 800D – Raven Black', ean: '8905650132113', asin: '', fsn: '' },
        { id: 'rc-2', productDesc: 'Airdopes Prime 800D – Swedish White', ean: '8905650132120', asin: '', fsn: '' },
        { id: 'rc-3', productDesc: 'Airdopes Prime 800D – Royal Blue', ean: '8905650132151', asin: '', fsn: '' },
      ],
    },
  },
  {
    id: 'block-annexure-7',
    sectionNumber: '8',
    title: 'Annexure',
    subtitle: 'Testing service SOP & videos, and tutorial video links',
    type: 'annexure',
    archetype: 'table_heavy',
    enabled: true,
    customization: {
      accentColor: '#1e40af',
      showSectionNumber: true,
      tableBorder: true,
      zebraStriping: false,
    },
    content: {
      annexureTestingSop: 'Detailed testing protocols for repair centers: 1. Visual & Physical Inspection; 2. Pogo pin impedance (<0.5Ω); 3. Frequency sweep 20Hz-20kHz; 4. RF range test (10m).',
      annexureTutorialLinks: 'https://service-portal.internal.com/training/neo-anc',
      annexureItems: [
        {
          id: 'ann-1',
          category: 'QA Testing',
          sopTitle: 'Testing Service Testing SOP & Videos Link',
          protocols: '● Step 1: Visual and cosmetic casing inspection for hairline cracks or water ingress markers.\n● Step 2: Battery terminal voltage verification across charging cradle and earbud pogo pins.\n● Step 3: Audio spectrum sweep and ANC microphone sensitivity calibration test.\n● Step 4: Bluetooth multi-device reconnect speed and 10-meter range validation.',
          resourceLink: 'https://service-portal.internal.com/training/neo-anc',
        },
        {
          id: 'ann-2',
          category: 'Tutorial Video',
          sopTitle: 'Tutorial Video Link on YouTube',
          protocols: 'Complete technical video walkthrough illustrating charging case disassembly, ultrasonic cleaning of acoustic mesh filters, and battery replacement SOP.',
          resourceLink: 'https://service-portal.internal.com/training/neo-anc',
        },
      ],
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// boAt Airdopes 141 (Gen 3) — Non-SDK reference plan (per SDK Content Reference PDF)
// ─────────────────────────────────────────────────────────────────────────────
export const boatAirdopes141Blocks: ServicePlanBlock[] = [
  {
    id: 'b141-header-1',
    sectionNumber: '1',
    title: 'Product Specification Document for boAt Airdopes 141 (Gen 3)',
    subtitle: '',
    type: 'header_overview',
    archetype: 'text_heavy',
    enabled: true,
    customization: {
      accentColor: '#1e40af',
      showSectionNumber: true,
      layoutStyle: 'compact',
      showNote: false,
    },
    content: {
      objective: 'To understand the complete product details and technical diagnostic guidelines for a new product, which will help the service team build a detailed service plan.',
      documentOwner: 'Product Manager',
      featureHighlights: [
        'Total Playtime 50 Hours',
        'Quad Mics with ENx™ Technology',
        'Dual EQs (Signature Sound/Balanced Mode)',
        'BEAST™ Mode',
        '10 Mins ASAP™ Charge = 120 Mins Playtime',
        'IWP™ Technology',
        'Bluetooth v5.3',
        'IPX4 Splash and Sweat Shield',
        'Type-C Charging Interface',
        'Dual Tone Colours',
      ],
    },
  },
  {
    id: 'b141-definitions-2',
    sectionNumber: '2',
    title: 'Technical Definitions',
    subtitle: '',
    type: 'technical_definitions',
    archetype: 'table_heavy',
    enabled: true,
    customization: {
      accentColor: '#1e40af',
      showSectionNumber: true,
      tableBorder: true,
      zebraStriping: false,
    },
    content: {
      definitions: [
        { id: 'def141-1', term: 'TWS', definition: 'True Wireless Stereo' },
        { id: 'def141-2', term: 'IPX4', definition: 'Water Splash Protection Certified' },
        { id: 'def141-3', term: 'MSC', definition: 'Multi-Brand Service Centre' },
        { id: 'def141-4', term: 'D2D', definition: 'Door-to-Door Replacement Service' },
        { id: 'def141-5', term: 'CTC', definition: 'Capacitive Touch Control' },
        { id: 'def141-6', term: 'DUT', definition: 'Device Under Testing' },
      ],
    },
  },
  {
    id: 'b141-specs-3-1',
    sectionNumber: '3.1',
    title: 'Product Specifications',
    subtitle: '',
    type: 'specifications_table',
    archetype: 'table_heavy',
    enabled: true,
    customization: {
      accentColor: '#1e40af',
      showSectionNumber: true,
      tableBorder: true,
      zebraStriping: false,
      showNote: true,
      noteTitle: 'Note',
      noteText: 'Music playtime of 50 hrs per charge is based on listening to music at 60% volume. Listening to music/audio files at more than 60% volume will reduce the playtime.',
    },
    content: {
      specifications: [
        { id: 'sp141-1', key: 'Headphone Type', value: 'TWS' },
        { id: 'sp141-2', key: 'Bluetooth Version', value: '5.3' },
        { id: 'sp141-3', key: 'Music Playtime', value: 'Up to 50 hours (at 60% volume)' },
        { id: 'sp141-4', key: 'Number of ENx™ Equipped Mics', value: '4' },
        { id: 'sp141-5', key: 'IWP™ Tech', value: 'Yes' },
        { id: 'sp141-6', key: 'BEAST™ Mode', value: 'Yes, 50 ms Low Latency' },
        { id: 'sp141-7', key: 'Transmission Range', value: '10 m' },
        { id: 'sp141-8', key: 'Driver Size', value: '13 mm*2' },
        { id: 'sp141-9', key: 'Supported Codec', value: 'AAC/SBC' },
        { id: 'sp141-10', key: 'Frequency', value: '20 Hz-20 kHz' },
        { id: 'sp141-11', key: 'Battery', value: '650 mAh (Case); 40 mAh*2 (Earbuds)' },
        { id: 'sp141-12', key: 'ASAP™ Charge', value: 'Yes; 10 mins charge = 120 mins playtime' },
        { id: 'sp141-13', key: 'Charging Time', value: '40 mins (Earbuds); 1.5 hours (Case)' },
        { id: 'sp141-14', key: 'Charging Interface', value: 'USB Type-C' },
        { id: 'sp141-15', key: 'Water Resistance', value: 'IPX4' },
      ],
    },
  },
  {
    id: 'b141-packaging-3-2',
    sectionNumber: '3.2',
    title: 'Packaging Contents',
    subtitle: '',
    type: 'packaging_contents',
    archetype: 'text_heavy',
    enabled: true,
    customization: {
      accentColor: '#1e40af',
      showSectionNumber: true,
      layoutStyle: 'compact',
    },
    content: {
      packagingList: [
        '1 X boAt Airdopes 141',
        '1 X Type-C Cable',
        '1 X User Guide',
        '2 X Pairs of Additional Earmuffs',
      ],
    },
  },
  {
    id: 'b141-variants-3-3',
    sectionNumber: '3.3',
    title: 'Colour Variants',
    subtitle: '',
    type: 'colour_variants',
    archetype: 'image_heavy',
    enabled: true,
    customization: {
      accentColor: '#1e40af',
      showSectionNumber: true,
      imageDisplayMode: 'grid',
    },
    content: {
      colourVariants: [
        {
          id: 'cv141-1',
          name: 'Matte Charcoal',
          colorHex: '#1f2937',
          secondaryHex: '#111827',
          imageDesc: 'Matte charcoal black dual-tone finish with boAt branding.',
          isSmartVariant: false,
        },
        {
          id: 'cv141-2',
          name: 'Lavender Bloom',
          colorHex: '#a5b4fc',
          secondaryHex: '#818cf8',
          imageDesc: 'Soft lavender bloom dual-tone finish.',
          isSmartVariant: false,
        },
        {
          id: 'cv141-3',
          name: 'Lime White',
          colorHex: '#f8fafc',
          secondaryHex: '#d9f99d',
          imageDesc: 'Lime white dual-tone finish with lime green accents.',
          isSmartVariant: false,
        },
      ],
    },
  },
  {
    id: 'b141-functionalities-3-4',
    sectionNumber: '3.4',
    title: 'Product Functionalities',
    subtitle: '',
    type: 'product_functionalities',
    archetype: 'matrix_step',
    enabled: true,
    customization: {
      accentColor: '#1e40af',
      showSectionNumber: true,
      tableBorder: true,
      zebraStriping: false,
    },
    content: {
      functionalities: [
        {
          id: 'fn141-1',
          functionName: 'Power On',
          process: 'Smart Power On:\n● To automatically switch the earbuds on, simply open the lid of the charging case when the earbuds are kept inside.\n\nManual Power On\n● Long press the CTC on either earbud for 3 seconds to manually power on the earbuds',
        },
        {
          id: 'fn141-2',
          functionName: 'Power Off',
          process: 'Smart Power Off:\nStep 1: After usage, remove both earbuds from your ears.\nStep 2: Place the earbuds back into the charging case in the correct orientation and close the case lid.\nStep 3: The earbuds will automatically switch off (and enter into charging mode).\n\nManual Power Off\n● Long press the CTC on either earbud for 5 seconds to manually power off the earbuds',
        },
        {
          id: 'fn141-3',
          functionName: 'Answer Call',
          process: '● Single tap the CTC on either earbud to answer an incoming call.',
        },
        {
          id: 'fn141-4',
          functionName: 'Reject/ End Call',
          process: '● Double tap either earbud’s CTC to reject an incoming call or end an ongoing call.',
        },
        {
          id: 'fn141-5',
          functionName: 'Play/Pause',
          process: '● Single tap the CTC on either earbud to play or pause a track',
        },
        {
          id: 'fn141-6',
          functionName: 'Previous/Next Track',
          process: '● While playing music, double tap the left earbud’s CTC to return to the previous track.\n● While playing music, double tap the right earbud’s CTC to skip to the next track.',
        },
        {
          id: 'fn141-7',
          functionName: 'Volume Change',
          process: '● Volume can only be adjusted via phone/media devices',
        },
        {
          id: 'fn141-8',
          functionName: 'Voice Assistant',
          process: '● NA',
        },
        {
          id: 'fn141-9',
          functionName: 'Dual EQ',
          process: '● Long touch the CTC on the left earbud for 3 seconds to switch to Balanced EQ Mode. Long touch the left earbud CTC again for 3 seconds to switch to boAt Signature Sound.',
        },
        {
          id: 'fn141-10',
          functionName: 'BEAST™ Mode',
          process: '● Long touch the CTC on the right earbud for 3 seconds to activate BEAST™ Mode. Long touch the right earbud CTC again for 3 seconds to deactivate BEAST™ Mode',
        },
        {
          id: 'fn141-11',
          functionName: 'Connecting with Media Devices – Mono Earbud Usage',
          process: '● Step 1: Please note that both the earbuds can be used in Mono mode. Use Smart Power On for switching on the desired earbud.\n● Step 2: The selected earbud will automatically enter the connection mode.\n● Step 3: Turn on Bluetooth on your phone/media device and search for “Airdopes 141” to connect.\n\nNote-\n● You can only skip to the next track while using the right earbud or play the previous track using the left earbud in Mono (single earbud) mode.',
        },
        {
          id: 'fn141-12',
          functionName: 'Connecting with Media Devices – Stereo Earbud Usage',
          process: '● Switch the earbuds on; both the earbuds automatically enter the Connection Mode.\n● Turn on the Bluetooth functionality on your phone/media device and scan.\n● Search for “Airdopes 141” and tap on the same for pairing & connect via Bluetooth.\n● To switch to Stereo mode from Mono, simply take out the other earbud from the case. It will automatically power on and pair with the previously selected earbud, hence enabling Stereo usage.',
        },
        {
          id: 'fn141-13',
          functionName: 'Factory Reset',
          process: '*NOTE: Before performing a reset, clear "Airdopes 141" from pairing device history by forgetting the device.\n\nStep 1: Long press the CTC on both earbuds for 5 seconds while in pairing mode to perform a reset.\n\nAfter a successful factory reset:\n• Blue LED blinks 5 times followed by Red LED blinking once\n\nNOTE: The case enters sleep mode automatically after 15 minutes when the lid is kept open. Please make sure to close the case lid and open it again, with both earbuds placed inside, to perform a factory reset.\n\nCongratulations! Your Airdopes 141 earbuds have been reset.',
        },
      ],
    },
  },
  {
    id: 'b141-led-3-5',
    sectionNumber: '3.5',
    title: 'Product LED Indications',
    subtitle: '',
    type: 'led_indications',
    archetype: 'table_heavy',
    enabled: true,
    customization: {
      accentColor: '#1e40af',
      showSectionNumber: true,
      tableBorder: true,
      zebraStriping: false,
    },
    content: {
      caseLedIndications: [
        {
          id: 'cled141-1',
          scenario: 'Low battery (<20%)',
          chargingState: 'Blue LED blinks 4 times',
          normalState: 'Blue LED blinks 4 times on opening the case lid',
        },
        {
          id: 'cled141-2',
          scenario: 'On charging',
          chargingState: 'Blue LED blinks continuously',
          normalState: '—',
        },
        {
          id: 'cled141-3',
          scenario: 'Fully charged (100%)',
          chargingState: 'Blue LED remains solid on',
          normalState: '—',
        },
        {
          id: 'cled141-4',
          scenario: 'Earbuds charging from the case (lid closed)',
          chargingState: 'Blue LED blinks 4 times',
          normalState: 'LED remains off once both earbuds are charged',
        },
      ],
      earbudsLedIndications: [
        { id: 'eled141-1', scenario: 'Earbuds – Low battery in it (<20%)', chargingState: 'Red LED blinks 3 times (Blinks every 30 seconds)' },
        { id: 'eled141-2', scenario: 'Power ON', chargingState: 'Blue LED is ON for 2 seconds upon opening the lid or manually powering on' },
        { id: 'eled141-3', scenario: 'Power OFF', chargingState: 'Red LED is on for 1 second when powered off' },
        { id: 'eled141-4', scenario: 'Pairing mode', chargingState: '● Alternate red and blue LED flashes on the master earbud.\n● Slave earbud blinks blue LED every 5 seconds' },
        { id: 'eled141-5', scenario: 'Pairing successful (1-time indication)', chargingState: 'Solid blue LED remains on for 3 seconds' },
        { id: 'eled141-6', scenario: 'If pairing is not successful (In pairing mode)', chargingState: 'Same as pairing mode. Alternate red and blue LED flashes on the master earbud.\nSlave earbud blinks blue LED every 5 seconds.' },
        { id: 'eled141-7', scenario: 'Connected', chargingState: '● Blue LED on both earbuds will flash once every 20 seconds\n● No LED flash when media is playing' },
        { id: 'eled141-8', scenario: 'Disconnected', chargingState: 'Same as Pairing mode\n● Alternate red and blue LED flashes on the master earbud.\n● Slave earbud blinks blue LED every 5 seconds' },
        { id: 'eled141-9', scenario: 'Earbuds Charging', chargingState: 'Red LED stays ON for 2 seconds when the case lid is closed.' },
        { id: 'eled141-10', scenario: 'Fully charged', chargingState: 'The LED turns off' },
        { id: 'eled141-11', scenario: 'Play the music', chargingState: 'All lights are OFF (But "Connected" status will remain)' },
      ],
      factoryResetLed: [
        {
          id: 'rled141-1',
          scenario: 'Long press the CTC on both earbuds for 5 seconds while in pairing mode',
          result: '• Blue LED blinks 5 times followed by Red LED blinking once',
        },
      ],
    },
  },
  {
    id: 'b141-charging-3-6',
    sectionNumber: '3.6',
    title: 'Charging Procedures and Guidelines',
    subtitle: '',
    type: 'charging_guidelines',
    archetype: 'table_heavy',
    enabled: true,
    customization: {
      accentColor: '#1e40af',
      showSectionNumber: true,
      tableBorder: true,
    },
    content: {
      chargingGuidelines: [
        {
          id: 'cg141-1',
          statement: 'Charging the Case',
          information: '● To charge the case, plug one end of the cable into the case and connect the other end to a computer, wall adapter, or a power bank.',
        },
        {
          id: 'cg141-2',
          statement: 'Charging Norms and Guidelines',
          information: '● Charging through wall adapter – Specs of the adapter: 5V, 2A\n● Charging through cable/wire – Standard cable: 35 strands @0.10mm diameter/strand\n● Any other accessory can be used for charging the earbuds as long as the above norms are followed.',
        },
        {
          id: 'cg141-3',
          statement: 'Note-',
          information: '● Before using the earbuds for the first time, it is recommended to fully charge the earbuds as well as the charging case. Also, keep the lid of the charging case closed while charging.',
        },
      ],
    },
  },
  {
    id: 'b141-weight-4',
    sectionNumber: '4',
    title: 'Product Weight Matrix Details – (D2C & Warranty Tool)',
    subtitle: '',
    type: 'weight_matrix',
    archetype: 'table_heavy',
    enabled: true,
    customization: {
      accentColor: '#1e40af',
      showSectionNumber: true,
      tableBorder: true,
      zebraStriping: false,
    },
    content: {
      weightMatrix: {
        product: 'boAt Airdopes 141',
        length: '31.92 mm',
        breadth: '21.55 mm',
        height: '24.97 mm',
        earbudsWeight: '4 g per earbud',
        caseWeight: '36 g',
      },
    },
  },
  {
    id: 'b141-hearables-5',
    sectionNumber: '5',
    title: 'Hearables App Functionalities',
    subtitle: '',
    type: 'hearables_app',
    archetype: 'app_showcase',
    enabled: true,
    customization: {
      accentColor: '#1e40af',
      showSectionNumber: true,
      imageDisplayMode: 'grid',
    },
    content: JSON.parse(JSON.stringify(HEARABLES_CONTENT_NON_SDK)),
  },
  {
    id: 'b141-diagnostics-6',
    sectionNumber: '6',
    title: 'Service Details',
    subtitle: '',
    type: 'diagnostics_troubleshooting',
    archetype: 'troubleshooting',
    enabled: true,
    customization: {
      accentColor: '#1e40af',
      showSectionNumber: true,
      tableBorder: true,
      zebraStriping: false,
    },
    content: {
      serviceChannels: [
        { id: 'sc141-1', channelName: 'boAt Airdopes 141', details: '1) Door-to-Door Replacement Service (D2D)\n2) MSC Replacement Service (Walk-In)' },
      ],
      troubleshootingItems: [
        {
          id: 'tb141-1',
          category: '',
          issue: 'Earbuds not connecting via Bluetooth',
          instructions: [
            'Check if the device is in the range of Bluetooth (usually 10m) and if there are any obstructions in between.',
            'Check to see if the device being connected to supports Bluetooth connection.',
            'Check if it is a passcode issue and, if so, enter ‘0000’.',
            'Check to see if the device being connected to does not have any software issues – check to forget the device on Bluetooth, update the mobile software, if it still does not work, try factory resetting the device.',
            'Check if the pogo pins in the charging case and both earbuds are clean. You may do so by gently cleaning them using a cotton swab dipped in alcohol and try using them again.',
          ],
          finalResolution: 'If nothing else works and there is no physical damage, send the device for replacement.',
        },
        {
          id: 'tb141-2',
          category: 'App',
          issue: 'Earbuds not showing in “My Devices” on the Hearables app',
          instructions: [
            'Check to see if the device is in pairing mode, indicated by alternate blue and red LED flashes on the master earbud and blue LED flashes every 5 seconds on the slave earbud.',
            'Check whether the boAt Hearables app on the media device is updated to the latest version. The app version can be checked from the Google Play Store for Android smartphones and from the App Store for iOS smartphones.',
            'Check whether the case lid is open, and the earbuds have been taken out.',
            'Check if the earbuds are in the range of the media device’s Bluetooth (usually 10m) and if there are any obstructions in between.',
            'Check to see if the media device being connected to supports Bluetooth connections.',
            'Check if the Bluetooth of the media device is turned ON.',
            'Check to see if the device being connected to has no software issues.',
            'Check to forget the earbuds from the device’s Bluetooth paired list, update the mobile software, and if it still does not work, try factory resetting the product.',
            'Check whether closing the app and opening it again solves the issue.',
          ],
          finalResolution: 'If nothing else works and there is no physical damage, send the device for replacement.',
        },
        {
          id: 'tb141-3',
          category: '',
          issue: 'Charging case is not charging',
          instructions: [
            'Check to see if the wire connected to the case is not broken. Use other wires and also ensure that the charger being used is not of 9V or 12V as that will damage the case.',
            'To charge the case, plug one end of the provided cable into the case and connect the other end to a computer or a wall adapter.\n\nNote: The LED located at the bottom of the charging case indicates the battery status of the case. Blue LED flashes 4 times when the battery level is less than 20% (on opening the case lid), blue LED flashes 4 times slowly when the battery level is more than 20% (on opening the case lid), blue LED blinks continuously to indicate the case is charging, and the blue LED stays solid on to indicate full charge.',
            'Check if the pogo pins in the charging case and both earbuds are clean. You may do so by gently cleaning them using a cotton swab dipped in alcohol and try using them again.',
          ],
          finalResolution: 'If nothing else works and there is no physical damage, send the device for replacement',
        },
        {
          id: 'tb141-4',
          category: '',
          issue: 'Earbuds are not charging',
          instructions: [
            'Check to see if the earbuds have been put inside the case in the right orientation.',
            'Check to see if the earbuds are completely charged or not.',
            'Check if the pogo pins in the charging case and both earbuds are clean. You may do so by gently cleaning them using a cotton swab dipped in alcohol and try using them again.',
          ],
          finalResolution: 'If nothing else works, and there is no physical damage, send the device for replacement',
          appDiagnosticsNote: 'Run the Smart Diagnostics function of the boAt Hearables app and check whether there are issues related to the earbud battery. Please note the Smart Diagnostics function in the app can only identify issues related to the firmware and not the hardware.',
        },
        {
          id: 'tb141-5',
          category: '',
          issue: 'Device not entering Stereo Mode/ stuck in Mono Mode',
          instructions: [
            'Place the earbuds in the charging case and then try using them again. Check if it connects automatically.',
            'Check and see if factory resetting the device works.',
            'Check if the pogo pins in the charging case and both earbuds are clean. You may do so by gently cleaning them using a cotton swab dipped in alcohol and try using them again.',
          ],
          finalResolution: 'If nothing else works, and there is no physical damage, send the device for replacement',
        },
        {
          id: 'tb141-6',
          category: '',
          issue: 'The sound is distorted/low volume/low bass/low quality',
          instructions: [
            'Check if the connected device does not have any equalizer settings applied.',
            'Check if third-party Spatial Audio/EQ apps are deactivated in the connected device to avoid any sound abnormalities.',
            'Check if the problem still occurs if the device is moved closer and all obstacles in the middle are removed.',
            'Check if the distortion of sound occurs at all volumes or only at high volumes.',
            'Check with different media players and different devices and whether the distortion happens on all devices or only on specific ones.',
            'Check if the problem occurs at all levels of charging or only at low charging levels.',
            'Check if the earbuds do not have water droplets. In case they do, use a blow dryer from a distance to dry out any water.',
            'Check if the earbuds are clogged with ear wax or dirt. If yes, simply clean the earbuds with a cotton swab dipped in alcohol to resolve the issue.',
          ],
          finalResolution: 'If nothing else works, and there is no physical damage, send the device for replacement',
          appDiagnosticsNote: 'Run the Smart Diagnostics function of the boAt Hearables app and check whether there are any speaker-related issues. Please note the Smart Diagnostics function in the app can only identify issues related to the firmware and not the hardware.',
        },
        {
          id: 'tb141-7',
          category: '',
          issue: 'Earbuds not turning on',
          instructions: [
            'Check to see if the device has been properly charged first- white LED on the case blinks 2 times to indicate that the earbuds are fully charged.',
            'Check if the voltage of the charger is correct for the charging case and if the lights on the bottom of the case are glowing to indicate the charge level.',
            'Check by opening the lid of the charging case (with the earbuds inside) to power on the earbuds. The blue LED should flash for 1 second.',
            'Check if the product was not subjected to any mishandling, broken wires, or exposure to direct sunlight, or hazards like fire.',
          ],
          finalResolution: 'If nothing else works and there is no physical damage, send the device for replacement',
        },
        {
          id: 'tb141-8',
          category: '',
          issue: 'The in-built controls of the product are not working',
          instructions: [
            'Check if the controls do not work while being connected to another device.',
            'Check if the media player being used supports such controls and if the controls do not function on call or with other media players.',
            'Check if the controls have been physically damaged or exposed to any hazards.',
          ],
          finalResolution: 'If nothing else works and there is no physical damage, send the device for replacement',
        },
        {
          id: 'tb141-9',
          category: '',
          issue: 'Occasional disconnects/ one of the earbuds keeps disconnecting',
          instructions: [
            'Check if restarting the device resolves the issue.',
            'Check if the same problem happens for different devices and media players.',
            'Check if there are any obstructions between the earbuds and the device and clear them. Move the device at a closer range to the earbuds and see if this still affects it.',
            'Try factory-resetting the device.',
          ],
          finalResolution: 'If nothing else works and there is no physical damage, send the device for replacement',
        },
        {
          id: 'tb141-10',
          category: '',
          issue: 'If there are other exceptions in the usage of the product',
          instructions: [
            'Check if restarting the device resolves the issue.',
            'Place the earbuds in the charging case and try using them again.',
            'Try factory-resetting the device.',
          ],
          finalResolution: 'If nothing else works and there is no physical damage, send the device for replacement.',
        },
        {
          id: 'tb141-11',
          category: '',
          issue: 'The sound output is muffled',
          instructions: [
            'Check if dust has accumulated inside the earbuds or if there is any obstruction.',
            'Check if earwax has accumulated inside the earbuds.',
            'Check if there is no damage to the tips of the earbuds and see if changing them helps.',
            'Check if sweat or water has gone inside the earbuds.',
          ],
          finalResolution: 'If nothing else works and there is no physical damage, send the device for replacement.',
          appDiagnosticsNote: 'Run the Smart Diagnostics function of the boAt Hearables app and check whether there are speaker issues. Please note the Smart Diagnostics function in the app can only identify issues related to the firmware and not the hardware.',
        },
        {
          id: 'tb141-12',
          category: 'App',
          issue: 'How to check on the Hearables app whether the earbuds are connected or not?',
          instructions: [
            'The boAt Hearables app shows all currently and previously paired devices in the ‘My Devices’ section.',
            'Once Airdopes 141 is paired to your smartphone, the status gets changed to “Connected” in the thumbnail.',
            'Tap the thumbnail to check whether both the left and right earbuds are connected or not. You can also check the battery level of both earbuds.',
          ],
          finalResolution: 'Not Applicable',
        },
        {
          id: 'tb141-13',
          category: 'App',
          issue: 'Can I access the product manual on the Hearables app?',
          instructions: [
            'You can view the product’s manual under the “System” tab of the Hearables app. Go to the ‘User Manual’ section and tap ‘Know More’ to access the user manual.',
          ],
          finalResolution: 'Not Applicable',
        },
        {
          id: 'tb141-14',
          category: '',
          issue: 'Voice is muffled during calls/ Microphone has muffled input',
          instructions: [
            'Check if restarting the device resolves the issue.',
            'Check if dust or earwax has accumulated near or inside the microphone port, and if there is no blockage on the microphone.',
            'Check if sweat or water has gone inside the microphone.',
            'Check if there are any obstructions between the earbuds and the device, and clear them. Move the device at a closer range to the earbud and see if the connection is still affected.',
          ],
          finalResolution: 'If nothing else works and there is no liquid and physical damage, send the device for replacement',
          appDiagnosticsNote: 'Run the Smart Diagnostics function of the boAt Hearables app and check whether there are issues related to the earbud mic. Please note that the Smart Diagnostics function in the app can only identify issues related to the firmware and not the hardware.',
        },
        {
          id: 'tb141-15',
          category: '',
          issue: 'What is Insta Wake N’ Pair (IWP™) technology?',
          instructions: [
            'Our IWP™ technology allows the earbuds to connect to your phone instantaneously upon opening the case if they have already been paired before.',
            'Simply open the case and ensure that the Bluetooth is turned on for your media device. The earbuds will connect as soon as the case is opened without the need to take them out of the case first.',
          ],
          finalResolution: 'Not Applicable',
        },
        {
          id: 'tb141-16',
          category: '',
          issue: 'How to enable IWP™ for my earbuds?',
          instructions: [
            'There is no special process to enable IWP™- simply follow the steps to first pair your Airdopes 141 to your media device. Then, upon subsequent usage, the IWP™ tech will be enabled, and the earbuds will pair automatically to your previously paired media device if Bluetooth is turned on in your media device.',
          ],
          finalResolution: 'Not Applicable',
        },
        {
          id: 'tb141-17',
          category: '',
          issue: 'IWP™ is not working for my earbuds',
          instructions: [
            'Check if your earbuds model has IWP™ tech integrated.',
            'Make sure that you have paired the earbuds at least once before to the device you are trying to use IWP™ with.',
            'Check if Bluetooth is turned on for your media device and if it has Airdopes 141 in the list of paired devices.',
            'Try factory-resetting the device.',
          ],
          finalResolution: 'If IWP™ not working and there is no physical damage, send the device for replacement',
        },
        {
          id: 'tb141-18',
          category: '',
          issue: 'Earbud not charging while inside the case, even when the case is charged',
          instructions: [
            'Check if the charging pins of the case are clear and there is no obstruction.',
            'Check if the charging pins of the earbuds are clear and there is no obstruction.',
            'Check if the orientation of the earbuds inside the case is correct and if they have been properly inserted inside the case.',
            'Check if the pogo pins are clean. You may do so by gently cleaning them using a cotton swab dipped in alcohol.',
          ],
          finalResolution: 'If nothing else works and there is no liquid and physical damage, send the device for replacement',
        },
        {
          id: 'tb141-19',
          category: '',
          issue: 'Can I lower the volume of the voice prompts/turn them off?',
          instructions: [
            'No, the voice prompts are integrated inside the earbuds, and there is no provision to turn them off or lower their volume.',
          ],
          finalResolution: 'Not Applicable',
        },
        {
          id: 'tb141-20',
          category: '',
          issue: 'Can I control the volume of the earbuds through integrated controls?',
          instructions: [
            'No, the earbuds do not have any integrated volume controls on them. The volume has to be controlled using your connected Bluetooth device.',
            'Ensure that in the Bluetooth settings of your media device, you have enabled syncing of Bluetooth and phone volume levels otherwise, you may not be able to fully control the volume of the earbuds as intended.',
          ],
          finalResolution: 'Not Applicable',
        },
        {
          id: 'tb141-21',
          category: '',
          issue: 'Can I submerge my earbuds in the water/swim with them?',
          instructions: [
            'While your earbuds do have IPX4 water and sweat resistance, it is recommended that they not be submerged in water directly or used for prolonged periods inside water, like for swimming/showers, as it may lead to damage.',
          ],
          finalResolution: 'Not Applicable',
        },
        {
          id: 'tb141-22',
          category: '',
          issue: 'Does Airdopes 141 support aptX codec by Qualcomm?',
          instructions: ['No, it does not.'],
          finalResolution: 'Not Applicable',
        },
        {
          id: 'tb141-23',
          category: '',
          issue: 'Does Airdopes 141 have cVc technology by Qualcomm?',
          instructions: ['No, it does not.'],
          finalResolution: 'Not Applicable',
        },
        {
          id: 'tb141-24',
          category: '',
          issue: 'Does my device have dual microphones?',
          instructions: ['Yes, it does.'],
          finalResolution: 'Not Applicable',
        },
        {
          id: 'tb141-25',
          category: '',
          issue: 'Does my device support low latency for gaming?',
          instructions: [
            'Airdopes 141 does support 50 ms low latency for entertainment and casual gaming. But if you’re looking for professional gaming equipment, then Airdopes 141 is not the right product.',
          ],
          finalResolution: 'Not Applicable',
        },
        {
          id: 'tb141-26',
          category: '',
          issue: 'Does my device have AI-Environmental Noise Cancellation technology?',
          instructions: ['No, it does not.'],
          finalResolution: 'Not Applicable',
        },
        {
          id: 'tb141-27',
          category: '',
          issue: 'Does my device have an ANC feature?',
          instructions: ['No, it does not.'],
          finalResolution: 'Not Applicable',
        },
      ],
    },
  },
  {
    id: 'b141-codes-7',
    sectionNumber: '7',
    title: 'ASIN/FSN Codes of boAt Airdopes 141 – (Return Tool)',
    subtitle: '',
    type: 'return_codes',
    archetype: 'table_heavy',
    enabled: true,
    customization: {
      accentColor: '#1e40af',
      showSectionNumber: true,
      tableBorder: true,
      zebraStriping: false,
    },
    content: {
      returnCodes: [
        { id: 'rc141-1', productDesc: 'Airdopes 141 – Matte Charcoal', ean: '8905650134261', asin: '', fsn: '' },
        { id: 'rc141-2', productDesc: 'Airdopes 141 – Lavender Bloom', ean: '8905650134278', asin: '', fsn: '' },
        { id: 'rc141-3', productDesc: 'Airdopes 141 – Lime White', ean: '8905650134285', asin: '', fsn: '' },
      ],
    },
  },
  {
    id: 'b141-annexure-8',
    sectionNumber: '8',
    title: 'Annexure',
    subtitle: 'Testing service SOP & videos, and tutorial video links',
    type: 'annexure',
    archetype: 'table_heavy',
    enabled: true,
    customization: {
      accentColor: '#1e40af',
      showSectionNumber: true,
      tableBorder: true,
      zebraStriping: false,
    },
    content: {
      annexureTestingSop: 'Detailed testing protocols for repair centers: 1. Visual & Physical Inspection; 2. Pogo pin impedance (<0.5Ω); 3. Frequency sweep 20Hz-20kHz; 4. RF range test (10m).',
      annexureTutorialLinks: '',
      annexureItems: [
        {
          id: 'ann141-1',
          category: 'QA Testing',
          sopTitle: 'Testing Service Testing SOP & Videos Link',
          protocols: '● Step 1: Visual and cosmetic casing inspection for hairline cracks or water ingress markers.\n● Step 2: Battery terminal voltage verification across charging cradle and earbud pogo pins.\n● Step 3: Audio spectrum sweep 20 Hz-20 kHz and driver output validation.\n● Step 4: Bluetooth reconnect speed and 10-meter range validation.',
          resourceLink: '',
        },
        {
          id: 'ann141-2',
          category: 'Tutorial Video',
          sopTitle: 'Tutorial Video Links',
          protocols: 'Technical video walkthrough for charging case cleaning, earmuff replacement, and pairing/factory reset SOP for Airdopes 141 (Gen 3).',
          resourceLink: '',
        },
      ],
    },
  },
];

export const defaultMasterDocument: ServicePlanDocument = {
  id: 'doc-boat-airdopes-prime-800d',
  productName: 'boAt Airdopes Prime 800D',
  category: 'TWS',
  deviceType: 'SDK',
  brand: 'boAt',
  modelCode: 'AD-PRIME-800D',
  docOwner: 'Product Manager - Audio Division',
  version: '1.2 (Service Master)',
  lastUpdated: '2026-08-26',
  themeColor: '#1e40af',
  watermark: 'OFFICIAL SERVICE PLAN - AUTHORIZED USE ONLY',
  showHeaderFooter: true,
  fontSize: 'normal',
  blocks: boatAirdopesPrime800DBlocks,
};

export const DEFAULT_BOAT_AIRDOPES_800D: ServicePlanDocument = defaultMasterDocument;

export const airdopes141Document: ServicePlanDocument = {
  id: 'doc-boat-airdopes-141-gen3',
  productName: 'boAt Airdopes 141 (Gen 3)',
  category: 'TWS',
  deviceType: 'Non-SDK',
  brand: 'boAt',
  modelCode: 'AD-141-GEN3',
  docOwner: 'Product Manager - Audio Division',
  version: '1.0 (Service Master)',
  lastUpdated: '2026-08-31',
  themeColor: '#1e40af',
  watermark: 'OFFICIAL SERVICE PLAN - AUTHORIZED USE ONLY',
  showHeaderFooter: true,
  fontSize: 'normal',
  blocks: boatAirdopes141Blocks,
};

// ============================================================================
// PRODUCT + MODE CONTENT ISOLATION LAYER
// The selected Product + selected SDK/Non-SDK Mode is the single source of
// truth for every preset document. Derived presets are built through
// buildDerivedDocument() which guarantees that no block content is shared by
// reference with any other product and no foreign product identity remains.
// ============================================================================

const deepClone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

/** Known product identity tokens used for rebinding and isolation validation. */
export const KNOWN_PRODUCT_TOKENS = [
  'Airdopes Prime 800D',
  'Airdopes 141',
  'Rockerz 330 Pro Max',
  'Nirvana 751 ANC',
];

/** Recursively apply string replacements to every string field of a value. */
const rebindStringsDeep = <T,>(value: T, replacements: [RegExp, string][]): T => {
  if (typeof value === 'string') {
    return replacements.reduce((acc, [re, to]) => acc.replace(re, to), value as string) as unknown as T;
  }
  if (Array.isArray(value)) {
    return value.map(v => rebindStringsDeep(v, replacements)) as unknown as T;
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(value as Record<string, unknown>)) {
      out[k] = rebindStringsDeep((value as Record<string, unknown>)[k], replacements);
    }
    return out as unknown as T;
  }
  return value;
};

/**
 * Resolve the Hearables App content for a given document + SDK/Non-SDK mode.
 * A product's own authored app content is used only when it matches the
 * requested mode; otherwise the mode-correct generic configuration is used.
 * Content from another product or from the other mode can never be returned.
 */
export const getHearablesContentForProduct = (
  documentId: string,
  deviceType: DeviceType
): ServicePlanBlock['content'] => {
  const ownContentByProduct: Record<string, Partial<Record<DeviceType, ServicePlanBlock['content'] | undefined>>> = {
    'doc-boat-airdopes-prime-800d': {
      'SDK': boatAirdopesPrime800DBlocks.find(b => b.type === 'hearables_app')?.content,
    },
    'doc-boat-airdopes-141-gen3': {
      'Non-SDK': boatAirdopes141Blocks.find(b => b.type === 'hearables_app')?.content,
    },
  };
  const own = ownContentByProduct[documentId]?.[deviceType];
  if (own) return deepClone(own);
  return getHearablesContentForDeviceType(deviceType);
};

interface DerivedDocumentOptions {
  id: string;
  productName: string;
  shortName: string;
  category: ServicePlanDocument['category'];
  deviceType: DeviceType;
  modelCode: string;
  specifications: { id: string; key: string; value: string; highlight?: boolean }[];
  specNote?: string;
}

/**
 * Build a fully isolated document for a derived product preset.
 * Guarantees:
 *  • Blocks are deep-cloned — nothing is shared by reference with other presets
 *  • Every occurrence of the base product's name is rebound to the new product
 *  • Product-exclusive data that cannot be inherited (colour variants, ASIN/FSN
 *    return codes, physical weight/dimension values) is cleared, never borrowed
 *  • Hearables App content is loaded strictly from the selected SDK/Non-SDK mode
 */
const buildDerivedDocument = (opts: DerivedDocumentOptions): ServicePlanDocument => {
  const replacements: [RegExp, string][] = [
    [/boAt Airdopes Prime 800D/g, opts.productName],
    [/Airdopes Prime 800D/g, opts.shortName],
  ];

  const blocks: ServicePlanBlock[] = deepClone(boatAirdopesPrime800DBlocks).map(block => {
    const b = rebindStringsDeep(block, replacements) as ServicePlanBlock;
    switch (b.type) {
      case 'specifications_table':
        return {
          ...b,
          content: { ...b.content, specifications: deepClone(opts.specifications) },
          customization: { ...b.customization, noteText: opts.specNote || '' },
        };
      case 'colour_variants':
        // Colour variants are strictly product-specific — never inherited
        return { ...b, content: { ...b.content, colourVariants: [] } };
      case 'weight_matrix':
        // Physical dimensions/weights are strictly product-specific — never inherited
        return {
          ...b,
          content: {
            ...b.content,
            weightMatrix: { product: opts.productName, length: '', breadth: '', height: '', earbudsWeight: '', caseWeight: '' },
            weightMatrixRows: [],
          },
        };
      case 'return_codes':
        // ASIN/FSN/EAN codes are strictly product-specific — never inherited
        return { ...b, content: { ...b.content, returnCodes: [] } };
      case 'hearables_app':
        // App content is loaded strictly from the selected SDK/Non-SDK mode
        return { ...b, content: getHearablesContentForDeviceType(opts.deviceType) };
      default:
        return b;
    }
  });

  return {
    ...deepClone(defaultMasterDocument),
    id: opts.id,
    productName: opts.productName,
    category: opts.category,
    deviceType: opts.deviceType,
    modelCode: opts.modelCode,
    blocks,
  };
};

export const neckbandDocument: ServicePlanDocument = buildDerivedDocument({
  id: 'doc-neckband-master',
  productName: 'boAt Rockerz 330 Pro Max',
  shortName: 'Rockerz 330 Pro Max',
  category: 'Neckband',
  deviceType: 'SDK',
  modelCode: 'RCKZ-330-PRO',
  specifications: [
    { id: 'sp-1', key: 'Product Name', value: 'Rockerz 330 Pro Max', highlight: true },
    { id: 'sp-2', key: 'Headphone Type', value: 'Wireless Bluetooth Neckband' },
    { id: 'sp-3', key: 'Bluetooth Version', value: 'v5.3' },
    { id: 'sp-4', key: 'Music Playtime', value: 'Up to 60 hours at 60% volume', highlight: true },
    { id: 'sp-5', key: 'Driver Size', value: '10 mm*2 Dynamic Bass Drivers' },
    { id: 'sp-6', key: 'Fast Charging', value: 'ASAP™ Charge: 10 mins = 20 hrs playtime' },
    { id: 'sp-7', key: 'Magnetic Smart Power', value: 'Yes (Separate buds to power ON, snap together to power OFF)' },
  ],
  specNote: 'Music Playtime of 60 hours per charge is based on listening to music at 60% volume. Listening to music/audio files at more than 60% volume will reduce the playtime.',
});

export const nirvana751Document: ServicePlanDocument = buildDerivedDocument({
  id: 'doc-headphones-master',
  productName: 'boAt Nirvana 751 ANC',
  shortName: 'Nirvana 751 ANC',
  category: 'Headphones',
  deviceType: 'SDK',
  modelCode: 'NRVN-751-ANC',
  specifications: [
    { id: 'sp-1', key: 'Product Name', value: 'Nirvana 751 ANC', highlight: true },
    { id: 'sp-2', key: 'Headphone Type', value: 'Over-Ear Wireless ANC Headphones' },
    { id: 'sp-3', key: 'Active Noise Cancellation', value: 'Hybrid ANC up to 33dB', highlight: true },
    { id: 'sp-4', key: 'Driver Size', value: '40 mm High-Definition Drivers' },
    { id: 'sp-5', key: 'Playback Time', value: '65 Hours (ANC OFF) / 54 Hours (ANC ON)' },
    { id: 'sp-6', key: 'Dual Mode Connectivity', value: 'Bluetooth v5.0 + 3.5mm AUX Cable' },
  ],
  specNote: 'Playback time of 65 hours (ANC OFF) / 54 hours (ANC ON) per charge is based on listening to music at 60% volume. Listening at higher volume will reduce the playtime.',
});

// Single source of truth: both preset registries reference the SAME documents.
export const AUDIO_PRODUCT_PRESETS: Record<string, ServicePlanDocument> = {
  'tpl-boat-prime': defaultMasterDocument,
  'tpl-airdopes-141': airdopes141Document,
  'tpl-neckband': neckbandDocument,
  'tpl-headphones': nirvana751Document,
};

export const sampleTemplates: { id: string; name: string; category: any; description: string; document: ServicePlanDocument }[] = [
  {
    id: 'tpl-boat-prime',
    name: 'boAt Airdopes Prime 800D (Full 18-Page Plan)',
    category: 'TWS',
    description: 'Complete preloaded service plan document with all 7 core sections, Dolby Audio specs, Touch gesture matrix, LED states, and Diagnostic SOPs.',
    document: defaultMasterDocument,
  },
  {
    id: 'tpl-airdopes-141',
    name: 'boAt Airdopes 141 (Gen 3) — Non-SDK Plan',
    category: 'TWS',
    description: 'Non-SDK reference blueprint: 50 hrs playtime, ENx™ quad mics, BEAST™ 50ms mode, IPX4, dual-tone colours, reduced Sound/System app set, and full diagnostics FAQ.',
    document: airdopes141Document,
  },
  {
    id: 'tpl-neckband',
    name: 'Standard Wireless Neckband Service Plan',
    category: 'Neckband',
    description: 'Optimized blueprint for Bluetooth neckbands featuring Magnetic Hall switch power controls, Inline 3-button specs, and vibration motor diagnostics.',
    document: neckbandDocument,
  },
  {
    id: 'tpl-headphones',
    name: 'Wireless ANC Over-Ear Headphone Plan',
    category: 'Headphones',
    description: 'Service plan for premium active noise cancelling over-ear headphones with 40mm drivers, AUX bypass, and ANC circuit diagnostics.',
    document: nirvana751Document,
  },
];

/**
 * Validate that a document contains no content belonging to another product
 * or to the other SDK/Non-SDK mode. Returns a list of violations (empty = OK).
 */
export const validateDocumentIsolation = (doc: ServicePlanDocument): string[] => {
  const violations: string[] = [];
  const foreignTokens = KNOWN_PRODUCT_TOKENS.filter(t => !doc.productName.includes(t));
  for (const block of doc.blocks) {
    if (!block.enabled) continue;
    const serialized = `${block.title} ${JSON.stringify(block.content)}`;
    for (const token of foreignTokens) {
      if (serialized.includes(token)) {
        violations.push(`Block "${block.title}" (${block.type}) contains content from another product: "${token}"`);
      }
    }
    if (block.type === 'hearables_app' && doc.deviceType === 'Non-SDK') {
      const tabs = block.content.hearablesAppTabs || [];
      if (tabs.some(t => t.mockupType === 'touch')) {
        violations.push('Non-SDK document contains the SDK-only "Touch" app tab');
      }
    }
  }
  return violations;
};
