// NOT the actual data structures, just a scratchpad of my thoughts
interface GeneralData {
    reasonForTravel: 'tourism' | 'business' | 'medical' | 'study' | 'other'
    // name is redundant to the validation
    firstName: string
    lastName: string
    middleName: string
    birthDate: Date
    passportExpiry: Date // must be valid 6 months after end date of visit 
    otherVisitedCountries: string[];
    previousVISAAttempts: {
        status: "accepted" | "rejected",
        start: Date
        end: Date
    }[]
}

interface TravelItinerary {
    startDate: Date
    endDate: Date
}

export const assetTypes = ['property', 'vehicle', 'savings', 'jewelry', 'collectibles', 'life insurance', 'other']
export const assetTypeSchema = [
    {
        label: 'Select Asset Type',
        value: '',
        selected:true,
        attrs: {
            disabled:true,
        }
    },
    {
        'label': 'Property',
    },
    {
        'label': 'Vehicle',
    },
    {
        'label': 'Savings',
    },
    {
        'label': 'Jewelry',
    },
    {
        'label': 'Collectibles',
    },
    {
        'label': 'Life Insurance',
    },
    {
        'label': 'Other',
    },
]

