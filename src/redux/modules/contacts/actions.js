import { ActionTypes } from '@constants/';

export const saveContact = contact => (dispatch, getState) =>
    new Promise(async (resolve, reject) => {
        const contacts = getState()
            .get('contacts')
            .toJS();

        if (contacts.findIndex(i => i.address === contact.address) !== -1) {
            return reject(new Error('Address Already Exist!'));
        }

        dispatch({
            type: ActionTypes.SET_CONTACT,
            payload: contact,
        });

        return resolve('success');
    });
