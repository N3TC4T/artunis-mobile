### Preamble
The security of the Artunis relies on the following: 
- iOS & Android App Sandbox
- Minimisation of Unencrypted keys in memory.
- Encrypted at rest storage.


#### iOS & Android App Sandbox
iOS & Android by default sandboxes every application that a user has on their phone. 

The wallet's primary defence is the application sandbox. This protects the wallet's memory when in use, stopping attackers who have physical access to the device from dumping the memory and analysing the data for the seed. 

In terms of external attacks, the application only ever communicates with the outside world through the Ripple javascript client library. Additionally the configured remote node is the only host it will communicate with. 

However the sandbox can be breached if the device is jailbroken or rooted. These devices are vastly less secure as the process breaks the protections built into iOS & Android. 

#### Minimisation of unencrypted keys in memory
The application is designed not to store the seed in memory. Every time the seed is used in an Ripple related function it is loaded from the iOS and Android keychain, decrypted, used and destroyed. This process, while creating overhead in the application, is necessary to minimise the possibility of capturing the seed when a attacker has successfully gained access to the sandbox memory.


#### Encrypted at rest storage
The wallet stores the seed in the iOS and Android keychain. This is a special part of the OS that is reserved for sensitive data. This data is only accessible by the  wallet application and only when the device is unencrypted (i.e unlocked or without passcode).

for imported seeds , each secret is encrypted with the main seed using encrypted "box" and the whole app storage is encrypted with Device UUID . 

Not only is this partition protected from external sources, if an attacker is able to access this storage the keys are faced with a encrypted 'box' that is encrypted with the user passphrase. At this level of effort it would be easier to find other means of retrieving the key from you personally. 


## Basic Encryption and Decryption flows

![photo5812262792684744019](https://user-images.githubusercontent.com/6250203/37844988-f9468798-2ee6-11e8-96b3-55adf5faf15c.jpg)
