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

interface Asset {
    name: string;
    valueDollars: number;
    type: 'property' | 'vehicle' | 'savings' | 'jewelry' | 'collectibles' | 'life insurance' | 'other'
}
interface ProveTies {
    career: {
        annualSalaryDollars: number
    }
    family: {
        spouse: boolean
        children: number
    }
    personalAssets: Asset[]
    schoolEnrollment: boolean
    VolunteerWork: string[]
    OrganizationMembership: {
        name: string
        memberSince: Date
        membershipExpiry: Date
    }[]
}

// Use Travel Rejection Reason to encode the ProvieTies
