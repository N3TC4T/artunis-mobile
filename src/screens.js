import { Navigation } from 'react-native-navigation';

import Intro from '@modules/intro';
import Splash from '@modules/splash';

// Setup Screen's
import { setupPassword, setupPaperKey, setupComplete } from '@modules/account/setup';

// Recovery Screen's
import { setPassword, recoverPaperKey } from '@modules/account/recover';

// Account Screen's
import Login from '@modules/account/login';

// Wallet's Screen's
import {
    Wallets,
    WalletSend,
    WalletReceive,
    RecipientPicker,
    SignTransaction,
    ConfirmSend,
    WalletTransactions,
    TransactionDetails,
    ImportWallet,
} from '@modules/wallets';

// Contacts Screen
import { Contacts, AddContact } from '@modules/contacts';

import Scan from '@modules/scan';

// Global
import { Drawer, Picker, Scanner, Vault } from '@modules/_global';

// register all screens of the app (including internal ones)
export function registerScreens(store, Provider) {
    Navigation.registerComponent('app.Intro', () => Intro, store, Provider);
    Navigation.registerComponent('app.Splash', () => Splash, store, Provider);
    // Account Screen's
    Navigation.registerComponent('app.Login', () => Login, store, Provider);
    // Setup Screen's
    Navigation.registerComponent('app.Setup.Password', () => setupPassword, store, Provider);
    Navigation.registerComponent('app.Setup.PaperKey', () => setupPaperKey, store, Provider);
    Navigation.registerComponent('app.Setup.Complete', () => setupComplete, store, Provider);
    // Recover Screen's
    Navigation.registerComponent('app.Recover.PaperKey', () => recoverPaperKey, store, Provider);
    Navigation.registerComponent('app.Recover.SetPassword', () => setPassword, store, Provider);
    // Wallet's Screen's
    Navigation.registerComponent('app.Wallets', () => Wallets, store, Provider);
    Navigation.registerComponent('app.ImportWallet', () => ImportWallet, store, Provider);
    Navigation.registerComponent('app.WalletSend', () => WalletSend, store, Provider);
    Navigation.registerComponent('app.WalletSend.RecipientPicker', () => RecipientPicker, store, Provider);
    Navigation.registerComponent('app.WalletSend.SignTransaction', () => SignTransaction, store, Provider);
    Navigation.registerComponent('app.WalletSend.ConfirmSend', () => ConfirmSend, store, Provider);
    Navigation.registerComponent('app.WalletReceive', () => WalletReceive, store, Provider);
    Navigation.registerComponent('app.WalletTransactions', () => WalletTransactions, store, Provider);
    Navigation.registerComponent('app.TransactionDetails', () => TransactionDetails, store, Provider);
    // Contact Screen
    Navigation.registerComponent('app.Contacts', () => Contacts, store, Provider);
    Navigation.registerComponent('app.Contacts.AddContact', () => AddContact, store, Provider);
    // Global
    Navigation.registerComponent('app.Drawer', () => Drawer, store, Provider);
    Navigation.registerComponent('app.Picker', () => Picker, store, Provider);
    Navigation.registerComponent('app.Scanner', () => Scanner, store, Provider);
    Navigation.registerComponent('app.Vault', () => Vault, store, Provider);
    // Scan Screen
    Navigation.registerComponent('app.Scan', () => Scan, store, Provider);
}
