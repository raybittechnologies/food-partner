// constants/docMeta.js
// Maps a document's title (as returned by the API) to the icon + subtitle
// shown on its card. Add new entries here as new document types are introduced.

export const DOC_META = {
    'Personal Information': {
        icon: 'person-outline',
        subtitle: 'Basic details & emergency contacts',
    },
    'Delivery Documents': {
        icon: 'document-text-outline',
        subtitle: 'Government ID, Driving License',
    },
    'Vehicle Details': {
        icon: 'car-outline',
        subtitle: 'RC book & vehicle insurance',
    },
    'Work Type': {
        icon: 'briefcase-outline',
        subtitle: 'Select shifts & delivery zones',
    },
    'Bank Details': {
        icon: 'card-outline',
        subtitle: 'For weekly payouts & incentives',
    },
}

const DEFAULT_META = {
    icon: 'document-outline',
    subtitle: '',
}

export const getDocMeta = (title) => DOC_META[title] || DEFAULT_META