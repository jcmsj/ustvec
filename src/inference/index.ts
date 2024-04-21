export interface Asset {
    name: string;
    valueDollars: number;
    type: 'property' | 'vehicle' | 'savings' | 'jewelry' | 'collectibles' | 'life insurance' | 'other'
}
export interface ProveTies {
    career: {
        annualSalaryDollars: number
    }
    family: {
        married: boolean
        children: number
    }
    assets: Asset[]
    schoolEnrollment: boolean
    VolunteerWork: string[]
    OrganizationMembership: {
        name: string
        memberSince: Date
        membershipExpiry: Date
    }[]
}
function evaluateTies(ties: ProveTies) {
    
}
