export interface Asset {
    name: string;
    valueDollars: string;
    type: 'property' | 'real estate' | 'cars' | 'motorbicycles' | 'savings' | 'business' | 'jewelry' | 'collectibles' | 'life insurance' | 'other'
}
interface Organization {
    name: string
    memberSince: Date
    membershipExpiry: Date
}
export interface ProveTies<B> {
    monthlySalaryDollars: number
    married: B
    children: number
    assets: Asset[]
    schoolEnrollment: B
    volunteerWork: string[]
    organizations: Organization[]
    countriesVisited: number
}

function validOrganization(o: Organization) {
    // check name is not empty
    if (!o.name) {
        return false
    }
    if (!o.memberSince || !o.membershipExpiry) {
        return false
    }
    return o.memberSince < o.membershipExpiry
}

/**
 * Scoring:
 * - assets: 40%
 * - annual salary: ideal:20%, max: 40%
 * - married: 15%
 * - children: min:-5%, ideal:10%, max: 15%
 * - organizations: 5%
 * - school enrollment: 5%
 * - volunteer work: 5%
 */
export function evaluateApplicant(
    ties: ProveTies<'yes' | 'no'>,
    organizations: Organization[] = [],
    assets: Asset[]
) {
    // Define tresholds:
    // if score is >=:
    // Great eligibility: 90
    // Good eligibility: 70
    // Fair eligibility: 50
    // Poor eligibility: 30
    // Ineligible: 0
    const evaluations: { score: number, label: string }[] = []
    if (ties === undefined) {
        return evaluations
    }
    // organization count: max 10%
    // 0 = 0%
    // 1-3 = 5%
    // 4-6 = 7%
    // 7-10 = 10%
    const _orgs = organizations.filter(validOrganization)
    if (_orgs.length >= 7) {
        evaluations.push({ score: 10, label: 'organizations' })
    } else if (_orgs.length >= 4) {
        evaluations.push({ score: 7, label: 'organizations' })
    } else if (_orgs.length >= 1) {
        evaluations.push({ score: 5, label: 'organizations' })
    }

    // volunteer work: ideal: 5%
    // excess max: 10%
    // 0 = 0%
    // 1-2 = 2%
    // 3-4 = 3%
    // 5-7 = 5%
    // >8 = 10%
    if (ties.volunteerWork) {
        let score = 10
        if (ties.volunteerWork.length >= 8) {
            score = 10
        } else if (ties.volunteerWork.length >= 5) {
            score = 5
        } else if (ties.volunteerWork.length >= 3) {
            score = 3
        } else if (ties.volunteerWork.length >= 1) {
            score = 2
        } else {
            score = 0
        }
        evaluations.push({ score, label: 'volunteerWork' })
    }
    // enrolled
    evaluations.push({ score: ties.schoolEnrollment == 'yes' ? 15 : 0, label: 'schoolEnrollment' })

    // married: 10%
    evaluations.push({ score: ties.married == 'yes' ? 15 : 0, label: 'married' })

    if (typeof ties.children == 'string') {
        let score = 0
        const children = parseInt(ties.children)
        if (children >= 3) {
            score = 35
        } else if (children >= 1) {
            score = 15
        }
        evaluations.push({ score, label: 'children' })
    }

    if (ties.monthlySalaryDollars) {
        const IDEAL = 2_000
        let score = 0 // < 2k
        if (ties.monthlySalaryDollars >= IDEAL) {
            score = lerpIdealScoreWithExcess({
                value: ties.monthlySalaryDollars,
                idealValue: IDEAL,
                scaler: 120, // at this scale, 5K will give 25, thefore the score will be 50
                idealScore: 25,
                excessScore: 60
            })
        }
        evaluations.push({ score, label: 'monthlySalaryDollars' })
    }
    evaluations.push({ score: evalAssets(assets), 'label': 'assets' })

    // Travel history
    if (ties.countriesVisited) {
        const IDEAL = 1
        let score = 0
        if (ties.countriesVisited >= IDEAL) {
            score = lerpIdealScoreWithExcess({
                value: ties.countriesVisited,
                idealValue: IDEAL,
                scaler: 0.0005,
                idealScore: 15,
                excessScore: 45
            })
        }
        evaluations.push({ score, label: 'travelledCountries' })
    }

    return evaluations
}

/**
 * max score = idealScore + excessScore
 * scaler works by dividing the excess by the scaler, for every time the scaler is reached, the score increases by 1, up to the excessScore
 */
function lerpIdealScoreWithExcess({
    value,
    idealValue,
    scaler,
    idealScore,
    excessScore,
}: Record<string, number>) {
    const excess = (value - idealValue) / scaler;
    const t = Math.min(1, excess / excessScore);
    return lerp(idealScore, idealScore + excessScore, t);
}

function lerp(a: number, b: number, t: number) {
    return a + t * (b - a);
}
/**
 * threshold of of 20k, return 25, for every excess 5k, add 1%, up to extra 50%
 * max score: 75
 */
function evalAssets(assets: Asset[]) {
    const totalAssets = assets
        .map(a => parseInt(a.valueDollars) || 0)
        .reduce((sum, n) => sum + n, 0)
    const IDEAL = 5_000 // USD
    if (totalAssets < IDEAL) {
        return 0
    }
    console.log(totalAssets)
    return lerpIdealScoreWithExcess({
        value: totalAssets,
        idealValue: IDEAL,
        scaler: 1_000,
        idealScore: 25,
        excessScore: 50
    })
}
