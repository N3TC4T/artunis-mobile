import { createSelector } from 'reselect';

const contactsState = state => state.get('contacts');

export const contactsSelector = createSelector([contactsState], contacts => contacts.toJS());
